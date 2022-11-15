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

    formInit();

    if (data.length < 1) {
        document.querySelector(".boxes").innerHTML = "The object list is empty, please add some nft objects";
        return;
    }

    for (let i = 0; i < data.length; i++) {
        makeObjectTableEntry(data[i]);
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
        (document.querySelector('#markerID') as HTMLInputElement).value = data.name;
        if (data.models) for (let i = 0; i < data.models.length; i++) {
            let modelName = data.models[i].name;
            // let modelSeason = data.models[i].season;
            (document.querySelector('#currentlyAssociatedModels') as HTMLElement).innerText += modelName + '\n'; // TODO
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
