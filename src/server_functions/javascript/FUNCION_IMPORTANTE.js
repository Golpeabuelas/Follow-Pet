
async function FUNCION_IMPORTANTE () {
    for (let index = 0; index < 6; index++) {
        if ( index == 0) {
            console.log('¿Sabías que Axel quiere mucho a su novia?')
        } else if ( index == 1) {
            console.log('Tiene', index, 'novia')
        } else {
            console.log('Espera, espera tiene', index, 'novias :0000')
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000))
    }

    console.log('Axel es un puto cabrón infiel :((((')
}

FUNCION_IMPORTANTE()