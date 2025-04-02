# Proyecto-Traba-Inc-WEB

Hasta este momento solo se ha avanzado en la arquitectura del servidor 
y algunas validaciones menores para ejecutar el servidor. Se deben de seguir 
los siguientes pasos:

    I. Instalar los node_modules que se necesitarán para ejecutar el programa
    ctrl + ñ para abrir una terminal y ejecutar el comando < npm i > que
    instalará todas las dependencias que requerirá el sistema

    II. En la ruta src/database/script_sql.sql se encuentra la base de 
    datos que deberá ser ejecutada en mySQLWorkbench o algún otro sistema 
    de mysql8

    III. En la ruta src/server_functions/connection_sql.js viene la conexión
    que se deberá personalizar de acuerdo a la contraseña, host y usuario del
    ejecutante

    IV. Existen dos scripts principales dentro del packade.json, primero se 
    deberá ejecutar en la terminal abierta el comando npm run start que abrirá
    y ejecutará la función más importante del sistema

    v. Para ejecutar el servidor con nodemon se deberá ejecutar el comando 
    npm run dev que dará un link que se podrá seguir con ctrl + click  