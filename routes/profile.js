import Router from 'express';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { Resend } from 'resend';

import connection from '../connection.js';
import { html, verifyToken } from '../functions.js';
dotenv.config();

const profile = Router();

profile.get("/get-profile-details/:token", async (req, res) => {
    const { token } = req.params

    const userData = verifyToken(token)

    if (userData.status !== 200) {
        return res.json({ status: userData.status, error: userData.message })
    }

    try {
        const result = await connection.query(
            `
            SELECT 
                u.id_usuario,
                u.nombre_usuario,
                u.correo_usuario,
                u.foto_usuario,
                r.rol,
                ub.latitud_ubicacion,
                ub.longitud_ubicacion,

                COALESCE(
                    json_agg(DISTINCT jsonb_build_object(
                        'id_mascota', m.id_mascota,
                        'nombre', m.nombre_mascota,
                        'edad', m.edad_mascota,
                        'color', m.color_mascota,
                        'foto', m.foto_mascota
                    )) FILTER (WHERE m.id_mascota IS NOT NULL),
                    '[]'
                ) AS mascotas,

                COALESCE(
                    json_agg(DISTINCT jsonb_build_object(
                        'id_publicacion', p.id_publicacion,
                        'titulo', p.titulo_publicacion,
                        'estatus', ep.estatus
                    )) FILTER (WHERE p.id_publicacion IS NOT NULL),
                    '[]'
                ) AS publicaciones

            FROM usuario u
            JOIN rol_usuario r ON u.id_rol = r.id_rol
            JOIN ubicacion ub ON u.id_ubicacion = ub.id_ubicacion
            LEFT JOIN mascota m ON m.id_usuario = u.id_usuario
            LEFT JOIN publicacion p 
                ON p.id_usuario = u.id_usuario 
            AND p.id_estatus IN (1, 2, 3)
            LEFT JOIN estatus_publicacion ep ON p.id_estatus = ep.id_estatus
            WHERE u.id_usuario = $1
            GROUP BY u.id_usuario, r.rol, ub.latitud_ubicacion, ub.longitud_ubicacion;
            `,
            [userData.user.id_usuario]
        )

        if (result.rows.length === 0) {
            return res.json({ status: 404, error: "Usuario no encontrado." })
        }

        res.json({ status: 200, usuario: result.rows[0] })
    } catch (error) {
        console.error("Error al obtener el perfil:", error)
        res.json({ status: 500, error: "Error del servidor." })
    }
})

profile.post("/auth-sensitive", async (req, res) => {
    const { token } = req.body;
    const verification = verifyToken(token);

    if (verification.status !== 200) {
        return res.json({ status: 401, message: verification.message });
    }

    const userId = verification.user.id_usuario;

    const result = await connection.query(`SELECT correo_usuario FROM usuario WHERE id_usuario = $1`,[userId]);

    if (result.rows.length === 0) {
        return res.json({ status: 404, message: "Usuario no encontrado." });
    }

    const correo = result.rows[0].correo_usuario;
    const codigo = uuidv4().replace(/-/g, '').slice(0, 8).toUpperCase();

    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
        await resend.emails.send({
            from: "Acme <onboarding@resend.dev>",
            to: correo,
            subject: 'Código de autenticación para acceder a información',
            html: html(codigo)
        });

        return res.json({ status: 200, message: "Código enviado con éxito", codigo: codigo });
    } catch (error) {
        console.error("Error al enviar el correo:", error);
        return res.json({ status: 500, message: "No se pudo enviar el correo de verificación" });
    }
});

profile.post("/add-pet", async (req, res) => {
    const { token, nombre, edad, color, foto } = req.body;

    if (!token || !nombre || !edad || !color || !foto) {
        return res.json({ status: 400, message: "Faltan datos" });
    }

    const verificado = verifyToken(token);
    if (verificado.status !== 200) {
        return res.json(verificado);
    }

    const userId = verificado.user.id_usuario;
    const mascotaId = uuidv4();

    try {
        await connection.query("INSERT INTO mascota (id_mascota, id_usuario, nombre_mascota, edad_mascota, color_mascota, foto_mascota) VALUES ($1, $2, $3, $4, $5, $6)", [mascotaId, userId, nombre, edad, color, foto]);
        
        res.json({ status: 200, message: "Mascota registrada con éxito" });
    } catch (err) {
        console.error("Error al registrar mascota:", err);
        res.json({ status: 500, message: "Error al registrar la mascota" });
    }
});

profile.get('/get-notifications/:token', async (req, res) => {
    const { token } = req.params

    const userData = verifyToken(token)
    if (userData.status !== 200) {
        return res.json({ status: userData.status, error: userData.message })
    }

    const id_usuario = userData.user.id_usuario

    try {
        const result = await connection.query(`
            SELECT 
                n.id_notificacion, 
                n.descripcion_mensaje, 
                en.estatus AS estado,
                u.nombre_usuario AS mensajero_nombre, 
                u.foto_usuario AS mensajero_foto
            FROM notificacion n
            JOIN estatus_notificacion en ON n.id_estatus = en.id_estatus
            JOIN usuario u ON n.id_mensajero = u.id_usuario
            WHERE n.id_destinatario = $1
            ORDER BY n.id_notificacion DESC
        `, [id_usuario])

        console.log(result.rows)
        res.json({ status: 200, notifications: result.rows })
    } catch (error) {
        console.error('Error al obtener notificaciones:', error)
        res.json({ status: 500, error: 'Error al obtener notificaciones' })
    }
})

profile.post('/mark-notification-read', async (req, res) => {
    const { id_notificacion } = req.body

    try {
        await connection.query(
            `UPDATE notificacion SET id_estatus = 2 WHERE id_notificacion = $1`,
            [id_notificacion]
        )

        res.json({ status: 200, message: "Notificación marcada como leída" })
    } catch (error) {
        console.error("Error al marcar notificación como leída:", error)
        res.json({ status: 500, error: "No se pudo marcar como leída" })
    }
})


//F0ll0w_P3t_4dm1n1str4d0r


export default profile