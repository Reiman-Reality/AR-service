import Router from 'koa-router';
import fs from "node:fs";
import koaBody from 'koa-body';
import dateFormat from 'dateformat';
import path from 'path';
import * as database from "../db/mariadb.js"
import serve from 'koa-static';
import { fileURLToPath } from 'url';
import { parseIsolatedEntityName } from 'typescript';
import { markerData } from '../types/dbTypes/databaseTypes';

const adminRouter = new Router();
// Have to do this since with TS and ES 2022 you don't get the __dirname variable :(
const __dirname = path.dirname(process.cwd())+'/server';
console.log(__dirname);
const body = koaBody({
    multipart: true,
    formidable: {
        uploadDir: path.join(__dirname + '/public/uploads'),
    }
 });

/**
 * Note for incoming requests to this endpoitn tehy must be encoded as 'multipart/form-data' otherwise request.files doesn't work.
 */
 adminRouter.post('/api/addmarker', body, async (ctx)=>{
	//TODO verification
    const marker = ctx.request.files.marker;
	const newMarkerPath =  path.join(__dirname, '/static/markers/', marker.originalFilename);
    try{
    	await fs.rename(marker.filepath, newMarkerPath, (err) => {
        	if (err) throw err;
       		console.log('Rename complete!');
   		});
    } catch (err:unknown) {
		console.log(err);
		ctx.status=400;
		ctx.body('failed to upload marker please try again');
		return;
    }
	console.log(ctx.request.body);
	const cleanedData = verifyMarker(ctx.request.body, newMarkerPath);
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

/**
 * Same as above for this endpoint all data must be submitted as formdata :)
 */
adminRouter.post('/api/addmodel', body, async (ctx)=>{
    const model = ctx.request.files?.model;
    console.log(model);
    try{
    	await fs.rename(model.filepath, __dirname + '/static/models/' + model.originalFilename, (err) => {
        	if (err) throw err;
       		console.log('Rename complete!');
   		});
    } catch (err:unknown) {
		console.log(err);
        fs.unlink(model.filepath, (err) => console.log(err));
		ctx.status=400;
		ctx.body('failed ot upload marker please try again');
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
		await database.getAllModels();
});

adminRouter.get('/home',body,async (ctx) =>{

});

//TODO
function verifyLogin(cookie : string):boolean {
	return true;
}

function verifyMarker( formData:any, newFilePath:string ){
	if( !formData.name || formData.name.length > 50 ) {
		return null;
	}
	const cleanedData: markerData = {
		insertedOn: dateFormat( new Date(), "yyyy-mm-dd h:MM:ss"),
		name: formData.name,
		markerID: null,
		filepath: newFilePath,
	}

	return cleanedData;
}

export {adminRouter};