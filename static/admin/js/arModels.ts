
var editModal = document.getElementById("editModel");

window.addEventListener("DOMContentLoaded", async ()=>{
    const response = await fetch("./api/getModels");
    
    if (!response.ok) {
        document.body.textContent += "The server was unable to load the model list. Please refresh the page.";
        return;
    }

    const data = await response.json();

    if (!data) {
        document.body.textContent += "The model list may be malformed. Please refresh the page.";
        return;
    }

    if (data.length < 1) {
        document.body.textContent += "The model list is empty. Please add a new model.";
        return;
    }

    for (let i = 0; i < data.length; i++) {
        makeModelTableEntry(data[i]);
    }
});
var model;
function makeModelTableEntry(data) : void {
    const tableEntryList : HTMLElement = document.getElementById("boxList");
    const tableEntry : HTMLElement = document.createElement("li");
    const tableEntryHeader : HTMLElement = document.createElement("div");
    const tableEntryHeaderLink : HTMLElement = document.createElement("a");
    const tableEntryThumbnail : HTMLElement = document.createElement("img");

    tableEntryHeaderLink.textContent += data.name
    tableEntryHeader.appendChild(tableEntryHeaderLink);
    tableEntryHeader.setAttribute("class", "boxHeading");
    tableEntry.appendChild(tableEntryHeader);

    tableEntryThumbnail.setAttribute("src", data.file_path);
    tableEntry.appendChild(tableEntryThumbnail);
    tableEntry.addEventListener('click', async () => {        
        data.preventDefault();
        var id = document.getElementById("edit_model_id");
        const idInput = document.getElementById("")
        var date = document.getElementById("edit_insert_date");
        var name = document.getElementById("edit_name");
        var path = document.getElementById("model_file_path");
    
        //appear on small windown
        id.innerHTML = "Model ID: " +data.model_id;
        date.innerHTML = "Insert on: " + data.inserted_on;
        (name as HTMLInputElement).value = data.name;
        (id as HTMLInputElement).value = data.model_id;
    
        editModal.style.display = "block";
    });
    tableEntryList.appendChild(tableEntry);
}

// Get the modal






// Get the <span> element that closes the modal
var span_1 = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span_1.addEventListener('click', ()=>   editModal.style.display = "none"); 



 
    