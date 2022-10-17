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
import { eventData, markerData, modelData } from '../types/dbTypes/databaseTypes';

const adminRouter = new Router();
// Have to do this since with TS and ES 2022 you don't get the __dirname variable :(
const __dirname = path.dirname(process.cwd())+'/server';
console.log(__dirname);
//All new routes that parse data will need to have body in their .post() declaration as a middleware arg
const body = koaBody({
    multipart: true,
    formidable: {
        uploadDir: path.join(__dirname + '/public/uploads'),
    }
 });

 adminRouter.post('/api/addEvent',body, async(ctx) =>{
	//TODO Verification
	const cleanedData = verifyEventData(ctx.request.body );
	if(!cleanedData) {
		ctx.status = 400;
		ctx.body = {'message': "failed to verify event data please try again later"}
	}
	const id = await database.addEvent(cleanedData);
	console.log(id);
	if(!id) {
		ctx.status = 500;
		ctx.body = {"message" : "there was a error inserting this event into our database please try again later"};
		return;
	}

	ctx.status = 200;
 });

/**
 * Note for incoming requests to this endpoitn tehy must be encoded as 'multipart/form-data' otherwise request.files doesn't work.
 */
 adminRouter.post('/api/addMarker', body, async (ctx)=>{
	//TODO verification
    const marker = ctx.request.files.marker;
	const newMarkerPath =  path.join(__dirname, '/static/markers/', marker.originalFilename);
    try{
    	await fsPromise.rename(marker.filepath, newMarkerPath);
    } catch (err:unknown) {
		console.log(err);
		fs.unlink(marker.filepath, (err) => console.log(err));
		ctx.status(500);
		ctx.body('failed to upload marker please try again');
		return;
    }
	const cleanedData = verifyMarkerData(ctx.request.body, newMarkerPath);
	if(!cleanedData) {
		ctx.status=400;
		ctx.body = {message:"Failed to verify all form data please make sure all data is filled out and try again"};
		return;
	}
	if( ! await database.insertMarker(cleanedData) ){
		ctx.status = 500;
		ctx.body = {message:"something went wrong on our end please try again later"};
		return;
	}

    ctx.status = 200;
});

adminRouter.get("/api/getMarkers", async (ctx) =>{
	//TODO Verification
	const markers = await database.getAllMarkers();
	if( !markers ){
		ctx.status=400;
		ctx.body({'message': "Server error please try again later"});
		return;
	}
	markers.forEach( (marker)=>{
		marker.models = database.getModelsByMarkerID(marker.marker_id);
	})
	ctx.status=200;
	ctx.body = markers;
});

/**
 * Same as above for this endpoint all data must be submitted as formdata :)
 */
adminRouter.post('/api/addmodel', body, async (ctx)=>{
    //TODO verification
    const model = ctx.request.files.model; // get the model;
	const newModelPath =  path.join(__dirname, '/static/models/', model.originalFilename);
	
    try{
    	await fsPromise.rename(model.filepath, newModelPath);
    } catch (err:unknown) {
		console.log(err);
		fs.unlink(model.filepath, (err) => console.log(err));
		ctx.status(500);
		ctx.body('failed to upload marker please try again');
		return;
    }
	const cleanedData = verifyModelData(ctx.request.body, newModelPath);
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

adminRouter.post('/api/updatemodel', body, async (ctx)=>{

	const model = ctx.request.files.model_file_path;
	const newModelPath =  path.join(__dirname, '/static/models/', model.originalFilename);
    
	const cleanedData = verifyEDITModelData(ctx.request.body, newModelPath);
	
	
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
 * Same as above for this endpoint all data must be submitted as formdata :)
 */
adminRouter.post('/api/addmodel', body, async (ctx)=>{
    //TODO verification
    const model = ctx.request.files.model; // get the model;
	const newModelPath =  path.join(__dirname, '/static/models/', model.originalFilename);
	
    try{
    	await fsPromise.rename(model.filepath, newModelPath);
    } catch (err:unknown) {
		console.log(err);
		fs.unlink(model.filepath, (err) => console.log(err));
		ctx.status(500);
		ctx.body('failed to upload marker please try again');
		return;
    }
	const cleanedData = verifyModelData(ctx.request.body, newModelPath);
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

adminRouter.get('/login', body, async (ctx) => {
	if(verifyLogin(ctx.cookies.get('log'))){
		ctx.type = 'html';
		ctx.body = fs.createReadStream(path.join(__dirname,'static/admin/HTML/loginPage.html'));
		return;
	}
	ctx.redirect('/home');
});

adminRouter.get('/api/getModels', async (ctx) => {
		ctx.body = await database.getAllModels();
});

adminRouter.post('/api/getmodelsbymarker', body, async (ctx) => {
	//TODO Verification
	const markers = await database.getModelsByMarkerID(ctx.request.body.marker_id);
	if( !markers ){
		ctx.status=400;
		ctx.body = {'message': "Server error please try again later"};
		return;
	}
	ctx.status=200;
	ctx.body = markers;
});

adminRouter.get( '/models', async(ctx)=>{
	try{
		ctx.type = 'html';
		ctx.body=fs.createReadStream(path.join(__dirname,'static/admin/HTML/modelPage.html'));
	} catch(err: unknown) {
		console.log(err)
	}
})

adminRouter.get('/home',body,async (ctx) =>{

});

//TODO
function verifyLogin(cookie : string):boolean {
	return true;
}

function verifyMarkerData( formData:any, newFilePath:string ){
	if( !formData.name || formData.name.length > 50 ) {
		return null;
	}
	return {
		insertedOn: dateFormat( new Date(), "yyyy-mm-dd h:MM:ss"),
		name: formData.name,
		markerID: null,
		filepath: newFilePath,
	} as markerData;
}

function verifyEventData( data:any ) {
	if( !data.name || data.name.length > 50 || data.marker_id == null || data.model_id == null) {
		return null;
	}

	return {
		insertedOn: dateFormat( new Date(), "yyyy-mm-dd h:MM:ss"),
		eventName: data.name,
		marker_id: data.marker_id,
		model_id: data.model_id
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
	

function verifyModelData( formModel:any, newFilePath:string ){
	
	if( !formModel.name || formModel.name.length > 50 ) {
		return null;
	}
	
	return {
		insertedOn: dateFormat( new Date(), "yyyy-mm-dd h:MM:ss"),
		name: formModel.name,
		modelID: null,
		filepath: newFilePath,
	} as modelData;
}

export {adminRouter};