import Router from 'koa-router';
import fs from "node:fs"
import fsPromise from "node:fs/promises";
import koaBody from 'koa-body';
import path from 'path';
import serve from 'koa-static';

const __dirname = process.cwd();

const publicRouter = new Router();

publicRouter.get('/home', async (ctx) =>{
	ctx.type = 'html';
	ctx.body = fs.createReadStream(path.join(__dirname,'FrontEnd/LandingPage.html'));
});

export {publicRouter};