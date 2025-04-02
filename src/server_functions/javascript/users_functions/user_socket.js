import { io } from 'https://cdn.socket.io/4.3.2/socket.io.esm.min.js'
        
const socket = io()

const form = document.getElementById('form')
const input = document.getElementById('input')
const mensajes = document.getElementById('mensajes')

socket.on('chat message', (mensaje) => {
    const item = `<li>${mensaje}</li>`
    mensajes.insertAdjacentHTML('beforeend', item)
})

form.addEventListener('submit', (e) => {
    e.preventDefault()

    if ( input.value ) {
        socket.emit('chat message', input.value)
        input.value = ''
    }
})