var modelDataJson;

window.addEventListener("DOMContentLoaded", async ()=>{
    const response = await fetch("./api/getMarkers");
    
    if (!response.ok) {
        document.body.textContent += "The server was unable to load the object list. Please refresh the page.";
        return;
    }

    const data = await response.json();

    if (!data) {
        document.body.textContent += "The object list may be malformed. Please refresh the page.";
        return;
    }

    const modelResponse = await fetch("./api/getModels");
    if (!modelResponse.ok) {
        alert("The server was unable to load the model list. Please refresh the page.");
        return;
    }
    var modelData = await modelResponse.json();
    if (!modelData) {
        alert("The model list may be malformed. Please refresh the page.");
        return;
    }
    modelDataJson = modelData;

    formInit();

    if (data.length < 1) {
        document.querySelector(".boxes").innerHTML = "The object list is empty, please add some natural feature tracking markers.";
        return;
    }

    for (let i = 0; i < data.length; i++) {
        makeObjectTableEntry(data[i]);
    }

});

function makeObjectTableEntry(data) : void {
    const tableEntryList : HTMLElement = document.getElementById("boxList");
    const tableEntry : HTMLElement = document.createElement("li");
    tableEntry.classList.add("nft");
    const tableEntryHeader : HTMLElement = document.createElement("div");
    const tableEntryHeaderLink : HTMLElement = document.createElement("a");
    const tableEntryThumbnail : HTMLElement = document.createElement("img");

    // tableEntryHeaderLink.setAttribute("href", data.websiteLink); // TODO Get edit link
    tableEntryHeaderLink.textContent += data.name
    tableEntryHeader.appendChild(tableEntryHeaderLink);
    tableEntryHeader.setAttribute("class", "boxHeading");
    tableEntry.appendChild(tableEntryHeader);

    //tableEntryThumbnail.setAttribute("src", data.file_path);
    tableEntry.appendChild(tableEntryThumbnail);
    tableEntry.addEventListener('click', () =>{
        document.querySelector("#marker-modal").classList.add("show");
        document.querySelector("#newMarkerForm").classList.add("hide");
        document.querySelector("#markerForm").classList.remove("hide");
        (document.querySelector('#markerName') as HTMLInputElement).value = data.name;
        (document.querySelector('#markerID') as HTMLInputElement).value = data.marker_id;
        (document.querySelector('#currentlyAssociatedModels') as HTMLTableElement).innerHTML = "<tr><th>Name</th><th>Tag</th><th>X Position</th><th>Y Postion</th><th>Z Position</th><th>Scale</th><!-- TODO Orientation? --><th></th></tr>";
        if (data.models) for (let i = 0; i < data.models.length; i++) {
            let tableRow : HTMLTableRowElement = document.createElement("tr");

            let modelId = data.eventData[i].model_id;
            let modelName : HTMLTableCellElement = document.createElement("td");
            modelName.innerText = "???";
            for (const model of data.models) if (model.model_id === modelId) {
                 modelName.innerText = model.name;
                 break;
            }
            tableRow.append(modelName);

            let modelSeasonCell : HTMLTableCellElement = document.createElement("td");
            let modelSeason : HTMLInputElement = document.createElement("input");
            modelSeason.setAttribute("type", "text");
            modelSeason.value = data.eventData[i].tag;
            modelSeason.addEventListener("change", async () => {editPreexistingValue(data.marker_id, modelId, "tag", modelSeason.value);});
            modelSeasonCell.append(modelSeason);
            tableRow.append(modelSeasonCell);

            let modelXcell : HTMLTableCellElement = document.createElement("td");
            let modelX : HTMLInputElement = document.createElement("input");
            modelX.setAttribute("type", "number");
            modelX.value = data.eventData[i].x_pos;
            modelX.addEventListener("change", async () => {editPreexistingValue(data.marker_id, modelId, "x_pos", modelX.value);});
            modelXcell.append(modelX);
            tableRow.append(modelX);

            let modelYcell : HTMLTableCellElement = document.createElement("td");
            let modelY : HTMLInputElement = document.createElement("input");
            modelY.setAttribute("type", "number");
            modelY.value = data.eventData[i].y_pos;
            modelY.addEventListener("change", async () => {editPreexistingValue(data.marker_id, modelId, "y_pos", modelY.value);});
            modelYcell.append(modelY);
            tableRow.append(modelYcell);

            let modelZcell : HTMLTableCellElement = document.createElement("td");
            let modelZ : HTMLInputElement = document.createElement("input");
            modelZ.setAttribute("type", "number");
            modelZ.value = data.eventData[i].z_pos;
            modelZ.addEventListener("change", async () => {editPreexistingValue(data.marker_id, modelId, "z_pos", modelZ.value);});
            modelZcell.append(modelZ);
            tableRow.append(modelZcell);

            let modelScaleCell : HTMLTableCellElement = document.createElement("td");
            let modelScale : HTMLInputElement = document.createElement("input");
            modelScale.setAttribute("type", "number");
            modelScale.value = data.eventData[i].scale;
            modelScale.addEventListener("change", async () => {editPreexistingValue(data.marker_id, modelId, "scale", modelScale.value);});
            modelScaleCell.append(modelScale);
            tableRow.append(modelScaleCell);

            let eventDeleteCell : HTMLTableCellElement = document.createElement("td");
            let eventDelete : HTMLInputElement = document.createElement("input");
            eventDelete.setAttribute("type", "submit");
            eventDelete.innerText = "Remove";
            eventDelete.addEventListener("change", async () => {removeModelFromMarker(data.marker_id, modelId)});
            eventDeleteCell.append(eventDelete);
            tableRow.append(eventDeleteCell);
            
            (document.querySelector('#currentlyAssociatedModels') as HTMLTableElement).append(tableRow);
        }
        (document.querySelector('#newModelToAssociate') as HTMLSelectElement).innerHTML = "";
        (document.querySelector('#newModelToAssociate') as HTMLSelectElement).add(new Option("No model selected", "null"));
        for (let i = 0; i < modelDataJson.length; i++) {
            let modelName = modelDataJson[i].name;
            let modelId = modelDataJson[i].model_id;
            (document.querySelector('#newModelToAssociate') as HTMLSelectElement).add(new Option(modelName, modelId));
        }
        (document.querySelector('#newModelTimePeriod') as HTMLInputElement).value = "";
    });
    tableEntryList.appendChild(tableEntry);
}

function formInit() {
    document.querySelector("#markerForm").addEventListener("submit", async (event)=>{
        event.preventDefault();
        event.stopPropagation();
        console.log(event.target);
        const data = new FormData(event.target as HTMLFormElement);
        for (const [key, value] of data) {
            console.log( `${key}: ${value}\n`);
          }

        const request = new XMLHttpRequest();

        request.addEventListener("load", (event)=>{
            alert("updated succesfully");
        });
        request.addEventListener("error", (event)=>{
            alert("failed to update try again later");
        });

        request.open("POST", "./api/updateMarker");
        request.send(data);
    });

    document.querySelector("#addMarkerButton").addEventListener("click", ()=>{
        document.querySelector("#marker-modal").classList.add("show");
        document.querySelector("#newMarkerForm").classList.remove("hide");
        document.querySelector("#markerForm").classList.add("hide");
        (document.querySelector('#new_markerName') as HTMLInputElement).value = "";
        (document.querySelector('#new_newModelToAssociate') as HTMLSelectElement).innerHTML = "";
        (document.querySelector('#new_newModelToAssociate') as HTMLSelectElement).add(new Option("No model selected", "null"));
        for (let i = 0; i < modelDataJson.length; i++) {
            let modelName = modelDataJson[i].name;
            let modelId = modelDataJson[i].model_id;
            (document.querySelector('#new_newModelToAssociate') as HTMLSelectElement).add(new Option(modelName, modelId));
        }
        (document.querySelector('#new_newModelTimePeriod') as HTMLInputElement).value = "";
    })

    document.querySelector("#newMarkerForm").addEventListener("submit", async (event)=>{
        event.preventDefault();
        event.stopPropagation();
        console.log(event.target);
        const data = new FormData(event.target as HTMLFormElement);
        for (const [key, value] of data) {
            console.log( `${key}: ${value}\n`);
          }

        const request = new XMLHttpRequest();

        request.addEventListener("load", (event)=>{
            alert("created succesfully");
        });
        request.addEventListener("error", (event)=>{
            alert("failed to create marker try again later");
        });

        request.open("POST", "./api/addMarker");
        request.send(data);
    });

    document.querySelector("#modal-exit").addEventListener("click", ()=>{
        document.querySelector("#marker-modal").classList.remove("show");
    })
}

function editPreexistingValue(markerId, modelId, nameOfField, newValue) {
    fetch("./api/editEvent", {
        method: "POST",
        body: JSON.stringify({"marker_id": markerId, "model_id": modelId, "field": nameOfField, "value": newValue})
    });
}

function removeModelFromMarker(markerId, modelId) {
    fetch("./api/deleteEvent", {
        method: "POST",
        body: JSON.stringify({"marker_id": markerId, "model_id": modelId})
    });
}
