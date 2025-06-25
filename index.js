import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import dotenv from 'dotenv'

import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
dotenv.config()

import Multer from './routes/multer.js'
import session from './routes/session.js'
import profile from './routes/profile.js'
import post from './routes/post.js'
import connection from './connection.js'

const app = express()
const __dirname = dirname(fileURLToPath(import.meta.url))

app.set('port', process.env.PORT || 3000)

app.use(cors())
app.use(morgan('dev'))
app.use(express.urlencoded({ limit: '5mb', extended: true }))
app.use(express.json({ limit: '5mb' }))

app.use(Multer)
app.use(session)
app.use(profile)
app.use(post)

app.use('/images', express.static(join(__dirname, './uploads')))

app.get('/perro', async (req, res) => {
    const result = await connection.query('SELECT NOW()')
    return res.json(result.rows[0])
})

app.get('/sex', async (req, res) => {
    const result = await connection.query(`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';`)
    return res.json(result.rows)
})

app.get('/setsito', async (req, res) => {
    const result = await connection.query(`SELECT * FROM estatus_publicacion`)
    return res.json(result)
})

app.get('/get-email', async (req, res) => {
    const result = await connection.query(`SELECT correo_usuario FROM usuario WHERE id_usuario = '8f27e33f-b415-408d-a8e0-9d2bbe432a8d'`)
    return res.json(result.rows[0].correo_usuario)
})

app.listen(app.get('port'), () => {
    console.log('Server listening on port', app.get('port'));
    console.log('http://localhost:' + app.get('port'));
});