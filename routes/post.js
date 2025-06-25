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

post.post("/create-ubication", async (req, res) => {
    const { latitud, longitud } = req.body;

    try {
        const ubicationId = uuidv4();

        const result = await connection.query('INSERT INTO ubicacion (id_ubicacion, latitud_ubicacion, longitud_ubicacion) VALUES ($1, $2, $3)', [ubicationId, latitud, longitud]);

    } catch (error) {
        console.error("Error al crear la ubicación:", error);
        return res.json({ status: 500, error: "Error al crear la ubicación." });
    }

    return res.json({ status: 200, message: "Ubicación creada exitosamente." });
})


export default post;