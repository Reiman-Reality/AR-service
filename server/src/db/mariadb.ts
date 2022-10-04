import { connect } from 'http2';
import * as mariadb from 'mariadb';
import {v4} from 'uuid';
import {markerData, modelData, eventData} from '../types/dbTypes/databaseTypes'

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
        console.log(typeof(data));
    } catch( exception: unknown) {
        console.log(exception);
    }
}

export async function addEvent(event: eventData) {
    try{
        const connection = await pool.getConnection();
        const id = v4();
        const success = await connection.query(`INSERT INTO EVENTS (event_id, name, created_on)
        VALUES ("${id}", "${event.eventName}", "${event.insertedOn}");`);
        return id;
    } catch( exception:unknown ){
        console.log(exception);
    }
}

export async function getAllMarkers() {
    try {
        const connection = await pool.getConnection();
        const data = await connection.query("SELECT * FROM MARKERS");
        const keys = Object.keys(data);
        const returnData = [];
        for( const key of keys ) {
            if(key === 'meta') {
                break;
            }

            returnData.push( data[key] );
        }
        return returnData;
    }
    catch(exception: unknown) {
        console.log(exception);
    }
}

export async function linkMarkerToEvent(markerID:string, eventID:string) {
    try{
        const connection = await pool.getConnection();
        await connection.query(`UPDATE MARKERS 
        WHERE marker_id = ${markerID}
        SET event_id = ${eventID}`);
        return true;
    }catch( exception: unknown) {
        console.log(exception);
        return false;
    }
    
}

export async function insertMarker( data: markerData) {
    try {
        const connection = await pool.getConnection();
        await connection.query(`INSERT INTO MARKERS (marker_id, name, file_path, inserted_on)
        VALUES (uuid(), "${data.name}", "${data.filepath}", "${data.insertedOn}")`);
        return true;
    } catch( exception: unknown) {
        console.log(exception);
        return false;
    }
}

export async function updateMarker( data: markerData) {
    try {
        const connection = await pool.getConnection();
        await connection.query(`UPDATE MARKERS
        WHERE marker_id = ${data.markerID}
        SET server_path = ${data.filepath}`);
        return true;
    } catch (exception: unknown) {
        console.log('exception');
        return false;
    }
}

export async function getAllModels() {
    try {
        const connection = await pool.getConnection();
        const data = await connection.query("SELECT * FROM MODELS");
        const keys = Object.keys(data);
        const returnData = [];
        for( const key of keys ) {
            if(key === 'meta') {
                break;
            }

            returnData.push( data[key] );
        }
        return returnData;
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


