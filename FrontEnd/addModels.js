let modelsPresent = false;

function beforeEntity(markerUrl) {
    return `<a-nft type=\"nft\" url=\"./${markerUrl}\" smooth=\"true\" smoothCount=\"10\" smoothTolerance=\".01\" smoothThreshold=\"5\">`
}

function objEntity(objName) {
    return `<a-entity obj-model="url(./models/${objName}.obj); mtl: url(./textures/${objName}.mtl)"></a-entity>`
}

function afterEntity() {
    return "</a-nft>"
}

function addCamera() {
    return "<a-entity camera></a-entity>";
}

async function addModelFunction() {
    console.log("Attempting to load")
    let arjsScene = document.getElementById("arjsScene")
    // arjsScene.innerHTML = ""

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

        markerUrl = markerUrl.split(".")[0]
        modelUrl = modelUrl.split(".")[0]

        arjsScene.innerHTML += beforeEntity(markerUrl) + objEntity(modelUrl) + afterEntity();
        console.log("Added: " + markerUrl + " " + modelUrl)
    }

    arjsScene.innerHTML = arjsScene.innerHTML + addCamera();
    // console.log("added camera")
}