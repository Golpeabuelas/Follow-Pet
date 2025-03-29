CREATE TABLE if NOT EXISTS ubicacion(
    id_ubicacion SERIAL PRIMARY KEY,
    latitud_ubicacion DECIMAL(6,2),
    longitud_ubicacion DECIMAL(6,2)
);

CREATE TABLE if NOT EXISTS rol_usuario (
	id_rol SERIAL PRIMARY KEY,
	rol VARCHAR(16) NOT NULL
	--HACER LOS INSERTS PARA ESTABLECER LOS ROLES DEL USUARIO.
);

CREATE TABLE if NOT EXISTS usuario(
    id_usuario SERIAL PRIMARY KEY,
    id_ubicacion INT NOT NULL,
	id_rol INT NOT NULL,
    nombre_usuario VARCHAR(16) UNIQUE NOT NULL,
    correo_usuario VARCHAR(255) UNIQUE NOT NULL,
    contraseña_usuario VARCHAR(255) NOT NULL,
    foto_usuario VARCHAR(255) NOT NULL,
    FOREIGN KEY (id_ubicacion) REFERENCES ubicacion(id_ubicacion) 
	ON DELETE CASCADE
	ON UPDATE CASCADE,
	FOREIGN KEY (id_rol) REFERENCES rol_usuario(id_rol) 
	ON DELETE CASCADE
	ON UPDATE CASCADE
);

CREATE TABLE if NOT EXISTS mascota(
	id_mascota SERIAL PRIMARY KEY,
	id_usuario INT NOT NULL,
	nombre_mascota VARCHAR(30) NOT NULL,
	edad_mascota VARCHAR(30) NOT NULL,
	color_mascota VARCHAR(30) NOT NULL, 
	foto_mascota VARCHAR(255) NOT NULL, 
	FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) 
	ON DELETE CASCADE 
	ON UPDATE CASCADE
);

CREATE TABLE if NOT EXISTS estatus_publicacion(
    id_estatus SERIAL PRIMARY KEY,
    estatus VARCHAR(16) NOT NULL
    --HACER LOS INSERTS PARA ESTABLECER LOS ESTATUS.
);

CREATE TABLE if NOT EXISTS publicacion(
    id_publicacion SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_estatus INT NOT NULL,
    titulo_publicacion VARCHAR(30) NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) 
	ON DELETE CASCADE
	ON UPDATE CASCADE,
    FOREIGN KEY (id_estatus) REFERENCES estatus_publicacion(id_estatus) 
	ON DELETE CASCADE
	ON UPDATE CASCADE
);

CREATE TABLE if NOT EXISTS reporte_desaparicion(
    id_reporte INT PRIMARY KEY,
    id_ubicacion_desaparicion INT NOT NULL,
    fecha_desaparicion DATE NOT NULL,
    descripcion_desaparicion VARCHAR(255) NOT NULL,
	FOREIGN KEY (id_reporte) REFERENCES publicacion(id_publicacion) 
	ON DELETE CASCADE
	ON UPDATE CASCADE,
    FOREIGN KEY (id_ubicacion_desaparicion) REFERENCES ubicacion(id_ubicacion) 
	ON DELETE CASCADE
	ON UPDATE CASCADE
);

CREATE TABLE if NOT EXISTS reporte_mascota(
	id_reporte INT PRIMARY KEY,
	nombre_mascota VARCHAR(30) NOT NULL,
	edad_mascota VARCHAR(30) NOT NULL,
	color_mascota VARCHAR(30) NOT NULL, 
	distintivo_mascota VARCHAR(30) NOT NULL,
	foto_mascota VARCHAR(255) NOT NULL, 
	FOREIGN KEY (id_reporte) REFERENCES publicacion(id_publicacion) 
	ON DELETE CASCADE
	ON UPDATE CASCADE
);

CREATE TABLE if NOT EXISTS publicacion_clinica(
	id_publicacion INT PRIMARY KEY,
	id_ubicacion INT NOT NULL,
	telefono_clinica INT NOT NULL,
	servicios_clinica VARCHAR(255) NOT NULL,
	foto_clinica VARCHAR(255) NOT NULL,
	enlace_web VARCHAR(255),
	FOREIGN KEY (id_publicacion) REFERENCES publicacion(id_publicacion)
	ON DELETE CASCADE
	ON UPDATE CASCADE,
	FOREIGN KEY (id_ubicacion) REFERENCES ubicacion(id_ubicacion)
	ON DELETE CASCADE
	ON UPDATE CASCADE
);

CREATE TABLE if NOT EXISTS bandeja_entrada(
	id_bandeja SERIAL PRIMARY KEY,
	id_usuario INT NOT NULL,
	descripcion_mensaje
	FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) 
	ON DELETE CASCADE
	ON UPDATE CASCADE
);

CREATE TABLE if NOT EXISTS expediente(
	id_veterinario INT PRIMARY KEY,
	
);

CREATE TABLE if NOT EXISTS chat(
	id_chat SERIAL PRIMARY KEY,
	id_publicacion INT NOT NULL,
	FOREIGN KEY (id_publicacion) REFERENCES publicacion(id_publicacion) 
	ON DELETE CASCADE
	ON UPDATE CASCADE
);

CREATE TABLE if NOT EXISTS chat_usuario(
	id_chat INT NOT NULL,
	id_usuario INT NOT NULL,
	PRIMARY KEY (id_chat, id_usuario),
	FOREIGN KEY (id_chat) REFERENCES chat(id_chat) 
	ON DELETE CASCADE
	ON UPDATE CASCADE,
	FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) 
	ON DELETE CASCADE
	ON UPDATE CASCADE
);

CREATE TABLE if NOT EXISTS mensaje_chat(
	id_mensaje SERIAL PRIMARY KEY,
	id_chat INT NOT NULL,
	mensaje VARCHAR(255) NOT NULL,
	FOREIGN KEY (id_chat) REFERENCES chat(id_chat) 
	ON DELETE CASCADE
	ON UPDATE CASCADE
);

DROP TABLE if EXISTS ubicacion CASCADE;
DROP TABLE if EXISTS rol_usuario CASCADE;
DROP TABLE if EXISTS usuario CASCADE;
DROP TABLE if EXISTS estatus_reporte CASCADE;
DROP TABLE if EXISTS reporte CASCADE;
DROP TABLE if EXISTS reporte_desaparicion CASCADE;
DROP TABLE if EXISTS reporte_mascota CASCADE;
DROP TABLE if EXISTS publicacion_clinica CASCADE;
DROP TABLE if EXISTS mascota CASCADE;
DROP TABLE if EXISTS chat CASCADE;
DROP TABLE if EXISTS chat_usuario CASCADE;
DROP TABLE if EXISTS mensaje_chat CASCADE;
