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
    const request = ctx.request.files;
    console.log(request);
    await fs.rename(request.marker.filepath, __dirname + '/public/uploads/' + request.marker.originalFilename, (err)=>{
        if(err){
            ctx.status(500);
            ctx.body("failed to uplaod file");
        }
    });
    ctx.status = 200;
});

/**
 * Same as above for this endpoint all data must be submitted as formdata :)
 */
router.post('/admin/api/addmodel', async (ctx)=>{

});

server.use(router.routes());

server.use(serve('/static/user'));

server.use(serve('/static/markers'));

server.listen(port);