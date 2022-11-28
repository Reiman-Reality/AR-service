import { connect } from 'http2';
import * as mariadb from 'mariadb';
import {v4} from 'uuid';
import * as dotenv from 'dotenv';
import process from 'node:process';
import {markerData, modelData, eventData,login} from '../types/databaseTypes'

dotenv.config();

var pool: mariadb.Pool = await connectDatabase();

export async function connectDatabase() {
    const dbpool = await mariadb.createPool({
        host: process.env.DBHOST,
        user: process.env.DBUSER,
        password: process.env.DBPASSWORD,
        database: process.env.DBNAME,
        port: 3306,
        connectionLimit: 10,
        idleTimeout: 0,
    });
    return dbpool;
}

export async function ping() {
    try{
        // every connection attempt must be preceded by get connection
        const connection = await pool.getConnection();
        const success = await connection.ping();
        connection.end();
    } catch (exception :unknown) {
        console.log(exception);
    }
}

export async function getAllEvents() {
    try{
        const connection = await pool.getConnection();
        const data = await connection.query( `SELECT * FROM EVENT_TABLE`);
        console.log(typeof(data));
        connection.end();
    } catch( exception: unknown) {
        console.log(exception);
    }
}

export async function getAccountByUsername(username: string, password: string) {
    try{
        const connection = await pool.getConnection();
        const data = await connection.query( `SELECT*FROM USER where username ="${username}" and password="${password}";`);
        connection.end();
        console.log(typeof( data ));
        delete data['meta'];
        console.log(data);
        return data;
    } catch( exception: unknown) {
        console.log(exception);
        return null;
    }
}

export async function addUser(account: login) {
    try{
        const connection = await pool.getConnection();
        const data = await connection.query( `INSERT INTO USER (username, password, role) values("${account.username}","${account.password}","${account.role}");`);
        connection.end();
        return true
    } catch( exception: unknown) {
        console.log(exception);
        return false
    }
}



export async function getModelsByMarkerID(input: string) {
    try {
        const connection = await pool.getConnection();
        const data = await connection.query(`select MODELS.model_id, MODELS.file_path, MODELS.inserted_on, MODELS.name from MODELS inner join EVENTS on MODELS.model_id = EVENTS.model_id where EVENTS.marker_id = "${input}";`);
        const keys = Object.keys(data);
        const returnData = [];
        for( const key of keys ) {
            if(key === 'meta') {
                break;
            }

            returnData.push( data[key] );
        }
        connection.end();
        return returnData;
    }
    catch(exception: unknown) {
        console.log(exception);
        return [];
    }
}

export async function getModelAndMarkerNames() {
    try {
        const connection = await pool.getConnection();
        const data = await connection.query("select MARKERS.file_path_one, MODELS.file_path FROM EVENTS LEFT JOIN MARKERS ON MARKERS.marker_id = EVENTS.marker_id LEFT JOIN MODELS ON MODELS.model_id = EVENTS.model_id;");
        const keys = Object.keys(data);
        const returnData = [];
        for( const key of keys ) {
            if(key === 'meta') {
                break;
            }
            console.log(data[key]);
            returnData.push( data[key] );
        }
        connection.end();
        return returnData;
    }
    catch(exception: unknown) {
        console.log(exception);
        return [];
    }
}

export async function addEvent(event: eventData) {
    try{
        const connection = await pool.getConnection();
        const id = v4();
        const success = await connection.query(`INSERT INTO EVENTS (marker_id, model_id, x_pos, y_pos,z_pos)
        VALUES ( "${event.marker_id}", "${event.model_id}", "${event.x_pos}", "${event.y_pos}", "${event.z_pos}");`);
        connection.end();
        return id;
    } catch( exception:unknown ){
        console.log(exception);
    }
}

export async function deleteEventByModelID( modelID ) {
    try{
        const connection = await pool.getConnection();
        const success = await connection.query(`DELETE FROM EVENTS WHERE model_id="${modelID}"`)
        connection.end();
    } catch( exception:unknown ){
        console.log(exception);
    }
}

export async function deleteEventByMarkerID( markerID ) {
    try{
        const connection = await pool.getConnection();
        const success = await connection.query(`DELETE FROM EVENTS WHERE marker_id="${markerID}"`)
        connection.end();
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
        connection.end();
        return returnData;
    }
    catch(exception: unknown) {
        console.log(exception);
    }
}
export async function linkMarkerToEvent(markerID:string , eventID:string) {
    try{
        const connection = await pool.getConnection();
        await connection.query(`UPDATE MARKERS 
        WHERE marker_id = ${markerID}
        SET event_id = ${eventID}`);
        connection.end();
        return true;
    }catch( exception: unknown) {
        console.log(exception);
        return false;
    }
    
}

export async function linkModelToEvent(modelID: string[] , eventID:string) {
    try{
        const connection = await pool.getConnection();
        for (let i = 0; i < modelID.length; i ++){
        await connection.query(`UPDATE MODELS 
        WHERE model_id = ${modelID[i]}
        SET event_id = ${eventID}`);
        }
        connection.end();
        return true;
    }catch( exception: unknown) {
        console.log(exception);
        return false;
    }
    
}

export async function insertMarker( data: markerData) {
    try {
        const connection = await pool.getConnection();
        const id = v4();
        await connection.query(`INSERT INTO MARKERS (marker_id, name, file_path_one, file_path_two, file_path_three, inserted_on)
        VALUES ("${id}", "${data.name}", "${data.filepathOne}","${data.filepathTwo}","${data.filepathThree}", "${data.insertedOn}")`);
        await connection.query(`INSERT INTO EVENTS (marker_id)
        VALUES ("${id}")`);
        connection.end();
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
        SET file_path_one = ${data.filepathOne}`);
        connection.end();
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
        connection.end();
        return returnData;
    }
    catch(exception: unknown) {
        console.log(exception);
    }
}

export async function getModelsByEvent(eventID: string) {
    try{
        const connection = await pool.getConnection();
       const models = await connection.query(`SELECT * FROM MODELS WHERE event_id = ${eventID}`);
       const keys = Object.keys(models);
       const returnData = [];
       for( const key of keys ) {
        if(key === 'meta') {
            break;
        }
            returnData.push( models[key] );
        }
        connection.end();
        return returnData;
    }catch( exception: unknown) {
        console.log(exception);
        return null;
    }
    
}


export async function insertModel(data: modelData) {
    try {
        const connection = await pool.getConnection();
        await connection.query(`INSERT INTO MODELS (model_id, name, file_path,texture_name, inserted_on)
        VALUES (uuid(), "${data.name}", "${data.filepath}", "${data.texture}", "${data.insertedOn}")`);
        connection.end();
        return true;
    } catch( exception: unknown) {
        console.log(exception);
        return false;
    }
}

export async function updateModel(data: modelData) {
    try {
        const connection = await pool.getConnection();
        await connection.query(`UPDATE MODELS 
        SET file_path = "${data.filepath}", 
        name = "${data.name}" 
        WHERE model_id = "${data.modelID}"`);
        connection.end();
        return true;
    } catch( exception: unknown) {
        console.log(exception);
    }
}

export async function deleteModel( modelID: string) {
    try {
        const connection = await pool.getConnection();
        await connection.query(`DELETE FROM MODELS WHERE model_id = "${modelID}"`);
        connection.end();
        return true;
    } catch( exception: unknown) {
        console.log(exception);
    }
}

export async function deleteMarker( markerID: string) {
    try {
        const connection = await pool.getConnection();
        await connection.query(`DELETE FROM MARKERS WHERE marker_id = "${markerID}"`);
        connection.end();
        return true;
    } catch( exception: unknown) {
        console.log(exception);
    }
}