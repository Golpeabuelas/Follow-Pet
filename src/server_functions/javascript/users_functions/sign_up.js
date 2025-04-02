const nombre = document.getElementById('nombre').value
const correo = document.getElementById('correo').value
const password = document.getElementById('password').value
const passwordConfirmar = document.getElementById('confirmar_password').value

const btnSubmit = document.getElementById('btn_sign_up_submit')

btnSubmit.addEventListener('click', () => {
    if( !nombre || !correo || !password || !passwordConfirmar ) {
        contraseñasCoinciden(password, passwordConfirmar)
    }
})

function contraseñasCoinciden (Password, PasswordConfirmar) {
    if( Password === PasswordConfirmar ) {
        registrarse()
    }
}

async function registrarse(Nombre, Correo, Password, PasswordConfirmar) {
    const response = await fetch('/añadirUsuario', {
        
    })  
}