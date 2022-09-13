import Koa from 'koa';
import Router from 'koa-router';
import serve from 'koa-static';
import * as dotenv from 'dotenv';
dotenv.config();
const server = new Koa();
const router = new Router();
const port = process.env.PORT ?? 8080;
console.log(port);
router.get('/home', async (ctx) => {
});
router.get('(.*)', async (ctx) => {
    ctx.redirect('/home');
});
server.use(router.routes());
server.use(serve('/static/models'));
server.use(serve('/static/markers'));
server.listen(port);
