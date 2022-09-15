import Koa from 'koa';
import path from 'path';
import Router from 'koa-router';
import koaBody from 'koa-body';
import serve from 'koa-static';
import fs from 'node:fs';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();
const server = new Koa();
const router = new Router();
const port = process.env.PORT ?? 8080;
const __dirname = path.dirname('');

server.use(koaBody({
    multipart: true,
    formidable: {
        uploadDir: path.join(__dirname + '/public/uploads'),
    }
 }));

router.get('/home', async (ctx) =>{
});

/**
 * Note for incoming requests to this endpoitn tehy must be encoded as 'multipart/form-data' otherwise request.files doesn't work.
 */
router.post('/admin/api/addmarker', async (ctx)=>{
    const marker = ctx.request.files.marker;
    try{
    	await fs.rename(marker.filepath, __dirname + '/static/models/' + marker.originalFilename, (err) => {
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
router.post('/admin/api/addmodel', async (ctx)=>{
    const model = ctx.request.files?.model;
    console.log(model);
    try{
    	await fs.rename(model.filepath, __dirname + '/static/models/' + model.originalFilename, (err) => {
        	if (err) throw err;
       		console.log('Rename complete!');
   		});
    } catch (err:unknown) {
		console.log(err);
		ctx.status(500);
		ctx.body('failed ot upload marker please try again');
		return;
    }
    ctx.status = 200;
});

server.use(router.routes());

server.use(serve('/static/user'));

server.use(serve('/static/markers'));

server.listen(port);