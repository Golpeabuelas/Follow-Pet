import pg from 'pg'
import dotenv from 'dotenv'
dotenv.config()

const connection = new pg.Pool({ 
    connectionString: process.env.DATABASE_CONNECTION,
    ssl: true,
})

connection.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Error de conexión:', err)
    } else {
        console.log('Conexión exitosa a la base de datos')
    }
})

export default connection