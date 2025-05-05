import pg from 'pg'
import dotenv from 'dotenv'
dotenv.config()

// Configuración de la conexión a la base de datos PostgreSQL
// Usar variables de entorno cuando se implemente la bbdd en render hosteada
// const connection = new pg.Pool({ 
//     connectionString: process.env.DATABASE_CONNECTION,
//     ssl: true,
// })

const connection = new pg.Pool({
    host: "localhost",
    database: "Follow_Pet",
    user: "postgres",
    password: "root"
})

connection.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Error de conexión:', err)
    } else {
        console.log('Conexión exitosa a la base de datos')
    }
})

export default connection