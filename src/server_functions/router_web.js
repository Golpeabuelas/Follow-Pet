import { Router } from "express";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const router = Router()

//-------------------------RUTAS-DE-CONEXION------------------------

router.get('/index', (req, res) => {
    res.sendFile(join(__dirname, '../public/html/index.html'))
});

router.get('/chat', (req, res) => {
    res.sendFile(join(__dirname, '../public/html/chat.html'))
});

router.get('/perfil', (req, res) => {
    res.sendFile(join(__dirname, '../public/html/perfil.html'))
});


router.get('/busqueda', (req, res) => {
    res.sendFile(join(__dirname, '../public/html/busqueda.html'))
});

router.get('/editpet', (req, res) => {
    res.sendFile(join(__dirname, '../public/html/editarmascotas.html'))
});

router.get('/editreporte', (req, res) => {
    res.sendFile(join(__dirname, '../public/html/editarreportes.html'))
});

router.get('/makereporte', (req, res) => {
    res.sendFile(join(__dirname, '../public/html/hacerReporte.html'))
});

router.get('/iniciosesion', (req, res) => {
    res.sendFile(join(__dirname, '../public/html/iniciosesion.html'))
});

router.get('/pagprincipal', (req, res) => {
    res.sendFile(join(__dirname, '../public/html/paginaprincipal.html'))
});

router.get('/verperfil', (req, res) => {
    res.sendFile(join(__dirname, '../public/html/verperfil.html'))
});

router.get('/registrarse', (req, res) => {
    res.sendFile(join(__dirname, '../public/html/registrarse.html'))
});




export default router;