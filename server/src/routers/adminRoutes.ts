import Router from 'koa-router';
import fs from "node:fs";
import koaBody from 'koa-body';
import path from 'path';
import serve from 'koa-static';
import { fileURLToPath } from 'url';
import { parseIsolatedEntityName } from 'typescript';

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

adminRouter.get('/login', body, async (ctx) => {
	if(verifyLogin(ctx.cookies.get('log'))){
		ctx.type = 'html';
		ctx.body = fs.createReadStream(path.join(__dirname,'static/admin/HTML/loginPage.html'));
		return;
	}
	ctx.redirect('/home');
});

adminRouter.get('/api/getModels', (ctx) => {

});

adminRouter.get('/home',body,async (ctx) =>{

});

//TODO
function verifyLogin(cookie : string):boolean {
	return true;
}

export {adminRouter};