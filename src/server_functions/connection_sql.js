import mysql from "mysql2"

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '$$I0h17eSi$$',
    database: 'TrabaInc'
})

connection.connect(err => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Database connection established.');
});

export default connection;