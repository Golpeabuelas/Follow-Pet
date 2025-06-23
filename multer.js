import { Router } from "express";
import fs from 'node:fs'
import multer from 'multer'

const upload = multer({ dest: 'uploads/'})
const Multer = Router()

Multer.post('/cargarImagen', upload.single('image'), (req, res) => {
    const ruta = renombrar(req.file)
    res.json({ ruta: ruta })
})
 
function renombrar (imagen) {
    const rutaNuevaReal = `./uploads/${Date.now()}-${imagen.originalname}`
    const rutaNuevaBBDD = `/images/${Date.now()}-${imagen.originalname}`
    fs.renameSync(imagen.path, rutaNuevaReal)

    return rutaNuevaBBDD
}

export default Multer