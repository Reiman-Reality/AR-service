import Router from 'koa-router';
import fs from "node:fs";
import koaBody from 'koa-body';
import path from 'path';
import { fileURLToPath } from 'url';

const adminRouter = new Router();
const __dirname = path.dirname(process.cwd());
console.log(__dirname);
const body = koaBody({
    multipart: true,
    formidable: {
        uploadDir: path.join(__dirname + '/server/public/uploads'),
    }
 });

/**
 * Note for incoming requests to this endpoitn tehy must be encoded as 'multipart/form-data' otherwise request.files doesn't work.
 */
 adminRouter.post('/api/addmarker', body, async (ctx)=>{
    const marker = ctx.request.files.marker;
    try{
    	await fs.rename(marker.filepath, path.join(__dirname, '/server/static/markers/', marker.originalFilename), (err) => {
        	if (err) throw err;
       		console.log('Rename complete!');
   		});
    } catch (err:unknown) {
		console.log(err);
		ctx.status(500);
		ctx.body('failed to upload marker please try again');
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
		ctx.status(500);
		ctx.body('failed ot upload marker please try again');
		return;
    }
    ctx.status = 200;
});

export {adminRouter};