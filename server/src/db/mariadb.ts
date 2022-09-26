import { connect } from 'http2';
import * as mariadb from 'mariadb';
import {markerType} from '../types/dbTypes/markerType'

console.log('hi');
var connection;

export async function connectDatabase() {
    console.log(process.env.DBHOST);
    connection = await mariadb.createConnection({
        host: process.env.DBHOST,
        user: process.env.DBUSER,
        password: process.env.DBPASSWORD,
        port: 3306,
    });
}

export async function getAllEvents() {
    try{
        await connection.query('SELECT 1 + 1 AS solution');
    } catch( exception: unknown) {
        console.log(exception);
    }
}



export async function createMarker( data: any) {

    await connection.query(`insert into markertable ${data.markerName}`);

}