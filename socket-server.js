import { Server } from "socket.io";

export async function initSockets(server) {
    const socketServer = new Server(server)

    socketServer.on('connection', (socket) => {
        console.log('A user has connected')

        socket.on('disconnect', () => {
            console.log('A user has disconnected')
        })

        socket.on('chat-message', () => {
            socketServer.emit('chat-message')
        })

        socket.on('notification', () => {
            socketServer.emit('notification')
        })
    })
}