import Koa from 'koa';
import path from 'path';
import Router from 'koa-router';
import koaBody from 'koa-body';
import serve from 'koa-static';
import { appendFile } from 'node:fs';
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

router.post('/admin/api/addmarker', async (ctx)=>{
    const request = ctx.request.files;
    console.log(request);
    ctx.status = 200;
});

router.post('/admin/api/addmodel', async (ctx)=>{

});

server.use(router.routes());

server.use(serve('/static/user'));

server.use(serve('/static/markers'));

server.listen(port);