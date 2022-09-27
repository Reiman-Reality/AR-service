import { connect } from 'http2';
import * as mariadb from 'mariadb';
import {markerData} from '../types/dbTypes/markerType'

var pool: mariadb.Pool;

export async function connectDatabase() {
    console.log(process.env.DBHOST);
    pool = await mariadb.createPool({
        host: process.env.DBHOST,
        user: process.env.DBUSER,
        password: process.env.DBPASSWORD,
        database: process.env.DBNAME,
        port: 3306,
        connectionLimit: 10,
        idleTimeout: 5
    });
}

export async function ping() {
    try{
        // every connection attempt must be preceded by get connection
        const connection = await pool.getConnection();
        const success = await connection.ping();
    } catch (exception :unknown) {
        console.log(exception);
    }
}

export async function getAllEvents() {
    try{
        const connection = await pool.getConnection();
        const data = await connection.query( `SELECT * FROM EVENT_TABLE`);
    } catch( exception: unknown) {
        console.log(exception);
    }
}

export async function getAllMarkers() {
    try {
        const connection = await pool.getConnection();
        const data = await connection.query("SELECT * FROM MARKERS");
        console.log(data);
    }
    catch(exception: unknown) {
        console.log(exception);
    }
}

export async function insertMarker( data: markerData) {
    try {
        const connection = await pool.getConnection();
        const data = await connection.query(`INSERT INTO MARKERS (marker_id, server_path)
        VALUES (uuid(), "hello")`);
    } catch( exception: unknown) {
        console.log(exception);
    }
}

/*
export async function createMarker( data: any) {

    await connection.query(`insert into markertable ${data.markerName}`);

}

//insert model data by passing an object
export async function insert_model(model: object) {
    await connection.query('INSERT INTO MODELS (model_id, file_path) VALUES (d.id, d.path) ');
}


// selete model data by id
export async function select_model(id: number) {
    await connection.query('SELECT * FROM MODELS WHERE id = ${id}');
}


//delete model data
export async function delete_model(id: number) {
    await connection.query('DELETE FROM MODELS WHERE id = ${id}');
}

// update the object
export async function update_model(id: number) {
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