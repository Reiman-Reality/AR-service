import Koa from 'koa';
import Router from 'koa-router';
import { appendFile } from 'node:fs';
import process from 'node:process';

const server = new Koa();
const router = new Router();
const port = process.env.PORT ?? 8080;
console.log(port);

router.get('/hi', async (ctx) =>{
    ctx.body = "hello";
});

server.use(router.routes());

server.listen(port);