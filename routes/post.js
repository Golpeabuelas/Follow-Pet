import { Router } from "express";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";

import connection from "../connection.js";
dotenv.config();

import { verifyToken } from "../functions.js";

const post = Router();

post.post("/create-post", async (req, res) => {
    /*const { token, estatus, titulo} = req.body;

    const userData = verifyToken(token);

    if (userData.status !== 200) {
        return res.json({ status: userData.status, error: userData.message });
    }

    const userId = userData.user.id_usuario;
    */

    const { id_usuario, id_estatus, titulo_publicacion } = req.body;

    try {
        const postId = uuidv4();

        const result = await connection.query('INSERT INTO publicacion (id_publicacion, id_usuario, id_estatus, titulo_publicacion)VALUES ($1, $2, $3, $4)', [postId, id_usuario, id_estatus, titulo_publicacion])

        return res.json({ status: 200, message: "Publicación creada exitosamente." });
    } catch (error) {
        console.error("Error al crear la publicación:", error);
        return res.json({ status: 500, error: "Error al crear la publicación." });
    }


})

post.get("/get-posts-home/:token", async (req, res) => {
    const { token } = req.params;

    const userData = verifyToken(token);

    if (userData.status !== 200) {
        return res.json({ status: userData.status, error: userData.message });
    }

    const userId = userData.user.id_usuario;

    try {
        const result = await connection.query(`
            SELECT 
                p.id_publicacion,
                p.titulo_publicacion,
                ep.id_estatus,
                ep.estatus,
                CASE 
                    WHEN p.id_estatus IN (1, 2) THEN rm.nombre_mascota
                    ELSE NULL
                END AS nombre_mascota,
                CASE 
                    WHEN p.id_estatus IN (1, 2) THEN rm.foto_mascota
                    WHEN p.id_estatus = 3 THEN pc.foto_clinica
                    ELSE NULL
                END AS foto_imagen,
                CASE 
                    WHEN p.id_estatus = 3 THEN pc.telefono_clinica
                    ELSE NULL
                END AS telefono_clinica,
                CASE 
                    WHEN p.id_estatus = 3 THEN pc.servicios_clinica
                    ELSE NULL
                END AS servicios_clinica,
                CASE 
                    WHEN p.id_estatus = 3 THEN pc.enlace_web
                    ELSE NULL
                END AS enlace_web
            FROM publicacion p
            JOIN estatus_publicacion ep ON p.id_estatus = ep.id_estatus
            LEFT JOIN reporte_mascota rm ON rm.id_reporte = p.id_publicacion
            LEFT JOIN publicacion_clinica pc ON pc.id_publicacion = p.id_publicacion
            WHERE p.id_usuario != $1
            AND p.id_estatus IN (1, 2, 3);
        `, [userId]);

        if (result.rows.length === 0) {
            return res.json({ status: 404, error: "No se encontraron publicaciones.", publicaciones: result.rows });
        }

        return res.json({ status: 200, publicaciones: result.rows });
    } catch (error) {
        console.error("Error al obtener las publicaciones:", error);
        return res.json({ status: 500, error: "Error al obtener las publicaciones." });
    }
})

post.get("/get-posts-user/:token", async (req, res) => {
    const { token } = req.params;

    const userData = verifyToken(token);

    if (userData.status !== 200) {
        return res.json({ status: userData.status, error: userData.message });
    }

    const userId = userData.user.id_usuario;

    try {
        const result = await connection.query(`
            SELECT 
                p.id_publicacion,
                p.titulo_publicacion,
                ep.id_estatus,
                ep.estatus,
                CASE 
                    WHEN p.id_estatus IN (1, 2) THEN rm.nombre_mascota
                    ELSE NULL
                END AS nombre_mascota,
                CASE 
                    WHEN p.id_estatus IN (1, 2) THEN rm.foto_mascota
                    ELSE NULL
                END AS foto_mascota
            FROM publicacion p
            JOIN estatus_publicacion ep ON p.id_estatus = ep.id_estatus
            LEFT JOIN reporte_mascota rm ON rm.id_reporte = p.id_publicacion
            WHERE p.id_usuario = $1;
        `, [userId]);

        if (result.rows.length === 0) {
            return res.json({ status: 404, error: "No se encontraron publicaciones.", publicaciones: result.rows });
        }

        return res.json({ status: 200, publicaciones: result.rows });
    } catch (error) {
        console.error("Error al obtener las publicaciones del usuario:", error);
        return res.json({ status: 500, error: "Error al obtener las publicaciones del usuario." });
    }
})

post.get("/get-post-details/:id_publicacion", async (req, res) => {
    const { id_publicacion } = req.params;

    try {
        const result = await connection.query(`
            SELECT 
                p.id_publicacion,
                p.titulo_publicacion,
                ep.id_estatus,
                ep.estatus,
                -- ubicación compartida
                u.latitud_ubicacion,
                u.longitud_ubicacion,
                rd.descripcion_desaparicion,
                rd.fecha_desaparicion,
                rm.nombre_mascota,
                rm.edad_mascota,
                rm.color_mascota,
                rm.distintivo_mascota,
                rm.foto_mascota,
                pc.telefono_clinica,
                pc.servicios_clinica,
                pc.foto_clinica,
                pc.enlace_web
            FROM publicacion p
            JOIN estatus_publicacion ep ON p.id_estatus = ep.id_estatus
            LEFT JOIN reporte_desaparicion rd ON rd.id_reporte = p.id_publicacion
            LEFT JOIN reporte_mascota rm ON rm.id_reporte = p.id_publicacion AND p.id_estatus IN (1, 2)
            LEFT JOIN publicacion_clinica pc ON pc.id_publicacion = p.id_publicacion AND p.id_estatus = 3
            LEFT JOIN ubicacion u ON 
                (rd.id_ubicacion_desaparicion = u.id_ubicacion AND p.id_estatus IN (1, 2)) 
                OR (pc.id_ubicacion = u.id_ubicacion AND p.id_estatus = 3)

            WHERE p.id_publicacion = $1
        `, [id_publicacion]);

        if (result.rows.length === 0) {
            return res.json({ status: 404, error: "Publicación no encontrada." });
        }

        return res.json({ status: 200, publicacion: result.rows[0] });

    } catch (error) {
        console.error("Error al obtener la publicación:", error);
        return res.json({ status: 500, error: "Error al obtener la publicación." });
    }
});


post.post("/create-chat-from-post", async (req, res) => {
    const { token, id_publicacion } = req.body;

    const userData = verifyToken(token);

    if (userData.status !== 200) {
        return res.json({ status: userData.status, error: userData.message });
    }

    const id_usuario = userData.user.id_usuario

    try {
        const pub = await connection.query(
            `SELECT id_usuario, titulo_publicacion FROM publicacion WHERE id_publicacion = $1`,
            [id_publicacion]
        )

        if (pub.rowCount === 0) {
            return res.json({ status: 404, error: "Publicación no encontrada" })
        }

        const id_dueño = pub.rows[0].id_usuario
        const titulo = pub.rows[0].titulo_publicacion

        if (id_usuario === id_dueño) {
            return res.json({ status: 400, error: "No puedes chatear contigo mismo" })
        }

        const existingChat = await connection.query(`
            SELECT c.id_chat
            FROM chat c
            JOIN chat_usuario cu1 ON cu1.id_chat = c.id_chat AND cu1.id_usuario = $1
            JOIN chat_usuario cu2 ON cu2.id_chat = c.id_chat AND cu2.id_usuario = $2
            WHERE c.id_publicacion = $3
        `, [id_usuario, id_dueño, id_publicacion])

        if (existingChat.rowCount > 0) {
            return res.json({ id_chat: existingChat.rows[0].id_chat })
        }

        const id_chat = uuidv4()
        await connection.query(
            `INSERT INTO chat (id_chat, id_publicacion) VALUES ($1, $2)`,
            [id_chat, id_publicacion]
        )

        await connection.query(`
            INSERT INTO chat_usuario (id_chat, id_usuario)
            VALUES ($1, $2), ($1, $3)
        `, [id_chat, id_usuario, id_dueño])

        const id_notificacion = uuidv4()
        const descripcion = `Alguien quiere hablar contigo sobre: "${titulo}"`

        await connection.query(`
            INSERT INTO notificacion (id_notificacion, id_mensajero, id_destinatario, id_estatus, descripcion_mensaje)
            VALUES ($1, $2, $3, 1, $4)
        `, [id_notificacion, id_usuario, id_dueño, descripcion])

        res.json({ status: 200, id_chat })
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error creando o buscando chat" });
    }
});

post.get("/get-own-posts/:token", async (req, res) => {
    const { token } = req.params;

    const userData = verifyToken(token);

    if (userData.status !== 200) {
        return res.json({ status: userData.status, error: userData.message });
    }

    const userId = userData.user.id_usuario;

    try {
        const result = await connection.query(`
                SELECT
                    p.id_publicacion,
                    p.titulo_publicacion,
                    ep.id_estatus,
                    ep.estatus,
                    COALESCE(json_agg(
                        json_build_object(
                        'id_chat', c.id_chat,
                            'usuario_receptor', json_build_object(
                                'id_usuario', u.id_usuario,
                                'nombre_usuario', u.nombre_usuario,
                                'foto_usuario', u.foto_usuario
                            ),
                            'ultimo_mensaje', (
                                SELECT m.mensaje
                                    FROM mensaje_chat m
                                    WHERE m.id_chat = c.id_chat
                                    ORDER BY m.fecha_envio DESC
                                    LIMIT 1
                            )
                        )
                    ) FILTER (WHERE c.id_chat IS NOT NULL), '[]') AS chats
                FROM publicacion p
                JOIN estatus_publicacion ep ON p.id_estatus = ep.id_estatus
                LEFT JOIN chat c ON c.id_publicacion = p.id_publicacion
                LEFT JOIN chat_usuario cu ON cu.id_chat = c.id_chat AND cu.id_usuario != $1
                LEFT JOIN usuario u ON u.id_usuario = cu.id_usuario
                WHERE p.id_usuario = $1
                GROUP BY p.id_publicacion, ep.id_estatus, ep.estatus, p.titulo_publicacion
                ORDER BY p.id_publicacion DESC;
            `, [userId]);

        if (result.rows.length === 0) {
            return res.json({ status: 404, error: "No se encontraron chats." });
        }

        return res.json({ status: 200, chats: result.rows });
    } catch (error) {
        console.error("Error al obtener los chats:", error);
        return res.json({ status: 500, error: "Error al obtener los chats." });
    }
});

post.put("/update-post-status", async (req, res) => {
    const { id_publicacion, id_estatus } = req.body;

    console.log(id_publicacion, '<==')
    try {
        const result = await connection.query(` 
            UPDATE publicacion
            SET id_estatus = $1
            WHERE id_publicacion = $2
            RETURNING id_publicacion, id_estatus;
        `, [id_estatus, id_publicacion]);
        
        if (result.rowCount === 0) {
            return res.json({ status: 404, error: "Publicación no encontrada." });
        }

        return res.json({ status: 200, message: "Estatus de publicación actualizado exitosamente.", publicacion: result.rows[0] });
    } catch (error) {
        console.error("Error al actualizar el estatus de la publicación:", error);
        return res.json({ status: 500, error: "Error al actualizar el estatus de la publicación." });
    }
});

post.post("/crear-reporte", async (req, res) => {
    const {
        token,
        titulo,
        nombre,
        edad,
        color,
        distintivo,
        descripcion,
        fecha,
        latitud,
        longitud,
        imagen,
        id_estatus
    } = req.body

    const userData = verifyToken(token)
    if (userData.status !== 200) {
        return res.json({ status: userData.status, error: userData.message })
    }

    const id_usuario = userData.user.id_usuario

    const id_ubicacion = uuidv4()
    const id_publicacion = uuidv4()

    try {
        await connection.query(`
            INSERT INTO ubicacion (id_ubicacion, latitud_ubicacion, longitud_ubicacion)
            VALUES ($1, $2, $3)
        `, [id_ubicacion, latitud, longitud])

        await connection.query(`
            INSERT INTO publicacion (id_publicacion, id_usuario, id_estatus, titulo_publicacion)
            VALUES ($1, $2, $3, $4)
        `, [id_publicacion, id_usuario, id_estatus, titulo])

        await connection.query(`
            INSERT INTO reporte_desaparicion (id_reporte, id_ubicacion_desaparicion, fecha_desaparicion, descripcion_desaparicion)
            VALUES ($1, $2, $3, $4)
        `, [id_publicacion, id_ubicacion, fecha, descripcion])

        await connection.query(`
            INSERT INTO reporte_mascota (id_reporte, nombre_mascota, edad_mascota, color_mascota, distintivo_mascota, foto_mascota)
            VALUES ($1, $2, $3, $4, $5, $6)
        `, [id_publicacion, nombre, edad, color, distintivo, imagen])

        res.json({ status: 200, message: "Reporte creado correctamente" })

    } catch (error) {
        console.error("Error al crear el reporte:", error)
        res.json({ status: 500, error: "Error al crear el reporte" })
    }
})

post.post('/create-clinic-promotion', async (req, res) => {
    const { token, titulo, telefono, servicios, enlace, imagen, latitud, longitud } = req.body;

    const userData = verifyToken(token);
    if (userData.status !== 200) {
        return res.json({ status: userData.status, error: userData.message });
    }

    const id_usuario = userData.user.id_usuario;

    try {
        const rolResult = await connection.query(
            `SELECT id_rol FROM usuario WHERE id_usuario = $1`,
            [id_usuario]
        );

        if (rolResult.rows.length === 0) {
            return res.json({ status: 404, error: 'Usuario no encontrado.' });
        }

        const id_rol = rolResult.rows[0].id_rol;
        if (id_rol !== 2) {
            return res.json({ status: 403, error: 'Solo los veterinarios pueden publicar promociones de clínica.' });
        }

        const id_estatus = 3; 
        const id_publicacion = crypto.randomUUID();
        const id_ubicacion = crypto.randomUUID();

        await connection.query('BEGIN');

        await connection.query(`
            INSERT INTO publicacion(id_publicacion, id_usuario, id_estatus, titulo_publicacion)
            VALUES ($1, $2, $3, $4)
        `, [id_publicacion, id_usuario, id_estatus, titulo]);

        await connection.query(`
            INSERT INTO ubicacion(id_ubicacion, latitud_ubicacion, longitud_ubicacion)
            VALUES ($1, $2, $3)
        `, [id_ubicacion, latitud, longitud]);

        await connection.query(`
            INSERT INTO publicacion_clinica(id_publicacion, id_ubicacion, telefono_clinica, servicios_clinica, foto_clinica, enlace_web)
            VALUES ($1, $2, $3, $4, $5, $6)
        `, [id_publicacion, id_ubicacion, telefono, servicios, imagen, enlace || null]);

        await connection.query('COMMIT');

        res.json({ status: 200, message: 'Promoción creada correctamente.' });

    } catch (error) {
        await connection.query('ROLLBACK');
        console.error('Error al crear promoción de clínica:', error);
        res.json({ status: 500, error: 'Error al crear promoción.' });
    }
});

export default post;