import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import dotenv from 'dotenv'

import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import Multer from './multer.js'

dotenv.config()

const app = express()
const __dirname = dirname(fileURLToPath(import.meta.url))

app.set('port', process.env.PORT || 3000)

app.use(cors())
app.use(morgan('dev'))
app.use(express.urlencoded({ limit: '5mb', extended: true }))
app.use(express.json({ limit: '5mb' }))
app.use(Multer)

app.use('/images', express.static(join(__dirname, './uploads')))

app.listen(app.get('port'), () => {
    console.log('Server listening on port', app.get('port'));
    console.log('http://localhost:' + app.get('port'));
});
