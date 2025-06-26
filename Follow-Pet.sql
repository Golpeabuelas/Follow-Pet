CREATE TABLE rol_usuario (
  id_rol integer NOT NULL,
  rol character varying(16) NOT NULL,
  PRIMARY KEY (id_rol)
);

CREATE TABLE ubicacion (
  id_ubicacion character varying NOT NULL,
  latitud_ubicacion numeric,
  longitud_ubicacion numeric,
  PRIMARY KEY (id_ubicacion)
);

CREATE TABLE usuario (
  id_usuario character varying NOT NULL,
  id_ubicacion character varying NOT NULL,
  id_rol integer NOT NULL,
  nombre_usuario character varying(16) NOT NULL,
  correo_usuario character varying(255) NOT NULL,
  contraseña_usuario character varying(255) NOT NULL,
  foto_usuario character varying(255) NOT NULL,
  PRIMARY KEY (id_usuario),
  FOREIGN KEY (id_ubicacion) REFERENCES ubicacion(id_ubicacion),
  FOREIGN KEY (id_rol) REFERENCES rol_usuario(id_rol)
);

CREATE TABLE estatus_notificacion (
  id_estatus integer NOT NULL,
  estatus character varying(32) NOT NULL,
  PRIMARY KEY (id_estatus)
);

CREATE TABLE estatus_publicacion (
  id_estatus integer NOT NULL,
  estatus character varying(16) NOT NULL,
  PRIMARY KEY (id_estatus)
);

CREATE TABLE estatus_seguimiento (
  id_estatus integer NOT NULL,
  estatus character varying(32) NOT NULL,
  PRIMARY KEY (id_estatus)
);

CREATE TABLE publicacion (
  id_publicacion character varying NOT NULL,
  id_usuario character varying NOT NULL,
  id_estatus integer NOT NULL,
  titulo_publicacion character varying(30) NOT NULL,
  PRIMARY KEY (id_publicacion),
  FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
  FOREIGN KEY (id_estatus) REFERENCES estatus_publicacion(id_estatus)
);

CREATE TABLE publicacion_clinica (
  id_publicacion character varying NOT NULL,
  id_ubicacion character varying NOT NULL,
  telefono_clinica character varying NOT NULL,
  servicios_clinica character varying(255) NOT NULL,
  foto_clinica character varying(255) NOT NULL,
  enlace_web character varying(255),
  PRIMARY KEY (id_publicacion),
  FOREIGN KEY (id_publicacion) REFERENCES publicacion(id_publicacion),
  FOREIGN KEY (id_ubicacion) REFERENCES ubicacion(id_ubicacion)
);

CREATE TABLE calendario (
  id_calendario character varying NOT NULL,
  id_usuario character varying NOT NULL,
  PRIMARY KEY (id_calendario),
  FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);

CREATE TABLE eventos (
  id_eventos character varying NOT NULL,
  id_calendario character varying NOT NULL,
  titulo_evento character varying(16),
  evento character varying(255),
  PRIMARY KEY (id_eventos),
  FOREIGN KEY (id_calendario) REFERENCES calendario(id_calendario)
);

CREATE TABLE mascota (
  id_mascota character varying NOT NULL,
  id_usuario character varying NOT NULL,
  nombre_mascota character varying(30) NOT NULL,
  edad_mascota character varying(30) NOT NULL,
  color_mascota character varying(30) NOT NULL,
  foto_mascota character varying(255) NOT NULL,
  PRIMARY KEY (id_mascota),
  FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);

CREATE TABLE expediente (
  id_expediente character varying NOT NULL,
  id_mascota character varying NOT NULL,
  PRIMARY KEY (id_expediente),
  FOREIGN KEY (id_expediente) REFERENCES publicacion(id_publicacion),
  FOREIGN KEY (id_mascota) REFERENCES mascota(id_mascota)
);

CREATE TABLE expediente_usuario (
  id_expediente character varying NOT NULL,
  id_usuario character varying NOT NULL,
  PRIMARY KEY (id_expediente, id_usuario),
  FOREIGN KEY (id_expediente) REFERENCES expediente(id_expediente),
  FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);

CREATE TABLE seguimiento (
  id_seguimiento character varying NOT NULL,
  id_expediente character varying NOT NULL,
  id_estatus integer NOT NULL,
  titulo_seguimiento character varying(32) NOT NULL,
  seguimiento character varying(255) NOT NULL,
  PRIMARY KEY (id_seguimiento),
  FOREIGN KEY (id_expediente) REFERENCES expediente(id_expediente),
  FOREIGN KEY (id_estatus) REFERENCES estatus_seguimiento(id_estatus)
);

CREATE TABLE reporte_desaparicion (
  id_reporte character varying NOT NULL,
  id_ubicacion_desaparicion character varying NOT NULL,
  fecha_desaparicion date NOT NULL,
  descripcion_desaparicion character varying(255) NOT NULL,
  PRIMARY KEY (id_reporte),
  FOREIGN KEY (id_reporte) REFERENCES publicacion(id_publicacion),
  FOREIGN KEY (id_ubicacion_desaparicion) REFERENCES ubicacion(id_ubicacion)
);

CREATE TABLE reporte_mascota (
  id_reporte character varying NOT NULL,
  nombre_mascota character varying(30) NOT NULL,
  edad_mascota character varying(30) NOT NULL,
  color_mascota character varying(30) NOT NULL,
  distintivo_mascota character varying(30) NOT NULL,
  foto_mascota character varying(255) NOT NULL,
  PRIMARY KEY (id_reporte),
  FOREIGN KEY (id_reporte) REFERENCES publicacion(id_publicacion)
);

CREATE TABLE chat (
  id_chat character varying NOT NULL,
  id_publicacion character varying NOT NULL,
  PRIMARY KEY (id_chat),
  FOREIGN KEY (id_publicacion) REFERENCES publicacion(id_publicacion)
);

CREATE TABLE chat_usuario (
  id_chat character varying NOT NULL,
  id_usuario character varying NOT NULL,
  PRIMARY KEY (id_chat, id_usuario),
  FOREIGN KEY (id_chat) REFERENCES chat(id_chat),
  FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);

CREATE TABLE mensaje_chat (
  id_mensaje character varying NOT NULL,
  id_chat character varying NOT NULL,
  mensaje character varying(255) NOT NULL,
  fecha_envio date NOT NULL,
  id_usuario character varying NOT NULL,
  PRIMARY KEY (id_mensaje),
  FOREIGN KEY (id_chat) REFERENCES chat(id_chat),
  FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);

CREATE TABLE notificacion (
  id_notificacion character varying NOT NULL,
  id_mensajero character varying NOT NULL,
  id_destinatario character varying NOT NULL,
  id_estatus integer NOT NULL,
  descripcion_mensaje character varying(255) NOT NULL,
  fecha timestamp without time zone,
  PRIMARY KEY (id_notificacion),
  FOREIGN KEY (id_mensajero) REFERENCES usuario(id_usuario),
  FOREIGN KEY (id_destinatario) REFERENCES usuario(id_usuario),
  FOREIGN KEY (id_estatus) REFERENCES estatus_notificacion(id_estatus)
);

CREATE TABLE cliente_veterinario (
  id_cliente_veterinario character varying NOT NULL,
  id_veterinario character varying NOT NULL,
  id_cliente character varying NOT NULL,
  fecha_registro timestamp without time zone,
  PRIMARY KEY (id_cliente_veterinario),
  FOREIGN KEY (id_veterinario) REFERENCES usuario(id_usuario),
  FOREIGN KEY (id_cliente) REFERENCES usuario(id_usuario)
);

INSERT INTO rol_usuario (id_rol, rol) VALUES
(1, 'Usuario'),
(2, 'Veterinario'),
(3, 'Administrador');

INSERT INTO estatus_publicacion (id_estatus, estatus) VALUES
(0, 'Eliminada'),
(1, 'Desaparecido'),
(2, 'Encontrado'),
(3, 'Clínica'),
(4, 'Expediente'),
(5, 'Archivada'),
(6, 'Oculto-E'),
(7, 'Oculto-P');

INSERT INTO estatus_notificacion (id_estatus, estatus) VALUES
(1, 'no leída'),
(2, 'leída'),
(3, 'Confirmacion'),
(4, 'Aceptada'),
(5, 'Solicitud Aceptada'),
(6, 'Solicitud Rechazada');

INSERT INTO estatus_seguimiento (id_estatus, estatus) VALUES
(1, 'Prioridad baja'),
(2, 'Prioritario'),
(3, 'Urgente');