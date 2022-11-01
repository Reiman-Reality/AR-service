let modelsPresent = false;

function beforeEntity(markerUrl) {
    return `<a-nft type=\"nft\" url=\"${markerUrl}\" smooth=\"true\" smoothCount=\"10\" smoothTolerance=\".01\" smoothThreshold=\"5\">`
}

function objEntity(objName){
    return `<a-entity obj-model="url(./models/${objName}.obj); mtl: url(./textures/${objName}.mtl)"></a-entity>`
}

function afterEntity() {
    return "</a-nft>"
}

function addCamera(){
    return "<a-entity camera></a-entity>";
}

function httpGet(theUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false );
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

function addModelFunction() {
    let arjsScene = document.getElementById("arjsScene")

    if (modelsPresent) {
        return;
    }
    modelsPresent = true;

    let modelJSON = httpGet("https://coms-402-sd-37.class.las.iastate.edu/filenames");

    for(let i = 0; i < modelJSON.length; i++) {
        let obj = modelJSON[i];

        let markerUrl = obj["markerName"];
        let modelUrl = obj["modelFile"];

        arjsScene.innerHTML += beforeEntity(markerUrl) + objEntity(modelUrl) + afterEntity();
        console.log("Added: " + markerUrl + " " + modelUrl)
    }

    // arjsScene.innerHtml = arjsScene.innerHTML + addCamera();

    console.log(beforeEntity("test"))
}