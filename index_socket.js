import { Server } from "socket.io";

export async function iniciarSocketSever(server) {
    const socketServer = new Server(server)
        
    socketServer.on('connection', (socket) => {
        console.log('A user has connected')

        socket.on('disconnect', () => {
            console.log('A user has disconnected')
        })

        socket.on('chat message', (mensaje) => {
            socketServer.emit('chat message', mensaje)
        })
    })
}