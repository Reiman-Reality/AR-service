import Koa from 'koa';
import path from 'path';
import Router from 'koa-router';
import serve from 'koa-static';
import * as dotenv from 'dotenv';
import { adminRouter } from './src/routers/adminRoutes.js';
import { connectDatabase, getAllMarkers, insertMarker, ping, getAllModels, insertModel, updateModel,deleteModel } from './src/db/mariadb.js';



dotenv.config();
const server = new Koa();
const router = new Router();
const port = process.env.PORT ?? 8080;

await connectDatabase();

await ping();

console.log( await getAllMarkers() );





router.get('/home', async (ctx) =>{
});


function getServerRoutes(adminRouter, router) {
    router.use('/admin', adminRouter.routes(), adminRouter.allowedMethods());

    return router.routes();
}

server.use(getServerRoutes(adminRouter, router));

server.use(serve('/static/user'));

server.use(serve('/static/markers'));

server.listen(port);