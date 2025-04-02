import express from 'express';
import morgan from 'morgan';

import { createServer } from 'node:http';
import { iniciarSocketSever } from './index_socket.js';

import { join, dirname} from 'path';
import { fileURLToPath } from 'url';


import router from './src/server_functions/router_web.js'
import sesiones from './src/server_functions/javascript/users_functions/crud_sesiones.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

const app = express()
const server = createServer(app)
iniciarSocketSever(server) 

app.set('port', process.env.PORT || 3000);

app.use(morgan('dev'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/imagenes', express.static(join(__dirname, './src/public/imagenes')))
app.use('/css', express.static(join(__dirname, './src/public/css')))
app.use('/html', express.static(join(__dirname, './src/public/html')))
app.use('/scripts', express.static(join(__dirname, './src/server_functions/')))

app.use(router)
app.use(sesiones)

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, './src/public/html/index.html'))
});

server.listen(app.get('port'), () => {
    console.log('Server listening on port', app.get('port'));
    console.log('http://localhost:' + app.get('port'));
});