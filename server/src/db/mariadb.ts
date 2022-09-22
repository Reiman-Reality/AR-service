import * as mariadb from 'mariadb';

const connection = mariadb.createPool({
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD
});

export async function getAllEvents() {
    await connection.query('SELECT 1 + 1 AS solution');
}