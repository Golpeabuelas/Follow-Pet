import Router from 'express';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

import connection from '../connection.js';
import { verifyToken } from '../functions.js';
dotenv.config();

const chat = Router();

chat.get("/get-chats/:token", async (req, res) => {
    const token = req.params.token;
    const userData = verifyToken(token);

    if (userData.status !== 200) {
        return res.json({ status: userData.status, error: userData.message });
    }

    const id_usuario = userData.user.id_usuario;

    try {
        const result = await connection.query(`
            SELECT 
                c.id_chat,
                p.titulo_publicacion,
                u.nombre_usuario,
                u.foto_usuario,
                m.mensaje AS ultimo_mensaje,
                m.fecha_envio
            FROM chat c
            JOIN publicacion p ON c.id_publicacion = p.id_publicacion
            JOIN chat_usuario cu1 ON cu1.id_chat = c.id_chat
            JOIN chat_usuario cu2 ON cu2.id_chat = c.id_chat AND cu2.id_usuario != $1
            JOIN usuario u ON u.id_usuario = cu2.id_usuario
            LEFT JOIN LATERAL (
                SELECT mensaje, fecha_envio
                FROM mensaje_chat
                WHERE id_chat = c.id_chat
                ORDER BY fecha_envio DESC
                LIMIT 1
            ) m ON true
            WHERE cu1.id_usuario = $1
            ORDER BY m.fecha_envio DESC NULLS LAST
        `, [id_usuario]);

        res.json({ status: 200, chats: result.rows });
    } catch (err) {
        console.error("Error al obtener chats:", err);
        res.json({ status: 500, error: "Error al obtener chats del usuario." });
    }
});

chat.post("/get-messages-from-chat", async (req, res) => {
    const { id_chat, token } = req.body;

    const userData = verifyToken(token);

    if (userData.status !== 200) {
        return res.json({ status: userData.status, error: userData.message });
    }

    const id_usuario_actual = userData.user.id_usuario;

    try {
        const result = await connection.query(`
            SELECT 
                m.id_mensaje,
                m.id_usuario,
                u.nombre_usuario,
                u.foto_usuario,
                m.mensaje,
                m.fecha_envio,
                m.id_usuario = $2 AS propio
            FROM mensaje_chat m
            JOIN usuario u ON m.id_usuario = u.id_usuario
            WHERE m.id_chat = $1
            ORDER BY m.fecha_envio ASC;
        `, [id_chat, id_usuario_actual]);

        return res.json({ status: 200, mensajes: result.rows });

    } catch (error) {
        console.error("Error al obtener mensajes:", error);
        return res.json({ status: 500, error: "Error al obtener los mensajes del chat." });
    }
});

chat.post("/create-message", async (req, res) => {
    const { id_chat, mensaje, token } = req.body;

    const userData = verifyToken(token);
    if (userData.status !== 200) {
        return res.json({ status: userData.status, error: userData.message });
    }

    const id_usuario = userData.user.id_usuario;
    const id_mensaje = uuidv4();

    try {
        await connection.query(`
            INSERT INTO mensaje_chat (id_mensaje, id_chat, mensaje, id_usuario, fecha_envio)
            VALUES ($1, $2, $3, $4, NOW())
        `, [id_mensaje, id_chat, mensaje, id_usuario]);

        return res.json({ status: 200 });
    } catch (error) {
        console.error("Error al crear mensaje:", error);
        return res.json({ status: 500, error: "Error al crear el mensaje." });
    }
});

chat.get("/get-info-receiver/:id_chat/:token", async (req, res) => {
    const { token, id_chat } = req.params

    const userData = verifyToken(token);
    if (userData.status !== 200) {
        return res.json({ status: userData.status, error: userData.message });
    }

    const id_usuario = userData.user.id_usuario;

    try {
        const result = await connection.query(`
            SELECT u.id_usuario, u.nombre_usuario, u.foto_usuario
            FROM chat_usuario cu
            JOIN usuario u ON u.id_usuario = cu.id_usuario
            WHERE cu.id_chat = $1 AND cu.id_usuario != $2
            LIMIT 1
        `, [id_chat, id_usuario]);

        if (result.rowCount === 0) {
            return res.json({ status: 404, error: "No se encontró al otro usuario del chat" });
        }

        return res.json({ status: 200, usuario: result.rows[0] });
    } catch (error) {
        console.error("Error al obtener información del receptor:", error);
        return res.json({ status: 500, error: "Error interno del servidor" });
    }
})

export default chat