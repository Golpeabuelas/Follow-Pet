import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import dotenv from 'dotenv'

import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
dotenv.config()

import Multer from './multer.js'
import router from './methods_sessions.js'
import connection from './connection.js'

const app = express()
const __dirname = dirname(fileURLToPath(import.meta.url))

app.set('port', process.env.PORT || 3000)

app.use(cors())
app.use(morgan('dev'))
app.use(express.urlencoded({ limit: '5mb', extended: true }))
app.use(express.json({ limit: '5mb' }))

app.use(Multer)
app.use(router)

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

app.listen(app.get('port'), () => {
    console.log('Server listening on port', app.get('port'));
    console.log('http://localhost:' + app.get('port'));
});