# Follow-Pet

## Forma de trabajo
Trabajaremos en GitHub, dividiendo las tareas en distintas ramas para una mejor organización, 
todos los documentos relacionados con el proyecto y la empresa se almacenarán en este repositorio 
cada avance contará con su propia clasificación correspondiente, NO se subirán modificaciones 
a la rama main hasta la conclusión del proyecto, NO trabajaremos con carpetas zip, todos los 
archivos subidos se subirán de manera individual.

## Estructura del repositorio
Base de datos  
│── Tablas  
│── Test's Querys  
│── BBDD imagenes  
│  
Servidor  
│── Solicitudes  
│── Validar Datos  
│── Protección Datos  
│  
Aplicacion Movil  
│── FRONTEND  
│── BACKEND  
│  
Aplicacion Web  
│── FRONTEND  
│── BACKEND  

## Guia de instalación

### BBDD (Pendiente)
### Servidor (Pendiente)
### App WEB (Pendiente)
### App Movil (Pendiente)

## Guia de colaboración

*I. Crear una nueva rama en GitHub*
    Ir a la pestaña **Branches**.
    Hacer clic en **New Branch**.
    Asignar un nombre descriptivo que indique la actividad 
    que se hará en esta nueva rama.

*II. Clonar el repositorio*
    En el repositorio hacer clic en el botón **Code**.
    Copia la URL del repositorio.
    En tu terminal, ejecuta el comando:

    git clone [URL del repositorio]

*III. Abrir el proyecto*
    Abrir el proyecto en el VSCode y asegurarse de estar
    en la rama main, NO hacer cambios en esta rama

*IV. Cambiar a la nueva rama*
    En la terminal, navega a la carpeta del repositorio:

    cd [nombre-del-repositorio]

    Para cambiar de rama y crearla localmente para enlazarla 
    con la remota:

    git checkout -b [nombre-de-la-rama] origin/[nombre-de-la-rama]

*V.Realizar los cambios*
    Haz tus cambios necesarios en el proyecto.

    Agrega los archivos al área de preparación:

    git add 

    Crea un commit con un mensaje claro que describa tus cambios:

    git commit -m "Descripción breve de los cambios"


*VI. Subir los cambios a GitHub*
    Envía los cambios a la rama remota:

    git push origin [nombre-de-la-rama]

## Tecnologías que usaremos durante el proyecto

### Servidor 
    - JavaScript
    - Node.js
    - PostgreSQL
    - Multer 
    - Cors
    - Express
    - Dotenv 
    - JSON Web Token
    - Protocolo HTTP
    - Protocolo WEB SOCKET

### Aplicación Móvil
- FRONTEND
    - JavaScript
    - Node.js
    - React Native
    - React Native Maps
    - Expo
    - Expo Router
    - Tailwind CSS
- BACKEND
    - JavaScript
    - Node.js
    - Expo Notifications
    - PostgreSQL
    - Express
    - Dotenv 
    - JSON Web Token
    - Firebase 
    - Protocolo HTTP
    - Protocolo WEB SOCKET

### Aplicación Web
- FRONTEND
    - JavaScript
    - Node.js
    - React
    - HTML
    - CSS
    - ~~Materialize~~
    - ~~Tailwind CSS~~
- BACKEND
    - JavaScript
    - Node.js
    - PostgreSQL
    - Express
    - Dotenv 
    - LocalStorage
    - Morgan
    - Mocha
    - Protocolo HTTP
    - Protocolo WEB SOCKET