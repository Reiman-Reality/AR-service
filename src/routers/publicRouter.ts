import Router from 'koa-router';
import fs from "node:fs"
import fsPromise from "node:fs/promises";
import koaBody from 'koa-body';
import path from 'path';
import serve from 'koa-static';
import {getModelAndMarkerNames} from '../db/mariadb.js';

const __dirname = process.cwd();

const publicRouter = new Router();

publicRouter.get('/home', async (ctx) =>{
	ctx.type = 'html';
	ctx.body = fs.createReadStream(path.join(__dirname,'/FrontEnd/LandingPage.html'));
});

publicRouter.get('/filenames', async (ctx) => {
	const data = await getModelAndMarkerNames();
	const cleanedData = [];
	for(const event of data) {
		console.log(event);
		const names = {
			markerName: path.basename(event.file_path_one),
			modelFile: path.basename(event.file_path || '')
		}
		cleanedData.push(names);
	}
	ctx.type = 'json';
	ctx.body = cleanedData;
});

export {publicRouter};