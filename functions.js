import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

export function verifyToken(token) {
    try {
        if (!token) {
            return {status: 401, message: 'No se encontró un token de autenticación.'};
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        return {status: 200, user: decoded};
    } catch (error) {
        console.error('Error al verificar el token:', error);
        return {status: 401, message: 'Token inválido o expirado.'};
    }
}

export const html = (codigo) => {
    return(
        `<div style="background-color: #FFF9F0; padding: 40px; font-family: 'Arial', sans-serif;">
            <div style="max-width: 500px; margin: auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); padding: 30px; border: 1px solid #FFBD59;">
                <h1 style="text-align: center; color: #FFBD59; margin-bottom: 20px; font-size: 28px;">FOLLOW PET</h1>

                <p style="color: #5E5E5E; font-size: 16px; line-height: 1.6;">
                    Recibiste este correo porque alguien está intentando acceder a la sección de
                    <strong>información delicada</strong> de tu perfil. Si tú iniciaste esta acción, introduce el siguiente código en la app:
                </p>

                <div style="text-align: center; margin: 30px 0;">
                    <span style="
                    font-size: 32px;
                    letter-spacing: 6px;
                    font-weight: bold;
                    color: #444;
                    display: inline-block;
                    padding: 10px 20px;
                    background-color: #FFBD59;
                    color: white;
                    border-radius: 10px;
                    ">
                    ${codigo}
                    </span>
                </div>

                <p style="color: #5E5E5E; font-size: 14px; text-align: center;">
                    Si no solicitaste esta acción, puedes ignorar este mensaje. Tu información sigue segura.
                </p>

                <p style="text-align: center; margin-top: 30px; color: #999; font-size: 12px;">
                    © 2025 Follow Pet. Todos los derechos reservados.
                </p>
            </div>
        </div>`
    )
}