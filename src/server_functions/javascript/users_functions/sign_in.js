const correo = document.getElementById('correo').value
const password = document.getElementById('password').value

const btnSubmit = document.getElementById('btn_sign_in_submit')

btnSubmit.addEventListener('click', () => {
    if ( !correo || !password ) {
        iniciarSesion(correo, password)    
    }
})

async function iniciarSesion (Correo, Password) {
    const response = await fetch('/iniciarSesion', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Correo, Password }),
    })

    //Manipular datos de la respuesta
}