import Koa from 'koa';
import Router from 'koa-router';
import serve from 'koa-static';
import { appendFile } from 'node:fs';
import * as dotenv from 'dotenv';

dotenv.config();
const server = new Koa();
const router = new Router();
const port = process.env.PORT ?? 8080;

router.get('/home', async (ctx) =>{
});

router.get('(.*)', async(ctx) => {
    ctx.redirect('/home');
});

router.post('/admin/api/addmarker', async (ctx)=>{
	
});

router.post('/admin/api/addmodel', async (ctx)=>{

});

server.use(router.routes());

server.use(serve('/static/user'));

server.use(serve('/static/markers'));

server.listen(port);