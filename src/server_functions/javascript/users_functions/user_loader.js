import { Router } from "express";
import connection from "../../connection_sql";

const userLoader = Router()

userLoader.post('/buscarSesionExistente', (req, res) => {
    const correo = req.body.correo

    connection.query('SELECT * FROM usuario WHERE correo = ?', [correo], (error, response, fields) => {
        if ( error ) {
            res.status(400).send(console.log('Error al buscar sesión', error))
        }
        
        if ( response.affectedRows > 0 ) {
            res.json({ correoUsado: true })
        }

        if ( response.affectedRows === 0) {    
            res.json({ correoUsado: false })
        }
    })
})

userLoader.post('/otorgarPermisos', (req, res) => {
    const password = req.body.password

    if( password === 'Tr4b4_1nc_4dm1n1str4d0r' ){
        res.json({ permisos: true })
    }

    res.json({ permisos: false })
})

userLoader.post('/iniciarSesion', (req, res) => {
    const correo = req.body.correo
    const password = req.body.password

    connection.query('SELECT * FROM usuario WHERE correo = ?', [correo], (error, response, fields) => {
        if ( error ) {
            res.status(400).send(console.log('Error al iniciar sesión', error))
        }

        if ( response.length === 0 ) {
            res.status(404).send(console.log('Usuario no encontrado'))
        }

        if ( password === response.password ) {
            res.json(response)
        }
    })
})

export default userLoader