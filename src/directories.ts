import * as fs from "node:fs/promises";
import path from "node:path";

export async function directoryCheck() {
    await initMarkerDirectory();
    await initModelDirectory();
    await initTextureDirectory();
    await initUploadsDirectory();
}

async function initMarkerDirectory() {
    try{
        await fs.access(path.join( process.cwd(), "/markers"));
    } catch(err: unknown) {
        const markerPath = path.join( process.cwd() , "markers");
        await fs.mkdir(markerPath);
    }
}

async function initModelDirectory() {
    try{
        await fs.access(path.join( process.cwd(), "/models"));
    } catch(err: unknown) {
        const modelPath = path.join( process.cwd() , "models");
        await fs.mkdir(modelPath);
    }
}

async function initTextureDirectory() {
    try{
        await fs.access(path.join( process.cwd(), "/textures"));
    } catch(err: unknown) {
        const texturePath = path.join( process.cwd() , "textures");
        await fs.mkdir(texturePath);
    }
}

async function initUploadsDirectory() {
    try{
        await fs.access(path.join( process.cwd(), "/public/uploads"));
    } catch(err: unknown) {
        const publicPath = path.join( process.cwd() , "/public/");
        await fs.mkdir(publicPath);
        const uploadsPath = path.join(process.cwd(), "/public/uploads");
        await fs.mkdir(uploadsPath);
    }
}