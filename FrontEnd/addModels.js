const arjsScene = document.getElementById("arjsScene")

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

function addModelFunction() {
    if (modelsPresent) {
        return;
    }
    modelsPresent = true;

    /**
     * Load models below
     */

    /**
     * Connect to db
     */

    // arjsScene.innerHTML = ""

    // for active in [ActiveList]:
    //      let markerUrl = active.markerUrl
    //      let objName = active.objName
    //      arjsScene.innerHtml += beforeEntity(markerUrl) + objEntity(objName) + afterEntity();
    //
    // arjsScene.innerHtml += addCamera()

    console.log(beforeEntity("test"))
}