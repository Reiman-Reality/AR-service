document.addEventListener("DOMContentLoaded", ()=>{
    addModelFunction();
})

// Boolean to keep track if the models have already been loaded for a users current session
// Initially false, changed to true when addModelFunction() is first called
let modelsPresent = false;

/**
 * This method takes in a filename for a marker, and will then create an a-nft element within the aframescene
 * This method will then return the string representation of that a-nft element to be added to the innerHtml of the 
 * body
 * 
 * @param {string} markerUrl The name of the file that will be used as a marker
 * @returns {string} Returns a string representation of the a-nft element that will be added to the body
 */
function beforeEntity(markerUrl) {
    const nft = document.createElement("a-nft");
    return `<a-nft type=\"nft\" url=\"./${markerUrl}\" smooth=\"true\" smoothCount=\"10\" smoothTolerance=\".01\" smoothThreshold=\"5\">`
}

/**
 * This method take in a filename for the model/object that will be loaded into the scene as an a-entity element 
 * 
 * @param {string} objName Name of file that will be used as the model. Currently, this file needs to be in a .obj format
 * @param {number} scale The scale of the model in all 3 dimensions
 * @param {number} xP The x position of the model when compared to the marker it will be located on
 * @param {number} yP The y position of the model when compared to the marker it will be located on
 * @param {number} zP The z position of the model when compared to the marker it will be located on
 * @param {number} xR The x rotation of the model
 * @param {number} yR The y rotation of the model
 * @param {number} zR The z rotation of the model
 * @returns {string} Returns a string reprentation of the a-entity element that will then be added to the bodies innerHtml in the calling method
 */
function objEntity(objName, textureName, scale, xP, yP, zP, xR, yR, zR) {
    return `<a-entity
    obj-model="obj: url(/${objName}); mtl: url(/${textureName})"
    scale="${scale} ${scale} ${scale}"
    position="${xP} ${yP} ${zP}"
    orientation="${xR} ${xR} ${xR}"
    ></a-entity>`
}

/**
 * 
 * @returns {string} Returns the closing string of the a-nft element
 */
function afterEntity() {
    return "</a-nft>"
}

/**
 * Adds the camera to the end of the a-frame scene
 * 
 * @returns {string} Returns the a-entity element to make use of the camera on the users phone
 */
function addCamera() {
    return "<a-entity camera></a-entity>";
}

/**
 * Main function that does the work of setting up the scene
 * 
 * @returns {null}
 */
async function addModelFunction() {
    console.log("Attempting to load")

    // Get the body of the aframe scene
    const body = document.querySelector("#sceneBody");

    // Construct default outline needed for all aframe scenes.
    let arjsScene = `    <a-scene vr-mode-ui="enabled: false;" renderer="logarithmicDepthBuffer: true;" embedded
    arjs="trackingMethod: best; sourceType: webcam;debugUIEnabled: false;" id="arjsScene">`

    // If the models have already been added to the scene, return, as they do not need to be added again
    if (modelsPresent) {
        return;
    }
    // If models are not present, they will be after this method finishes, so set this variable to true
    modelsPresent = true;

    // Call to database to get all (marker, model) pair information
    const request = await fetch("./filenames");
    if (!request.ok) {
        console.log("error")
    }
    // Convert to json format for ease of use
    const data = await request.json();

    // Loop through all (marker, model) pairs
    for (let i = 0; i < data.length; i++) {
        let obj = data[i];

        // For each pair, extract the marker and model filenames
        let markerUrl = obj["markerName"];
        let textureUrl = obj['textureFile'];
        let modelUrl = obj["modelFile"];

        // For each pair, extract all parameter data for the model being added to the scene
        let scale = obj["scale"];
        let xPos = obj["xPos"];
        let yPos = obj["yPos"];
        let zPos = obj["zPos"];
        let xRot = obj["xRot"];
        let yRot = obj["yRot"];
        let zRot = obj["zRot"];

        // Remove file extension from the filenames of the marker and model
        markerUrl = markerUrl.split(".")[0]

        // Add the fully created a-nft type to the new scene body
        arjsScene += ( beforeEntity(markerUrl) + objEntity(modelURL,textureUrl, scale, xPos, yPos, zPos, xRot, yRot, zRot) + afterEntity());
        console.log("Added: " + markerUrl + " " + modelUrl)
    }

    console.log(arjsScene);

    // Add the camera to the end of the scene as well as closing string
    arjsScene += addCamera();
    arjsScene += '</a-scene>';

    // Add the finalized scene with all (marker, model) pairs to the end of the innerHTML of the body
    body.innerHTML += arjsScene;
}