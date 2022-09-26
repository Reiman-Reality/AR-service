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

//insert model data by passing an object
export async function insert_model(model: d) {
    await connection.query('INSERT INTO MODELS (model_id, file_path) VALUES (d.id, d.path) ');
}


// selete model data by id
export async function select_model(int: id) {
    await connection.query('SELECT * FROM MODELS WHERE id = ${id}');
}


//delete model data
export async function delete_model(int: i) {
    await connection.query('DELETE FROM MODELS WHERE id = ${id}');
}

// update the object
export async function update_model(int: id) {
    await connection.query('UPDATE MODELS SET path = ${newpath} WHERE id = ${id}');
}

/*
`UPDATE MARKERTABLE 
SET
name = ${newname}
path = ${newpath}
WHERE
ID = ${markerID}
*/