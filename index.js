import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import multer from 'multer'
import dotenv from 'dotenv'

import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

dotenv.config()

const app = express()
const __dirname = dirname(fileURLToPath(import.meta.url))

app.set('port', process.env.PORT || 3000)

app.use(cors())
app.use(morgan('dev'))
app.use(express.urlencoded({ limit: '5mb', extended: true }))
app.use(express.json({ limit: '5mb' }))

app.use('/images', express.static(join(__dirname, './uploads')))
// Configuración de Multer

app.listen(app.get('port'), () => {
    console.log('Server listening on port', app.get('port'));
    console.log('http://localhost:' + app.get('port'));
});
