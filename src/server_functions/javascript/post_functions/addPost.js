const modal = document.getElementById('modal');
const openModal = document.getElementById('addPost');
const closeModal = document.querySelector('.close');
const enviarRegistro = document.getElementById('añadirPublicacion')

openModal.addEventListener('click', () => {
    modal.style.display = 'flex';
});

closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});
