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

publicRouter.get('/map', async (ctx)=>{
	ctx.type = 'html';
	ctx.body = fs.createReadStream(path.join(__dirname, '/FrontEnd/Map.html'))
});

publicRouter.get('/about', async (ctx) =>{
	ctx.type = 'html';
	ctx.body = fs.createReadStream(path.join(__dirname, '/FrontEnd/About.html'))
})

publicRouter.get('/filenames', async (ctx) => {
	const data = await getModelAndMarkerNames();
	const cleanedData = [];
	for(const event of data) {
		const names = {
			markerName: path.basename(event.file_path_one),
			modelFile: path.basename(event.file_path || ''),
			scale: event.scale,
			xRot: event.x_rot,
			yRot: event.y_rot,
			zRot: event.z_rot,
			xPos: event.x_pos,
			yPos: event.y_pos,
			zPost: event.z_pos
		}
		cleanedData.push(names);
	}
	ctx.type = 'json';
	ctx.body = cleanedData;
});

publicRouter.get('/mapImage', async (ctx) => {
	ctx.type = 'jpg';
	ctx.body = fs.createReadStream(path.join(__dirname,'map.jpg'));
	return;

});

export {publicRouter};