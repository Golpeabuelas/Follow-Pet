import Router from 'express';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

import connection from '../connection.js';
import { verifyToken } from '../functions.js';
dotenv.config();

const record = Router();

record.post("/send-client-request", async (req, res) => {
	const { nombre_usuario, correo_usuario, token } = req.body;

	const userData = verifyToken(token);
	if (userData.status !== 200) {
		return res.json({ status: userData.status, error: userData.message });
	}

	const idVeterinario = userData.user.id_usuario;

	try {
		const clienteRes = await connection.query(
			`SELECT id_usuario FROM usuario WHERE nombre_usuario = $1 AND correo_usuario = $2`,
			[nombre_usuario, correo_usuario]
		);

		if (clienteRes.rows.length === 0) {
			return res.json({ status: 500, error: "Usuario no encontrado con ese correo y nombre." });
		}

		const idCliente = clienteRes.rows[0].id_usuario;

		const idNotificacion = uuidv4();

		await connection.query(
			`INSERT INTO notificacion
			(id_notificacion, id_mensajero, id_destinatario, id_estatus, descripcion_mensaje)
			VALUES ($1, $2, $3, 3, $4)`,
			[
				idNotificacion,
				idVeterinario,
				idCliente,
				`El veterinario te ha enviado una solicitud para que seas su cliente. Por favor acepta o rechaza la relación.`
			]
		);

		return res.json({ status: 200, message: "Notificación de confirmación enviada al cliente." });
	} catch (error) {
		console.error("Error en /send-client-request:", error);
		return res.json({ status: 500, error: "Error del servidor." });
	}
});

record.post("/respond-client-request", async (req, res) => {
	const { idNotificacion, aceptado, token } = req.body;

	const userData = verifyToken(token);
	if (userData.status !== 200) {
		return res.json({ status: userData.status, error: userData.message });
	}

	const idCliente = userData.user.id_usuario;

	try {
		const notiRes = await connection.query(
			`SELECT id_mensajero, id_destinatario FROM notificacion WHERE id_notificacion = $1 AND id_destinatario = $2 AND id_estatus = 3`,
			[idNotificacion, idCliente]
		);

		if (notiRes.rows.length === 0) {
			return res.json({ status: 404, error: "Notificación no encontrada o ya respondida." });
		}

		const idVeterinario = notiRes.rows[0].id_mensajero;

		if (aceptado) {
            console.log('entro')
            console.log('cliente wapo', idCliente)
            console.log('vet fea', idVeterinario)

            const idNewRelation = uuidv4()
			await connection.query(
				`INSERT INTO cliente_veterinario (id_cliente_veterinario, id_cliente, id_veterinario) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING`,
				[idNewRelation, idCliente, idVeterinario]
			);

			await connection.query(
				`UPDATE notificacion SET id_estatus = 4 WHERE id_notificacion = $1`,
				[idNotificacion]
			);

			const idNotiVeterinario = uuidv4();
			await connection.query(
				`INSERT INTO notificacion
				(id_notificacion, id_mensajero, id_destinatario, id_estatus, descripcion_mensaje)
				VALUES ($1, $2, $3, 5, $4)`,
				[
					idNotiVeterinario,
					idCliente,
					idVeterinario,
					`El cliente ha aceptado tu solicitud. Ya están vinculados.`
				]
			);

			return res.json({ status: 200, message: "Relación aceptada y notificación enviada." });

		} else {
			await connection.query(
				`UPDATE notificacion SET id_estatus = 6 WHERE id_notificacion = $1`,
				[idNotificacion]
			);

			const idNotiVeterinario = uuidv4();
			await connection.query(
				`INSERT INTO notificacion
				(id_notificacion, id_mensajero, id_destinatario, id_estatus, descripcion_mensaje)
				VALUES ($1, $2, $3, 6, $4)`,
				[
					idNotiVeterinario,
					idCliente,
					idVeterinario,
					`El cliente ha rechazado tu solicitud.`
				]
			);

			return res.json({ status: 200, message: "Relación rechazada y notificación enviada." });
		}
	} catch (error) {
		console.error("Error en /respond-client-request:", error);
		return res.json({ status: 500, error: "Error del servidor." });
	}
});

record.get("/get-vet-clients/:token", async (req, res) => {
    const { token } = req.params;

    const userData = verifyToken(token);
    
    if (userData.status !== 200) {
        return res.json({ status: userData.status, error: userData.message });
    }

    const idVeterinario = userData.user.id_usuario;

    try {
        const result = await connection.query(`
        SELECT 
            u.id_usuario,
            u.nombre_usuario,
            u.correo_usuario,
            u.foto_usuario
        FROM cliente_veterinario cv
        JOIN usuario u ON cv.id_cliente = u.id_usuario
        WHERE cv.id_veterinario = $1
        `, [idVeterinario]);

        res.json({ status: 200, clients: result.rows });
    } catch (error) {
        console.error("Error al obtener clientes del veterinario:", error);
        res.json({ status: 500, error: "Error del servidor al obtener clientes." });
    }
});

record.get("/get-client-details/:id_usuario", async (req, res) => {
    const { id_usuario } = req.params;

    try {
        const result = await connection.query(`
            SELECT 
                u.id_usuario,
                u.nombre_usuario,
                u.foto_usuario,

                COALESCE(
                json_agg(DISTINCT jsonb_build_object(
                    'id_mascota', m.id_mascota,
                    'nombre', m.nombre_mascota,
                    'edad', m.edad_mascota,
                    'color', m.color_mascota,
                    'foto', m.foto_mascota
                )) FILTER (WHERE m.id_mascota IS NOT NULL),
                '[]'
                ) AS mascotas

            FROM usuario u
            LEFT JOIN mascota m ON m.id_usuario = u.id_usuario
            WHERE u.id_usuario = $1
            GROUP BY u.id_usuario
            `, [id_usuario]);

        if (result.rows.length === 0) {
            return res.json({ status: 404, error: "Cliente no encontrado." });
        }

        res.json({ status: 200, usuario: result.rows[0] });
    } catch (error) {
        console.error("Error al obtener detalles del cliente:", error);
        res.json({ status: 500, error: "Error del servidor." });
    }
});

record.get('/check-record/:id_mascota', async (req, res) => {
    const { id_mascota } = req.params;

    try {
        const result = await connection.query(`
            SELECT e.id_expediente
            FROM expediente e
            WHERE e.id_mascota = $1
            LIMIT 1
            `, [id_mascota]);

        if (result.rows.length > 0) {
            return res.json({ status: 200, exists: true, id_expediente: result.rows[0].id_expediente });
        } else {
            return res.json({ status: 200, exists: false });
        }
    } catch (error) {
        console.error('Error en /check-record:', error);
        return res.json({ status: 500, error: 'Error del servidor.' });
    }
});

record.post('/create-record', async (req, res) => {
    const { id_mascota, token } = req.body;

    const userData = verifyToken(token);

    if (userData.status !== 200) {
        return res.json({ status: userData.status, error: userData.message });
    }

    const id_veterinario = userData.user.id_usuario;

    try {
        const mascotaRes = await connection.query(`SELECT nombre_mascota, id_usuario FROM mascota WHERE id_mascota = $1`, [id_mascota])

        if (mascotaRes.rows.length === 0) {
            return res.json({ status: 404, error: "Mascota no encontrada." });
        }

        const { nombre_mascota, id_usuario: id_dueño } = mascotaRes.rows[0]

        const titulo_publicacion = 'Expediente médico ' + nombre_mascota

        const id_publicacion = uuidv4()
        const pubRes = await connection.query(`
            INSERT INTO publicacion (id_publicacion, id_usuario, titulo_publicacion, id_estatus)
            VALUES ($1, $2, $3, 4)
            RETURNING id_publicacion
            `, [id_publicacion, id_veterinario, titulo_publicacion]);

        const id_expediente = pubRes.rows[0].id_publicacion;

        await connection.query(`
        INSERT INTO expediente (id_expediente, id_mascota)
        VALUES ($1, $2)
        `, [id_expediente, id_mascota]);

        await connection.query(`
        INSERT INTO expediente_usuario (id_expediente, id_usuario)
        VALUES ($1, $2)
        `, [id_expediente, id_veterinario]);

        await connection.query(
			`INSERT INTO expediente_usuario (id_expediente, id_usuario)
			VALUES ($1, $2)`,
			[id_expediente, id_dueño]
		)

        res.json({ status: 200, message: "Expediente creado exitosamente.", id_expediente });
    } catch (error) {
        console.error("Error en /create-record:", error);
        res.json({ status: 500, error: "Error al crear expediente." });
    }
});

record.get("/get-record-details/:id_expediente", async (req, res) => {
    const { id_expediente } = req.params

    try {
        const result = await connection.query(`
            SELECT 
                e.id_expediente,
                p.titulo_publicacion AS titulo_publicacion,

                m.id_mascota,
                m.nombre_mascota,
                m.edad_mascota,
                m.color_mascota,
                m.foto_mascota,

                u.id_usuario AS id_dueño,
                u.nombre_usuario AS nombre_dueño,
                u.correo_usuario AS correo_dueño,
                u.foto_usuario AS foto_dueño,

                COALESCE(
                    json_agg(DISTINCT jsonb_build_object(
                        'id_seguimiento', s.id_seguimiento,
                        'titulo', s.titulo_seguimiento,
                        'detalle', s.seguimiento,
                        'estatus', es.estatus
                    )) FILTER (WHERE s.id_seguimiento IS NOT NULL),
                    '[]'
                ) AS seguimientos

            FROM expediente e
            JOIN publicacion p ON p.id_publicacion = e.id_expediente
            JOIN mascota m ON e.id_mascota = m.id_mascota
            JOIN usuario u ON m.id_usuario = u.id_usuario
            LEFT JOIN seguimiento s ON e.id_expediente = s.id_expediente
            LEFT JOIN estatus_seguimiento es ON s.id_estatus = es.id_estatus

            WHERE e.id_expediente = $1
            GROUP BY 
                e.id_expediente, p.titulo_publicacion,
                m.id_mascota,
                u.id_usuario
        `, [id_expediente])

        if (result.rows.length === 0) {
            return res.json({ status: 404, error: "Expediente no encontrado." })
        }

        res.json({ status: 200, expediente: result.rows[0] })
    } catch (error) {
        console.error("Error en /get-record-details:", error)
        res.json({ status: 500, error: "Error al obtener el expediente." })
    }
})

record.post("/add-follow-up", async (req, res) => {
    const { id_expediente, id_estatus, titulo_seguimiento, seguimiento, token } = req.body;

    if (!id_expediente || !id_estatus || !titulo_seguimiento || !seguimiento || !token) {
        return res.json({ status: 400, error: "Faltan campos obligatorios." });
    }

    const userData = verifyToken(token);
    if (userData.status !== 200) {
        return res.json({ status: userData.status, error: userData.message });
    }

    const id_veterinario = userData.user.id_usuario;

    try {
        const expedienteResult = await connection.query(`
            SELECT 
                p.titulo_publicacion, 
                u.id_usuario
            FROM expediente e
            JOIN publicacion p ON e.id_expediente = p.id_publicacion
            JOIN mascota m ON e.id_mascota = m.id_mascota
            JOIN usuario u ON m.id_usuario = u.id_usuario
            WHERE e.id_expediente = $1
            `, [id_expediente]);

        if (expedienteResult.rows.length === 0) {
            return res.json({ status: 404, error: "Expediente no encontrado." });
        }

        const id_cliente  = expedienteResult.rows[0].id_usuario;
        const titulo_publicacion = expedienteResult.rows[0].titulo_publicacion

        const id_seguimiento = uuidv4()

        await connection.query(`
            INSERT INTO seguimiento (id_seguimiento, id_expediente, id_estatus, titulo_seguimiento, seguimiento)
            VALUES ($1, $2, $3, $4, $5)
            `, [id_seguimiento, id_expediente, id_estatus, titulo_seguimiento, seguimiento]);

        const idNotificacion = uuidv4();
        const titulo_notificacion = 'Se ha añadido información al ' + titulo_publicacion

        await connection.query(`
            INSERT INTO notificacion (id_notificacion, id_mensajero, id_destinatario, id_estatus, descripcion_mensaje)
            VALUES ($1, $2, $3, 1, $4)
            `, [ idNotificacion, id_veterinario, id_cliente, titulo_notificacion ]
        );

        res.json({ status: 200, message: "Seguimiento agregado y notificación enviada." });
    } catch (error) {
        console.error("Error en /add-follow-up:", error);
        res.json({ status: 500, error: "Error al agregar el seguimiento." });
  }
});

record.get("/get-records-by-vet", async (req, res) => {
    const { token } = req.query

    if (!token) {
        return res.json({ status: 400, error: "Falta token." })
    }

    const userData = verifyToken(token)
    if (userData.status !== 200) {
        return res.json({ status: userData.status, error: userData.message })
    }

    const id_veterinario = userData.user.id_usuario

    try {
        const result = await connection.query(`
        SELECT 
            e.id_expediente,
            p.titulo_publicacion,
            m.nombre_mascota,
            m.foto_mascota,
            u.nombre_usuario AS nombre_dueño
        FROM expediente e
        JOIN publicacion p ON e.id_expediente = p.id_publicacion
        JOIN mascota m ON e.id_mascota = m.id_mascota
        JOIN expediente_usuario eu ON e.id_expediente = eu.id_expediente
        JOIN usuario u ON m.id_usuario = u.id_usuario
        WHERE eu.id_usuario = $1
        ORDER BY e.id_expediente DESC
        `, [id_veterinario])

        res.json({ status: 200, expedientes: result.rows })
    } catch (error) {
        console.error("Error en /get-records-by-vet:", error)
        res.json({ status: 500, error: "Error al obtener expedientes." })
    }
})

record.get("/get-records-by-client", async (req, res) => {
    const { token } = req.query;

    if (!token) return res.json({ status: 400, error: "Falta token." });

    const userData = verifyToken(token);
    if (userData.status !== 200) {
        return res.json({ status: userData.status, error: userData.message });
    }

    const id_usuario = userData.user.id_usuario;

    try {
        const result = await connection.query(`
        SELECT 
            e.id_expediente,
            m.nombre_mascota,
            m.foto_mascota,
            p.titulo_publicacion,
            u.nombre_usuario AS nombre_dueño
        FROM expediente e
        JOIN mascota m ON e.id_mascota = m.id_mascota
        JOIN usuario u ON m.id_usuario = u.id_usuario
        JOIN publicacion p ON e.id_expediente = p.id_publicacion
        WHERE u.id_usuario = $1
        ORDER BY e.id_expediente DESC
        `, [id_usuario]);

        res.json({ status: 200, expedientes: result.rows });
    } catch (error) {
        console.error("Error en /get-records-by-client:", error);
        res.json({ status: 500, error: "Error al obtener expedientes." });
    }
});

export default record