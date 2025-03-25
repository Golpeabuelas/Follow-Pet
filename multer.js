import { Router } from "express";
import fs from 'node:fs'
import multer from 'multer'

const upload = multer({ dest: 'uploads/'})
const Multer = Router()

//Guarda en el servidor en la carpeta <uploads> las imagenes que se suben 
Multer.post('/cargarImagen', upload.single('image'), (req, res) => {
    const ruta = renombrar(req.file)
    res.json({ ruta: ruta })
})

//Renombra la imagen y guarda la URL
function renombrar (imagen) {
    //Objeto Date.now() para darle un nombre único a las imagenes subidas
    const rutaNuevaReal = `./uploads/${Date.now()}-${imagen.originalname}`
    const rutaNuevaBBDD = `/images/${Date.now()}-${imagen.originalname}`
    fs.renameSync(imagen.path, rutaNuevaReal)

    return rutaNuevaBBDD
}

export default Multer


//-------------------------------------------------------------------------------
/*
    En este archivo se llevan a cabo las funcionalidades para guardar 
    imagenes en el servidor este proceso se lleva a cabo en tres pasos 

    1.- Desde un formulario X se sube un archivo de imagen que el 
    Middleware Multer procesa en una solicitud HTTP y sube a una 
    carpeta ubicada en el servidor.

    2.- Ya que la imagen está en el servidor, es accesible desde 
    cualquier navegador o servicio que cuente con esta URL, sin 
    embargo, hacemos un rename del archivo para hacer más accesible 
    y legible esta URL, dejando el nombre único del archivo.

    3.- Una vez renombrada la imagen enviamos la URL compatible con 
    los middlewares para usarla en su posterior guardado
*/ 