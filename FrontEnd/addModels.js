document.addEventListener("DOMContentLoaded", ()=>{
    addModelFunction();
})

let modelsPresent = false;

function beforeEntity(markerUrl) {
    const nft = document.createElement("a-nft");
    return `<a-nft type=\"nft\" url=\"./${markerUrl}\" smooth=\"true\" smoothCount=\"10\" smoothTolerance=\".01\" smoothThreshold=\"5\">`
}

function objEntity(objName, scale, xP, yP, zP, xR, yR, zR) {
    return `<a-entity
    obj-model="obj: url(/${objName}.obj); mtl: url(/${objName}.mtl)"
    scale="${scale} ${scale} ${scale}"
    position="${xP} ${yP} ${zP}"
    orientation="${xR} ${xR} ${xR}"
    ></a-entity>`
}

function afterEntity() {
    return "</a-nft>"
}

function addCamera() {
    return "<a-entity camera></a-entity>";
}

async function addModelFunction() {
    console.log("Attempting to load")
    const body = document.querySelector("#sceneBody");
    let arjsScene = `    <a-scene vr-mode-ui="enabled: false;" renderer="logarithmicDepthBuffer: true;" embedded
    arjs="trackingMethod: best; sourceType: webcam;debugUIEnabled: false;" id="arjsScene">`

    if (modelsPresent) {
        return;
    }
    modelsPresent = true;

    const request = await fetch("./filenames");
    if (!request.ok) {
        console.log("error")
    }
    const data = await request.json();

    for (let i = 0; i < data.length; i++) {
        let obj = data[i];

        let markerUrl = obj["markerName"];
        let modelUrl = obj["modelFile"];
        let scale = obj["scale"];
        let xPos = obj["xPos"];
        let yPos = obj["yPos"];
        let zPos = obj["zPos"];
        let xRot = obj["xRot"];
        let yRot = obj["yRot"];
        let zRot = obj["zRot"];

        markerUrl = markerUrl.split(".")[0]
        modelUrl = modelUrl.split(".")[0]

        arjsScene += ( beforeEntity(markerUrl) + objEntity(modelUrl, scale, xPos, yPos, zPos, xRot, yRot, zRot) + afterEntity());
        console.log("Added: " + markerUrl + " " + modelUrl)
    }

    console.log(arjsScene);

    arjsScene += addCamera();
    arjsScene += '</a-scene>';
    body.innerHTML += arjsScene;
    // console.log("added camera")
}