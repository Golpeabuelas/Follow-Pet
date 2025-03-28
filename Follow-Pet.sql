--Es que tengo una tabla usuario que debe tener una relción uno a uno con una tabla ubicación_usuario y una tabla reporte que debe tener la misma relación con una tabla ubicación_reporte;
CREATE DATABASE if NOT EXISTS Follow_Pet;
USE Follow_Pet;
CREATE TABLE if NOT EXISTS usuario(
    id_usuario SERIAL PRIMARY KEY,
    id_ubicacion INT NOT NULL,
    nombre_usuario VARCHAR(16) UNIQUE NOT NULL,
    correo_usuario VARCHAR(255) UNIQUE NOT NULL,
    contraseña_usuario VARCHAR(255) NOT NULL,
    foto_usuario VARCHAR(255) NOT NULL,
    FOREIGN KEY (id_ubicacion) REFERENCES ubicacion(id_ubicacion)
);

--para un reporte se necesitan los atributos del reporte; 
--los atributos de la desaparición;
--los atributos de la mascota;
CREATE TABLE if NOT EXISTS reporte(
    id_reporte SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_estatus INT NOT NULL,
    titulo_publicacion VARCHAR(30) NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_estatus) REFERENCES estatus_reporte(id_estatus) ON DELETE CASCADE
);

CREATE TABLE if NOT EXISTS reporte_desaparicion(
    id_reporte INT UNIQUE NOT NULL,
    id_ubicacion_desaparicion INT NOT NULL,
    fecha_desaparicion DATE NOT NULL,
    descripcion_desaparicion VARCHAR(255) NOT NULL,
    FOREIGN KEY (id_ubicacion_desaparicion) REFERENCES ubicacion(id_ubicacion)
);

CREATE TABLE if NOT EXISTS estatus_reporte(
    id_estatus SERIAL PRIMARY KEY,
    estatus VARCHAR(20) NOT NULL,
    --HACER LOS INSERTS PARA ESTABLECER LOS ESTATUS.
);

CREATE TABLE if NOT EXISTS ubicacion(
    id_ubicacion SERIAL PRIMARY KEY,
    latitud_ubicacion DECIMAL(6,2),
    longitud_ubicacion DECIMAL(6,2)
);

SHOW TABLES;
