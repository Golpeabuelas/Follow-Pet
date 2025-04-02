CREATE DATABASE if NOT EXISTS TrabaInc;

USE TrabaInc;

CREATE TABLE if NOT EXISTS usuario(
    id_usuario INT PRIMARY KEY auto_increment,
    nombre varchar(50) NOT NULL,
    correo varchar(50) NOT NULL,
    password varchar(50) NOT NULL,
    foto_usuario TEXT NOT NULL,
    permisos boolean NOT NULL
);

CREATE TABLE if NOT EXISTS ubicacion_usuario(
    id_usuario INT PRIMARY KEY auto_increment,
    latitud DECIMAL(8,6) NOT NULL,
    longitud DECIMAL(9,6) NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE if NOT EXISTS publicacion(
    id_publicacion INT PRIMARY KEY auto_increment,
    id_usuario INT NOT NULL,
    titulo_publicacion VARCHAR(50) NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE if NOT EXISTS chat_publicacion(
    id_chat INT PRIMARY KEY auto_increment,
    id_publicacion INT NOT NULL,
    FOREIGN KEY (id_publicacion) REFERENCES publicacion(id_publicacion)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);   

CREATE TABLE if NOT EXISTS mensaje_chat(
	id_mensaje INT PRIMARY KEY auto_increment,
    id_chat INT NOT NULL,
    id_usuario INT NOT NULL,
    FOREIGN KEY (id_chat) REFERENCES chat_publicacion(id_chat)
    ON DELETE CASCADE 
    ON UPDATE CASCADE,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);

CREATE TABLE if NOT EXISTS informacion_mascota(
    id_publicacion INT PRIMARY KEY,
    imagen_mascota TEXT NOT NULL,
    nombre_mascota VARCHAR(50) NOT NULL,
    especie_mascota VARCHAR(50) NOT NULL,
    color_mascota VARCHAR(50) NOT NULL,
    distintivo_mascota VARCHAR(50) NOT NULL,
    FOREIGN KEY (id_publicacion) REFERENCES publicacion(id_publicacion)
);

CREATE TABLE if NOT EXISTS informacion_desaparicion(
    id_publicacion INT PRIMARY KEY,
    fecha_desparicion DATE NOT NULL,
    descripcion_desaparicion varchar(300),
    estatus_desaparicion BOOLEAN NOT NULL,
    FOREIGN KEY (id_publicacion) REFERENCES publicacion(id_publicacion)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE if NOT EXISTS ubicacion_desaparicion(
    id_publicacion INT PRIMARY KEY,
    latitud DECIMAL(8,6) NOT NULL,
    longitud DECIMAL(9,6) NOT NULL,
    FOREIGN KEY (id_publicacion) REFERENCES publicacion(id_publicacion)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE if NOT EXISTS usuario_chat_publicacion(
    id_usuario INT,
    id_chat INT,
    PRIMARY KEY (id_usuario, id_chat),
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
    FOREIGN KEY (id_chat) REFERENCES chat_publicacion(id_chat)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

INSERT INTO usuario(nombre, correo, password, foto_usuario, permisos) VALUES ('Julián', 'chavez.garcia.julian2@gmail.com', 'Tr4b4_1nc_4dm1n1str4d0r', '', true);

INSERT INTO publicacion(titulo_publicacion, id_usuario) VALUES('Primer test de publicaciones', 1);
INSERT INTO informacion_mascota(id_publicacion, imagen_mascota, nombre_mascota, especie_mascota, color_mascota, distintivo_mascota) VALUES(1, '', 'Claw', 'Osito', 'Café', 'Tiene su propio prepucio de Ravenclaw');
INSERT INTO informacion_desaparicion(id_publicacion, fecha_desparicion, descripcion_desaparicion, estatus_desaparicion) VALUES(1, '2007-11-05', 'Encuentrenlo porque muerde', true);
INSERT INTO chat_publicacion(id_publicacion) VALUES(1);

UPDATE usuario SET nombre = 'Julian' WHERE id_usuario = 1;

SELECT 
    u.id_usuario,
    u.nombre AS nombre_usuario,
    u.correo,
    p.id_publicacion,
    p.titulo_publicacion,
    im.imagen_mascota,
    im.nombre_mascota,
    im.especie_mascota,
    im.color_mascota,
    im.distintivo_mascota,
    id.fecha_desparicion,
    c.id_chat
FROM 
    usuario u
LEFT JOIN 
    publicacion p ON u.id_usuario = p.id_usuario
LEFT JOIN 
    informacion_mascota im ON p.id_publicacion = im.id_publicacion
LEFT JOIN 
    informacion_desaparicion id ON p.id_publicacion = id.id_publicacion
LEFT JOIN 
    chat_publicacion c ON p.id_publicacion = c.id_publicacion
WHERE 
    p.id_usuario = 1;
    
SELECT 
	p.id_publicacion,
    p.titulo_publicacion,
    im.imagen_mascota,
    im.nombre_mascota,
    im.especie_mascota,
    im.color_mascota,
    im.distintivo_mascota,
    id.fecha_desparicion,
    c.id_chat
FROM 
	publicacion p
LEFT JOIN 
    informacion_mascota im ON p.id_publicacion = im.id_publicacion
LEFT JOIN 
    informacion_desaparicion id ON p.id_publicacion = id.id_publicacion
LEFT JOIN 
    chat_publicacion c ON p.id_publicacion = c.id_publicacion
WHERE 
    p.id_publicacion = 3;
    
DELETE FROM id_usuario WHERE id_usuario = 2;