import { Router } from "express";
import connection from "../../connection_sql.js"

const sesiones = Router()

sesiones.post('/añadirUsuario', (req, res) => {
    const nombre = req.body.nombre
    const correo = req.body.correo
    const password = req.body.password
    const permisos = req.body.permisos

    connection.query('INSERT INTO usuario (nombre, correo, password, permisos) VALUES (nombre = ?, correo = ?, password = ?, permisos = ?)', [nombre, correo, password, permisos], (error, response) => {
        if ( error ) {
            res.status(400).send(console.log('Error al añadir nueva sesión'))
        }

        res.json(response)
    })
})

sesiones.post('/editarUsuario', (req, res) => {
    const id_usuario = req.body.id_usuario
    const nombre = req.body.nombre
    const password = req.body.password
    const permisos = req.body.permisos

    connection.query('UPDATE usuario SET (nombre = ?, password = ?, permisos = ? WHERE id_usuario = ?)', [nombre, password, permisos, id_usuario], (error, response) => {
        if ( error ) {
            res.status(400).send(console.log('Error al editar datos del usuario', error))
        }

        if ( response.affectedRows === 0 ) {
            res.status(404).send(console.log('Usuario no encontrado'))
        }

        console.log('Sesión actualizada exitosamente')
        res.json(response)
    })
})

sesiones.post('/borrarUsuario', (req, res) => {
    id_usuario = req.body.id_usuario

    connection.query('DELETE FROM usuario WHERE id_usuario = ?', [id_usuario], (error, response) => {
        if ( error ) {
            res.status(400).send(console.log('Error al eliminar la sesión', error))
        }

        if ( response.affectedRows === 0 ) {
            res.status(404).send(console.log('Usuario no encontrado'))
        }

        res.send(console.log('Usuario eliminado exitosamente'))
    })
})

export default sesiones