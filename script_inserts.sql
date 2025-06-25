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

