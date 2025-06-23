import { Router } from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Resend } from "resend";
import dotenv from 'dotenv';

import connection from './connection.js';
dotenv.config();

const router = Router();
const resend = new Resend(process.env.RESEND_API_KEY);

router.get('/verify-email-already-used/:email', async (req, res) => {
    const { email } = req.params;

    try {
        const result = await connection.query('SELECT 1 FROM usuario WHERE correo_usuario = $1', [email]);

        if (result.rows.length > 0) {
            return res.json({ status: 403, message: 'Email already used' });
        }

        return res.json({ status: 200, message: 'Email available' });
    } catch (error) {
        return res.json({ status: 500, error: 'Server error' });
    }
});

router.get('/verify-user-already-used/:user', async (req, res) => {
    const { user } = req.params;

    try {
        const result = await connection.query('SELECT 1 FROM usuario WHERE nombre_usuario = $1', [user]);

        if (result.rows.length > 0) {
            return res.json({ status: 403, message: 'Username already used' });
        }

        return res.json({ status: 200, message: 'Username available' });
    } catch (error) {
        return res.json({ status: 500, error: 'Server error' });
    }
});


router.post('/register', async (req, res) => {
    const {
        nombre_usuario,
        correo_usuario,
        contraseña_usuario,
        foto_usuario,
        latitud,
        longitud,
        id_rol
    } = req.body;

    if (!nombre_usuario || !correo_usuario || !contraseña_usuario || !foto_usuario || !latitud || !longitud || !id_rol) {
        return res.json({ status: 400, error: "Faltan datos para registrar al usuario." });
    }

    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(contraseña_usuario, saltRounds);

        const ubicacionResult = await connection.query(
            'INSERT INTO ubicacion (latitud_ubicacion, longitud_ubicacion) VALUES ($1, $2) RETURNING id_ubicacion',
            [latitud, longitud]
        );

        const id_ubicacion = ubicacionResult.rows[0].id_ubicacion;

        const usuarioResult = await connection.query(
            `INSERT INTO usuario 
                (id_ubicacion, id_rol, nombre_usuario, correo_usuario, contraseña_usuario, foto_usuario)
             VALUES 
                ($1, $2, $3, $4, $5, $6)
             RETURNING id_usuario, nombre_usuario, foto_usuario`,
            [id_ubicacion, id_rol, nombre_usuario, correo_usuario, hashedPassword, foto_usuario]
        );

        res.json({
            status: 201,
            message: "Usuario registrado correctamente.",
            usuario: usuarioResult.rows[0]
        });
    } catch (error) {
        res.json({ status: 500, error: "Error del servidor." });
    }
});

router.post('/login', async (req, res) => {
    const { correo_usuario, contraseña_usuario } = req.body;

    if (!correo_usuario || !contraseña_usuario) {
        return res.json({ status: 400, error: "Correo y contraseña son obligatorios." });
    }

    try {
        const result = await connection.query(
            'SELECT id_usuario, nombre_usuario, foto_usuario, contraseña_usuario FROM usuario WHERE correo_usuario = $1',
            [correo_usuario]
        );

        if (result.rows.length === 0) {
            return res.json({ status: 401, error: "Correo o contraseña incorrectos." });
        }

        const user = result.rows[0];
        const match = await bcrypt.compare(contraseña_usuario, user.contraseña_usuario);

        if (!match) {
            return res.json({ status: 401, error: "Correo o contraseña incorrectos." });
        }

        const payload = {
            id_usuario: user.id_usuario,
            nombre_usuario: user.nombre_usuario,
            foto_usuario: user.foto_usuario
        };

        const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '1h' });

        res.json({ status: 200, token });
    } catch (error) {
        res.json({ status: 500, error: "Error del servidor." });
    }
});

router.get('/get-user-detail/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await connection.query(
            `SELECT 
                u.id_usuario,
                u.nombre_usuario,
                u.correo_usuario,
                u.foto_usuario,
                r.rol,
                ub.latitud_ubicacion,
                ub.longitud_ubicacion
             FROM usuario u
             JOIN rol_usuario r ON u.id_rol = r.id_rol
             JOIN ubicacion ub ON u.id_ubicacion = ub.id_ubicacion
             WHERE u.id_usuario = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.json({ status: 404, error: "Usuario no encontrado." });
        }

        res.json({ status: 200, usuario: result.rows[0] });
    } catch (error) {
        res.json({ status: 500, error: "Error del servidor." });
    }
});

router.post('/send-authentication-email', async (req, res) => {
    const { email } = req.body;

    const authCode = Math.floor(100000 + Math.random() * 900000);

    const bodyAuth = `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f0f0f0;">
            <div style="max-width: 500px; margin: auto; background-color: #fff; padding: 30px; border-radius: 8px; text-align: center;">
                <h2 style="color: #333;">Código de autenticación</h2>
                <p style="color: #555;">Tu código es:</p>
                <div style="font-size: 32px; font-weight: bold; color: #4CAF50; margin: 20px 0;">${authCode}</div>
                <p style="color: #888;">Este código es de un solo uso, si introduces un código incorrecto, este se invalidará.</p>
            </div>
        </div>
    `;

    if ( !email ) {
        return res.json({ status: 400, error: "No hay correo al cuál enviar el código." });
    }

    try {
        await resend.emails.send({
            from: "Acme <onboarding@resend.dev>",
            to: email,
            subject: "Código de autenticación",
            html: bodyAuth,
        });
    } catch (error) {
        return res.json({ status: 500, error: "Error al enviar el correo." });
    }

    console.log('si se envio w')
    res.json({ status: 200, message: "Correo enviado correctamente.", code: authCode });
})

//F0ll0w_P3t_4dm1n1str4d0r
//chavez.garcia.julian2@gmail.com
export default router;