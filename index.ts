import Koa from 'koa';
import path from 'path';
import Router from 'koa-router';
import serve from 'koa-static';
import * as dotenv from 'dotenv';
import { adminRouter } from './src/routers/adminRoutes.js';
import process from 'node:process';
import {publicRouter } from './src/routers/publicRouter.js';
import cors from '@koa/cors'

const __dirname = process.cwd();
dotenv.config();
const server = new Koa();
const router = new Router();
const port = process.env.PORT ?? 8080;

function getServerRoutes(adminRouter, router) {
    router.use('/admin', adminRouter.routes(), adminRouter.allowedMethods());
    router.use( publicRouter.routes(), publicRouter.allowedMethods());
    return router.routes();
}

server.use(getServerRoutes(adminRouter, router));

server.use(serve('./static/user'));

server.use(serve('./static/markers'));

server.use(serve(__dirname + '/static/user'));

server.use(serve(__dirname + '/FrontEnd/'));

server.use(serve(__dirname + '/FrontEnd/Images'));

server.use(serve(__dirname + '/textures'));
server.use(serve(__dirname + '/models'));
server.use(serve(__dirname + '/markers'));

server.use(serve(__dirname + '/static/markers'));

server.use(cors());

server.listen(port);