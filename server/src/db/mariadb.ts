import { connect } from 'http2';
import * as mariadb from 'mariadb';
import {markerData} from '../types/dbTypes/markerType'
import {modelData} from '../types/dbTypes/modelType'

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

export async function getAllModels() {
    try {
        const connection = await pool.getConnection();
        const data = await connection.query("SELECT * FROM MODELS");
        console.log(data);
    }
    catch(exception: unknown) {
        console.log(exception);
    }
}

export async function insertModel(data: modelData) {
    try {
        const connection = await pool.getConnection();
        const data = await connection.query(`INSERT INTO MODELS (model_id, string_path)
        VALUES (1, "hello")`);
    } catch( exception: unknown) {
        console.log(exception);
    }
}

export async function updateModel(data: modelData) {
    try {
        const connection = await pool.getConnection();
        const data = await connection.query("UPDATE MODELS SET string_path = 'hehehe' WHERE model_id =1");
    } catch( exception: unknown) {
        console.log(exception);
    }
}

export async function deleteModel(data: modelData) {
    try {
        const connection = await pool.getConnection();
        const data = await connection.query("DELETE FROM MODELS WHERE model_id =1");
    } catch( exception: unknown) {
        console.log(exception);
    }
}


