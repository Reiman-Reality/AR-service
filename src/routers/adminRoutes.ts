import Router from 'koa-router';
import fs from "node:fs";
import fsPromise from "node:fs/promises";
import koaBody from 'koa-body';
import dateFormat from 'dateformat';
import path from 'path';
import * as database from "../db/mariadb.js"
import serve from 'koa-static';
import { fileURLToPath } from 'url';
import { parseIsolatedEntityName } from 'typescript';
import { eventData, login, markerData, modelData } from '../types/databaseTypes';
import {v4} from 'uuid'
import * as nodeCrypto from "node:crypto"


const crypto = nodeCrypto.webcrypto;


const loggedInUsers = {};

const adminRouter = new Router();
// Have to do this since with TS and ES 2022 you don't get the __dirname variable :(
const __dirname = process.cwd();
console.log(__dirname);
//All new routes that parse data will need to have body in their .post() declaration as a middleware arg
const body = koaBody({
    multipart: true,
    formidable: {
        uploadDir: path.join(__dirname + '/public/uploads'),
    }
 });

 /**
  * Creates a new event for the code.
  */
 adminRouter.post('/api/addEvent',body, async(ctx) =>{
	if( ! verifyLogin(ctx.cookies.get('log'))){
		ctx.status= 500;
		return;
	}
	const cleanedData = verifyEventData(ctx.request.body );
	if(!cleanedData) {
		ctx.status = 400;
		ctx.body = {'message': "failed to verify event data please try again later"}
		return;
	}
	const id = await database.addEvent(cleanedData);
	if(!id) {
		ctx.status = 500;
		ctx.body = {"message" : "there was a error inserting this event into our database please try again later"};
		return;
	}

	ctx.status = 200;
 });

 /**
  * Lets a admin user change parameters for an event 
  */
 adminRouter.post('/api/editEvent', body, async(ctx)=> {
	if( ! verifyLogin(ctx.cookies.get('log'))){
		ctx.status= 500;
		return;
	}
	const cleanedData = verifyEventEditData( JSON.parse(ctx.request.body) );
	if( !cleanedData ) {
		ctx.status = 500;
		return;
	}

	await database.editEvent(cleanedData);
	ctx.status = 200;
 });

 /**
  * Deletes an event from the database
  */
 adminRouter.post('/api/deleteEvent', body, async(ctx)=>{
	const data = JSON.parse(ctx.request.body);

	if( !data.marker_id || ! data.model_id) {
		ctx.status = 500;
		return;
	}

	await database.deleteEvent( data.marker_id, data.model_id);
	ctx.status = 200;
 })


 // Marker code

/**
 * Note for incoming requests to this endpoitn tehy must be encoded as 'multipart/form-data' otherwise request.files doesn't work.
 */
 adminRouter.post('/api/addMarker', body, async (ctx)=>{
	if( ! verifyLogin(ctx.cookies.get('log'))){
		ctx.status= 500;
		return;
	}
    const marker1 = ctx.request.files.marker1;
	const marker2 = ctx.request.files.marker2;
	const marker3 = ctx.request.files.marker3;
	const newMarkerPath1 =  path.join(__dirname, '/markers/', marker1.originalFilename);
	const newMarkerPath2 =  path.join(__dirname, '/markers/', marker2.originalFilename);
	const newMarkerPath3 =  path.join(__dirname, '/markers/', marker3.originalFilename);
    try{
    	await fsPromise.rename(marker1.filepath, newMarkerPath1);
		await fsPromise.rename(marker2.filepath, newMarkerPath2);
		await fsPromise.rename(marker3.filepath, newMarkerPath3);
    } catch (err:unknown) {
		console.log(err);
		fs.unlink(marker1.filepath, (err) => console.log(err));
		fs.unlink(marker2.filepath, (err) => console.log(err));
		fs.unlink(marker3.filepath, (err) => console.log(err));
		ctx.status = 500;
		ctx.body = 'failed to upload marker please try again';
		return;
    }
	const cleanedData = verifyMarkerData(ctx.request.body,  marker1.originalFilename, marker2.originalFilename, marker3.originalFilename);
	if(!cleanedData) {
		ctx.status=400;
		ctx.body = {message:"Failed to verify all form data please make sure all data is filled out and try again"};
		return;
	}

	const success = await database.insertMarker(cleanedData);

	if( ! success ){
		ctx.status = 500;
		ctx.body = {message:"something went wrong on our end please try again later"};
		return;
	}

	if( ctx.request.body.modelID ) {
		await database.addEvent({marker_id: success, model_id: ctx.request.body.modelID, x_pos: 0, y_pos: 0, z_pos: 0, scale: 1, tag: ctx.request.body.tag} as eventData);
	}

    ctx.status = 200;
});

/**
 * Gets all markers stored in the database and attaches the events they are linked with and the models they are linked with by the join table.
 */
adminRouter.get("/api/getMarkers", async (ctx) =>{
	if( ! await verifyLogin(ctx.cookies.get('log'))){
		ctx.status= 500;
		return;
	}

	const markers = await database.getAllMarkers();
	if( !markers ){
		ctx.status=400;
		ctx.body({'message': "Server error please try again later"});
		return;
	}
	for( const marker of markers) {
		marker.models = await database.getModelsByMarkerID(marker.marker_id);
		marker.eventData = await database.getEventByMarkerID( marker.marker_id );
	}
	ctx.status=200;
	ctx.body = markers;
});

/**
 * Lets a user update a marker with a new event.
 */
adminRouter.post('/api/updateMarker', body, async (ctx)=>{
	const request = ctx.request.body;
	if( request.modelID && request.modelID != 'null' ) {
		await database.addEvent({marker_id: request.markerID, model_id: request.modelID, x_pos: 0, y_pos: 0, z_pos: 0, scale: 1, tag: request.tag} as eventData);
	}

	ctx.status = 200;

});

/**
 * Deletes a marker from the database and removes it's files from the server.
 */
adminRouter.post("/api/deleteMarker", body, async (ctx) => {
	if( ! await verifyLogin(ctx.cookies.get('log'))){
		ctx.status= 500;
		return;
	}

	const ID = ctx.request.body.markerID;
	if( ! ID ) {
		ctx.status = 400;
	}
	//Delete all DB events with this marker as a member
	await database.deleteEventByMarkerID( ID );
	const files = await database.deleteMarker( ID );
	for( const filename in files) {
		try{
			await fsPromise.rm( __dirname + "/markers/" + filename );
		} catch( e: unknown) {
			console.log(e);
		}
	}
	ctx.status = 200;
});


//Map Code

/**
 * A route for showing the upload new map page.
 */
adminRouter.get('/map', body, async (ctx) => {
	if(verifyLogin(ctx.cookies.get('log'))){
		ctx.type = 'html';
		ctx.body = fs.createReadStream(path.join(__dirname,'static/admin/HTML/addMap.html'));
		return;
	}
	ctx.redirect('./login');
});

/**
 * A route for returning the current map to the front end
 */
adminRouter.get('/getMap', body, async (ctx) => {
	if(verifyLogin(ctx.cookies.get('log'))){
		ctx.type = 'jpg';
		ctx.body = fs.createReadStream(path.join(__dirname,'map.jpg'));
		return;
	}
});

/**
 * Api route for uploading a new map. We try to enforce the map is a jpg for easy storage.
 */
adminRouter.post('/api/addMap', body, async (ctx)=>{
	if( ! verifyLogin(ctx.cookies.get('log') ) ) {
		ctx.status = 400;
		return;
	}

    const map = ctx.request.files.map; // get the map;
	const newMapName =  path.join(__dirname, '/', "map.jpg");
	try{
	await fsPromise.unlink(newMapName);
	}
	catch{

	}
	
    try{
    	await fsPromise.rename(map.filepath, newMapName);
    } catch (err:unknown) {
		console.log(err);
		fs.unlink(map.filepath, (err) => console.log(err));
		ctx.status =500;
		ctx.body('failed to upload marker please try again');
		return;
    }
    ctx.status = 200;
});


//Model code
/**
 * All data to this endpoint must be submitted as multipart/formdata just because how our body parser works.
 * This route handles uploading a new 3d model to the database/server.
 */
adminRouter.post('/api/addmodel', body, async (ctx)=>{
	if( ! await verifyLogin(ctx.cookies.get('log'))){
		ctx.status= 500;
		return;
	}

    const model = ctx.request.files.model; // get the model;
	const texture = ctx.request.files?.texture; // get the texture
	// models do not have their original file names like markers so we give them their original name and put them in our models folder.
	const newModelPath =  path.join(__dirname, '/models/', model.originalFilename);
	const newTexturePath =  path.join(__dirname, '/textures/', texture.originalFilename);
	
    try{
    	await fsPromise.rename(model.filepath, newModelPath);
		await fsPromise.rename(texture.filepath, newTexturePath);
    } catch (err:unknown) {
		console.log(err);
		fs.unlink(model.filepath, (err) => console.log(err));
		ctx.status(500);
		ctx.body('failed to upload marker please try again');
		return;
    }
	const cleanedData = verifyModelData(ctx.request.body, model.originalFilename, texture.originalFilename);
	if(!cleanedData) {
		ctx.status=400;
		ctx.body = {message:"Failed to verify all form data please make sure all data is filled out and try again"};
		return;
	}
	if( ! await database.insertModel(cleanedData) ){
		ctx.status = 500;
		ctx.body = {message:"something went wrong on our end please try again later"};
		return;
	}
    ctx.status = 200;
});

/**
 * allows an admin to update a model with new files.
 */
adminRouter.post('/api/updatemodel', body, async (ctx)=>{
	if( ! await verifyLogin(ctx.cookies.get('log'))){
		ctx.status= 500;
		return;
	}

	const model = ctx.request.files.model_file_path;
	const newModelPath =  path.join(__dirname, '/static/models/', model.originalFilename);
    
	const cleanedData = verifyEDITModelData(ctx.request.body, model.originalFilename);
	
	
	if(!cleanedData) {
		ctx.status=400;
		ctx.body = {message:"Failed to verify all form data please make sure all data is filled out and try again"};
		return;
	}
	if( ! await database.updateModel(cleanedData) ){
		ctx.status = 500;
		ctx.body = {message:"something went wrong on our end please try again later"};
		return;
	}

    ctx.status = 200;
});

/**
 * This route returns the login page so users can login
 */
adminRouter.get('/login', body, async (ctx) => {
	if( ! await verifyLogin(ctx.cookies.get('log'))){
		ctx.type = 'html';
		ctx.body = fs.createReadStream(path.join(__dirname,'static/admin/HTML/loginPage.html'));
		return;
	}
	ctx.redirect('/admin/home');
});

/**
 * This is an api route for verifying that the username and password provided is correct. If so then we create a UUID for the user with createCookie function and 
 * set the cookie to the uuid value so we don't expose anything. Also sets a role cookie so that if they are a role they can see certain ui elements.
 */
adminRouter.post('/getAccount', body, async (ctx) => {
		const hashedAccount = await verifyAccount(ctx.request.body); // Hash password
		const verify = await database.getAccountByUsername(hashedAccount.username, hashedAccount.password);
		if(verify.length >= 1){
			ctx.status = 200;
			ctx.cookies.set("log", createCookie(verify[0]), {httpOnly: false});
			ctx.cookies.set("perms", verify[0].role, {httpOnly: false});
		}
		else{
			ctx.status = 401;
		}
});

/**
 * Allows a super user to view the add user page. Has extra verification for who can actually get to the endpoint.
 */
adminRouter.get('/addUser', body, async (ctx) => {
	const user = await verifyLogin(ctx.cookies.get('log'));
	if( ! user || user.role != 'ADMIN' ){
		ctx.status= 500;
		return;
	}
	ctx.type = 'html';
	ctx.body = fs.createReadStream(path.join(__dirname,'static/admin/HTML/addingUser.html'));
	return;
	//ctx.redirect('/home');
});

/**
 * Allows a super user to add new users who can edit models/markers/ and the map.
 */
adminRouter.post('/createUser', body, async (ctx)=>{
	const user = verifyLogin( ctx.cookies.get('log') );
	if( !user || user.role != "ADMIN" ) {
		ctx.status = 400;
		ctx.body = "Failed to verify you account access please try again"
		return;
	}

	const cleanedData = await verifyAccount(ctx.request.body); // Hash password and make sure data is well-formed
	if(!cleanedData) {
		ctx.status=400;
		ctx.body = {message:"Failed to verify all form data please make sure all data is filled out and try again"};
		return;
	}
	if( ! await database.addUser(cleanedData) ){
		ctx.status = 500;
		ctx.body = {message:"something went wrong on our end please try again later"};
		return;
	}
    ctx.status = 200;
});

//Getters for admin pages
adminRouter.get('/api/getModels', async (ctx) => {
	if( ! verifyLogin(ctx.cookies.get('log'))){
		ctx.status= 500;
		return;
	}

	ctx.body = await database.getAllModels();
});

/**
 * api route for deleting a model from the database and removing the files off the server.
 */
adminRouter.post('/api/deleteModel', body, async (ctx) => {
	const ID = ctx.request.body.modelID;
	if( ! ID ) {
		ctx.status = 400;
	}
	//Delete all DB events with this model as a member
	await database.deleteEventByModelID( ID );
	const files = await database.deleteModel( ID );
	for( const file in files ) {
		try{
			if( file.split(".")[1] === "mtl" ) {
				await fsPromise.rm(__dirname + "/textures/" + file);
			}
		}catch( e: unknown) {
			console.log(e);
			ctx.status = 500;
		}
	}
	ctx.status = 200;
});

/**
 * Returns all models paired with a marker.
 */
adminRouter.post('/api/getmodelsbymarker', body, async (ctx) => {
	if( ! verifyLogin(ctx.cookies.get('log'))){
		ctx.status= 500;
		return;
	}

	const markers = await database.getModelsByMarkerID(ctx.request.body.marker_id);
	if( !markers ){
		ctx.status=400;
		ctx.body = {'message': "Server error please try again later"};
		return;
	}
	ctx.status=200;
	ctx.body = markers;
});

/**
 * Logs a user out of the session and deletes their UUID from logged in users object.
 */
adminRouter.get("/api/logout",(ctx)=>{
	delete loggedInUsers[ctx.cookies.get('log')];
	ctx.status = 200;
});


// Routes for serving admin page pages
adminRouter.get('/home',body,async (ctx) =>{
	if( ! await verifyLogin(ctx.cookies.get('log'))){
		ctx.redirect('/admin/login');
		return;
	}

	try{
		ctx.type = 'html';
		ctx.body=fs.createReadStream(path.join(__dirname,'static/admin/HTML/adminPage.html'));
	} catch(err: unknown) {
		console.log(err)
	}
});

/**
 * Serves the front end for the markers page.
 */
adminRouter.get('/markersPage', async(ctx)=>{
	if( ! await verifyLogin(ctx.cookies.get('log'))){
		ctx.redirect('/admin/login');
		return;
	}

	try{
		ctx.type = 'html';
		ctx.body=fs.createReadStream(path.join(__dirname,'static/admin/HTML/nftObjects.html'));
	} catch(err: unknown) {
		console.log(err)
	}
});

/**
 * Serves the front end for the models page.
 */
adminRouter.get('/modelsPage', async(ctx)=>{
	if( ! await verifyLogin(ctx.cookies.get('log'))){
		ctx.redirect('/admin/login');
		return;
	}
	try{
		ctx.type = 'html';
		ctx.body=fs.createReadStream(path.join(__dirname,'static/admin/HTML/arModels.html'));
	} catch(err: unknown) {
		console.log(err)
	}
});

/**
 * Serves the scripts we have for the marker page.
 */
adminRouter.get('/markerScripts', async(ctx)=>{
	try{
		ctx.type = 'text/javascript';
		ctx.body=fs.createReadStream(path.join(__dirname,'/dist/static/admin/js/nftObjects.js'));
	} catch(err: unknown) {
		console.log(err)
	}
});

/**
 * Serves the scripts for the overall admin page since the other pages are encapsulated by it with iframes.
 */
adminRouter.get('/adminPageScripts', async(ctx)=>{
	try{
		ctx.type = 'text/javascript';
		ctx.body=fs.createReadStream(path.join(__dirname,'/dist/static/admin/js/adminPage.js'));
	} catch(err: unknown) {
		console.log(err)
	}
});

/**
 * Serves the scripts for the model front end page.
 */
adminRouter.get('/modelScripts', async(ctx)=>{
	try{
		ctx.type = 'text/javascript';
		ctx.body=fs.createReadStream(path.join(__dirname,'/dist/static/admin/js/arModels.js'));
	} catch(err: unknown) {
		console.log(err)
	}
});

/**
 * 
 * @param cookie a string which value is a uuid to check if it's in the loggedInUsers object
 * @returns if there is a logged in users returns that users information, else null
 */
function verifyLogin(cookie : string){
	return loggedInUsers[cookie];
}


/**
 * Helps verify that we have all the data we need to cretea a marker.
 * @param formData the data we were passed from the request
 * @param name the first file name
 * @param two the second file name
 * @param three the third file name
 * @returns markerData JSON object
 */
function verifyMarkerData( formData:any, name:string, two: string, three: string ){
	if( !formData.name || formData.name.length > 50 ) {
		return null;
	}
	return {
		insertedOn: dateFormat( new Date(), "yyyy-mm-dd h:MM:ss"),
		name: formData.name,
		markerID: null,
		filepathOne: name,
		filepathTwo: two,
		filepathThree: three,
	} as markerData;
}

/**
 * Helps verify we have all the data to make an event.
 * @param data 
 * @returns JSON object that contains all the important eventData
 */
function verifyEventData( data:any ) {
	if( !data.name || data.name.length > 50 || data.marker_id == null || data.model_id == null) {
		return null;
	}

	return {
		insertedOn: dateFormat( new Date(), "yyyy-mm-dd h:MM:ss"),
		marker_id: data.marker_id,
		model_id: data.model_id,
		x_pos:data.x_pos ?? 0,
		y_pos:data.y_pos ?? 0,
		z_pos:data.z_pos ?? 0,
		scale: data.scale ?? 1,
		tag: data.tag ?? "",
	} as eventData;

}

function verifyEDITModelData( formModel:any, newFilePath:string ){
	
	if( !formModel.edit_name || formModel.edit_name.length > 50 ) {
		return null;
	}

		return{
			insertedOn: dateFormat( new Date(), "yyyy-mm-dd h:MM:ss"),
			name: formModel.edit_name,
			modelID: formModel.edit_model_id,
			filepath: newFilePath
		} as modelData
	
}

/**
 * Checks if a user exists in the database. for login.
 * @param account the username password combination as a JSON object
 * @returns if user login Object else NULL
 */
async function verifyAccount( account:any ){
	if( !account.username|| !account.password ) {
		return null;
	}

	// https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
	const passwordBuffer = new TextEncoder().encode(account.password);
	const hashBuffer = await crypto.subtle.digest("SHA-384", passwordBuffer); // 384 chosen due to strength against length extension attack + slightly better collision resistance compared with 256
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');


	return{
		username:account.username,
		password:hashHex,
		role: account.role
	} as login
	
}

/**
 * creates a cookie if someone is logging in and verified. Puts them into the loggedInUsers JSON object.
 * @param user login JSON object
 * @returns a uuid v4 that will be deleted in one hour so a user isn't logged in forever.
 */
function createCookie( user ) {
	const loggedIn = v4();
	loggedInUsers[loggedIn] = user;
	setTimeout(  ()=>{
		delete loggedInUsers[loggedIn];
	}, 3600000)
	return loggedIn;
}
	
/**
 * verifies that proper information exists to create a new model.
 * @param formModel the extra information passed with a model like it's name
 * @param newFilePath the obj file name
 * @param textureName the mtl texture name
 * @returns 
 */
function verifyModelData( formModel:any, newFilePath:string, textureName: string){
	
	if( !formModel.name || formModel.name.length > 50 ) {
		return null;
	}
	
	return {
		insertedOn: dateFormat( new Date(), "yyyy-mm-dd h:MM:ss"),
		name: formModel.name,
		modelID: null,
		filepath: newFilePath,
		texture: textureName
	} as modelData;
}

/**
 * Verifies that proper data is present to edit an event.
 * @param data Event data
 * @returns a JSON object with the data.
 */
function verifyEventEditData( data: any) {
	if( !data.marker_id || ! data.model_id) {
		return null;
	}

	return {
		marker_id: data.marker_id,
		model_id: data.model_id,
		field: data.field,
		value: data.value,
	}
}
export {adminRouter};
