

function soloLetras (idInput) {
    const valorInput = idInput.value;
    let auxiliar = "";

    for (let i = 0; i < valorInput.length; i++) {
        if (/[^a-zA-ZáéíóúñÁÉÍÓÚÑ]/.test(valorInput.charAt(i))) {
            break
        }
        else {
            auxiliar += valorInput.charAt(i)
        }
    }

    idInput.value = auxiliar
}   

function soloNumeros (idInput) {
    const valorInput = idInput.value;
    let auxiliar = "";

    for (let i = 0; i < valorInput.length; i++) {
        if (/[^0-9]/.test(valorInput.charAt(i))) {
            break
        }
        else {
            auxiliar += valorInput.charAt(i)
        }
    }

    idInput.value = auxiliar
}

function etiquetasFixer (idInput) {
    const valorInput = idInput.value;
    let auxiliar = "";

    for (let i = 0; i < valorInput.length; i++) {
        if (/[<>]/.test(valorInput.charAt(i))) {
            idInput.setCustomValidity('Caracteres peligrosos no permitidos (< >)');
            idInput.reportValidity();
            break
        }
        else {
            auxiliar += valorInput.charAt(i)
        }
    }

    idInput.value = auxiliar
}