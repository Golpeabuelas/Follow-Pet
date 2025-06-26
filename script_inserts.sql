CREATE TABLE if NOT EXISTS ubicacion(
    id_ubicacion VARCHAR PRIMARY KEY,
    latitud_ubicacion DECIMAL(6,2),
    longitud_ubicacion DECIMAL(6,2)
);

CREATE TABLE if NOT EXISTS rol_usuario (
	id_rol SERIAL PRIMARY KEY,
	rol VARCHAR(16) NOT NULL
);

CREATE TABLE if NOT EXISTS usuario(
    id_usuario VARCHAR PRIMARY KEY,
    id_ubicacion VARCHAR NOT NULL,
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

CREATE TABLE if NOT EXISTS estatus_publicacion(
    id_estatus SERIAL PRIMARY KEY,
    estatus VARCHAR(16) NOT NULL
);

CREATE TABLE if NOT EXISTS publicacion(
    id_publicacion VARCHAR PRIMARY KEY,
    id_usuario VARCHAR NOT NULL,
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
    id_reporte VARCHAR PRIMARY KEY,
    id_ubicacion_desaparicion VARCHAR NOT NULL,
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
	id_reporte VARCHAR PRIMARY KEY,
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

CREATE TABLE if NOT EXISTS expediente(
	id_expediente INT PRIMARY KEY,
	id_mascota INT NOT NULL,
	FOREIGN KEY (id_expediente) REFERENCES publicacion(id_publicacion)
	ON DELETE CASCADE
	ON UPDATE CASCADE,
	FOREIGN KEY (id_mascota) REFERENCES mascota(id_mascota)
	ON DELETE CASCADE
	ON UPDATE CASCADE
);





-------------------------------INSERTS DE PRUEBAS-----------------------------------------

SELECT * FROM estatus_publicacion
SELECT * FROM usuario
SELECT * FROM ubicacion WHERE 
id_ubicacion != '04c37348-d342-448e-9b3b-fb6aa9ceab1f' AND 
id_ubicacion != 'a10069d0-2d85-48e1-9d13-ba0d1b93794f' AND 
id_ubicacion != 'e8a46dbd-17bf-4a0e-a079-91b01757604b'
SELECT id_publicacion, titulo_publicacion FROM publicacion

INSERT INTO estatus_publicacion (id_estatus, estatus) VALUES
(0, 'Eliminada'),
(1, 'Desaparecido'),
(2, 'Encontrado'),
(3, 'Clínica'),
(4, 'Expediente'),
(5, 'Archivada');

INSERT INTO usuario (
    id_usuario, id_ubicacion, id_rol, nombre_usuario, correo_usuario, contraseña_usuario, foto_usuario
) VALUES (
    '522909d2-2d7f-4dcb-b4bc-52defd9ab045',
    '861468e8-a622-4e79-8742-c36d47b2f035',
    1,
    'carlosr',
    'carlos@example.com',
    'hashedpassword123',
    '/images/leodeidad.jpg'
);

INSERT INTO ubicacion (id_ubicacion, latitud_ubicacion, longitud_ubicacion) VALUES
('a2f7f2cf-bd45-4420-9e3b-7f1186428e8f', 19.41, -99.13),
('8328ce92-cc79-42fe-9910-bad86f263e72', 19.41, -99.14),
('861468e8-a622-4e79-8742-c36d47b2f035', 19.40, -99.14);

INSERT INTO publicacion (id_publicacion, id_usuario, id_estatus, titulo_publicacion) VALUES
('eb17642b-8abc-4923-81bd-0b957dc27075', '522909d2-2d7f-4dcb-b4bc-52defd9ab045', 1, 'Se busca Rocky'),
('12ff16cc-47a4-45e9-aa82-8c61b8fc2fa0', '522909d2-2d7f-4dcb-b4bc-52defd9ab045', 2, 'Cachorro encontrado');

INSERT INTO reporte_mascota (
    id_reporte, nombre_mascota, edad_mascota, color_mascota, distintivo_mascota, foto_mascota
) VALUES
('eb17642b-8abc-4923-81bd-0b957dc27075', 'Rocky', '2 años', 'Negro', 'Collar rojo', '/images/momido.jpg'),
('12ff16cc-47a4-45e9-aa82-8c61b8fc2fa0', 'Luna', '1 año', 'Blanco', 'Mancha en la oreja', '/images/perroPrepucio.jpg');

INSERT INTO reporte_desaparicion (
    id_reporte, id_ubicacion_desaparicion, fecha_desaparicion, descripcion_desaparicion
) VALUES
('eb17642b-8abc-4923-81bd-0b957dc27075', 'a2f7f2cf-bd45-4420-9e3b-7f1186428e8f', '2025-06-20', 'Se perdió en el parque cerca de Chabacano'),
('12ff16cc-47a4-45e9-aa82-8c61b8fc2fa0', '8328ce92-cc79-42fe-9910-bad86f263e72', '2025-06-22', 'Encontrado caminando solo cerca del metro');



--PUBLICACION 1 DE PRUEBA TERMINADA 
INSERT INTO reporte_desaparicion (
  id_reporte, id_ubicacion_desaparicion, fecha_desaparicion, descripcion_desaparicion
) VALUES (
  'db31973e-33f6-473f-9ce3-671f4d0e2738', '1e046057-439a-48e9-84c2-a768eaa95b66', '2025-06-20', 'Max desapareció en el parque'
);

INSERT INTO reporte_mascota (
  id_reporte, nombre_mascota, edad_mascota, color_mascota, distintivo_mascota, foto_mascota
) VALUES (
  'db31973e-33f6-473f-9ce3-671f4d0e2738', 'Max', '3 años', 'Marrón', 'Tiene una mancha blanca', '/images/Max.jpg'
);

--PUBLICACION 2 DE PRUEBA TERMINADA 
INSERT INTO reporte_desaparicion (
  id_reporte, id_ubicacion_desaparicion, fecha_desaparicion, descripcion_desaparicion
) VALUES (
  '4e6af41d-a143-48d7-b7ac-ca8087ff187d', '2a3df25b-26e8-451f-8083-4b11328ca97f', '2025-06-22', 'Lola se escapó del patio'
);

INSERT INTO reporte_mascota (
  id_reporte, nombre_mascota, edad_mascota, color_mascota, distintivo_mascota, foto_mascota
) VALUES (
  '4e6af41d-a143-48d7-b7ac-ca8087ff187d', 'Lola', '2 años', 'Negra', 'Tiene un collar rojo', '/images/Lola.jpg'
);

--PUBLICACION 3 DE PRUEBA TERMINADA 
INSERT INTO reporte_desaparicion (
  id_reporte, id_ubicacion_desaparicion, fecha_desaparicion, descripcion_desaparicion
) VALUES (
  'be5a33bd-b769-4387-a122-5bbd25465ebb', '31800a87-542f-4e40-8ece-0c35ebe8fd17', '2025-06-23', 'Encontrado cerca de la gasolinera'
);

INSERT INTO reporte_mascota (
  id_reporte, nombre_mascota, edad_mascota, color_mascota, distintivo_mascota, foto_mascota
) VALUES (
  'be5a33bd-b769-4387-a122-5bbd25465ebb', 'Sin nombre', 'Adulto', 'Blanco con manchas', 'Llevaba un pañuelo azul', '/images/mafufo.jpg'
);

--PUBLICACION 4 DE PRUEBA TERMINADA 
INSERT INTO reporte_desaparicion (
  id_reporte, id_ubicacion_desaparicion, fecha_desaparicion, descripcion_desaparicion
) VALUES (
  '270c976c-94dc-4776-b540-e92fc0176d98', '94881f7c-9de9-4954-8665-72626dfff899', '2025-06-21', 'Encontrado en la azotea del edificio 5.'
);

INSERT INTO reporte_mascota (
  id_reporte, nombre_mascota, edad_mascota, color_mascota, distintivo_mascota, foto_mascota
) VALUES (
  '270c976c-94dc-4776-b540-e92fc0176d98', 'Sin nombre', 'Joven', 'Gris', 'Tiene una oreja rasgada', '/images/hoskyw.jpeg'
);


--Estatus 0, publicación eliminada
--Estatus 1, reporte desaparecido
--Estatus 2, reporte encontrado
--Estatus 3, publicación de clinica
--Estatus 4, expediente veterinario
--Estatus 5, publicacion archivada 

