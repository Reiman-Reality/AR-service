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



});

function makeObjectTableEntry(data) : void {
    console.log(data);
    const tableEntryList : HTMLElement = document.getElementById("boxList");
    const tableEntry : HTMLElement = document.createElement("li");
    tableEntry.classList.add("nft");
    const tableEntryHeader : HTMLElement = document.createElement("div");
    const tableEntryDelete : HTMLElement = document.createElement("span");
    const tableEntryHeaderLink : HTMLElement = document.createElement("a");
    const tableEntryThumbnail : HTMLElement = document.createElement("img");


    tableEntryDelete.innerHTML += "X";
    tableEntryDelete.addEventListener("click", async (e)=>{
        e.stopPropagation();
        if(! confirm("Are you sure you want to delete this marker?") ) {
            return;
        }
        await fetch("./api/deleteMarker", {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body:JSON.stringify({
                markerID : data.marker_id,
            })
        })
    });

    // tableEntryHeaderLink.setAttribute("href", data.websiteLink); // TODO Get edit link
    tableEntryHeaderLink.textContent += data.name
    tableEntryHeader.appendChild(tableEntryHeaderLink);
    tableEntryHeader.appendChild(tableEntryDelete);
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
        (document.querySelector('#marker1') as HTMLInputElement).value = data.file_path_one;
        (document.querySelector('#marker2') as HTMLInputElement).value = data.file_path_two;
        (document.querySelector('#marker3') as HTMLInputElement).value = data.file_path_three;
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
        (document.querySelector('#markerName') as HTMLInputElement).value = "";
        (document.querySelector('#markerID') as HTMLInputElement).value = "";
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
