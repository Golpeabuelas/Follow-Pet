import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import dotenv from 'dotenv'

import { createServer } from 'node:http'
import { initSockets } from './socket-server.js'

import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
dotenv.config()

import Multer from './routes/multer.js'
import session from './routes/session.js'
import profile from './routes/profile.js'
import post from './routes/post.js'
import chat from './routes/chat.js'
import record from './routes/record.js'
import connection from './connection.js'

const app = express()
const server = createServer(app)
initSockets(server)

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
app.use(chat)
app.use(record)

app.use('/images', express.static(join(__dirname, './uploads')))

server.listen(app.get('port'), () => {
    console.log('Server listening on port', app.get('port'));
    console.log('http://localhost:' + app.get('port'));
});