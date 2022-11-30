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

    modelInit();

    if (data.length < 1) {
        document.querySelector(".boxes").innerHTML = "The model list is empty. Please add a new model.";
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
    const tableEntryDelete : HTMLElement = document.createElement("span");

    tableEntryHeaderLink.textContent += data.name

    tableEntryDelete.innerHTML += "X";
    tableEntryDelete.addEventListener("click", async (e)=>{
        e.stopPropagation();
        if(! confirm("Are you sure you want to delete this model?") ) {
            return;
        }
        await fetch('./api/deleteModel', {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body:JSON.stringify({
                modelID : data.model_id,
            })
        })
    });

    tableEntryHeader.appendChild(tableEntryHeaderLink);
    tableEntryHeader.appendChild(tableEntryDelete);
    tableEntryHeader.setAttribute("class", "boxHeading");
    tableEntry.appendChild(tableEntryHeader);

    tableEntryThumbnail.setAttribute("src", "null");
    tableEntry.appendChild(tableEntryThumbnail);
    tableEntry.addEventListener('click', async (event) => {       
        const editModal = document.getElementById("editModel"); 
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
        // Get the <span> element that closes the modal
var span_1 = document.getElementsByClassName("close")[0];
span_1.addEventListener('click', ()=>  editModal.style.display = "none"); 
    });
    tableEntryList.appendChild(tableEntry);
}




function modelInit() {
    document.querySelector("#addModelButton").addEventListener("click", ()=>{
        (document.querySelector("#editModel") as HTMLElement).style.display = "block";
    })
}

 
    