window.addEventListener("DOMContentLoaded", async ()=>{
    const response = await fetch("admin/api/getModels");
    
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

function makeModelTableEntry(data) : void {
    const tableEntryList : HTMLElement = document.getElementById("boxList");
    const tableEntry : HTMLElement = document.createElement("li");
    const tableEntryHeader : HTMLElement = document.createElement("div");
    const tableEntryHeaderLink : HTMLElement = document.createElement("a");
    const tableEntryThumbnail : HTMLElement = document.createElement("img");

    // tableEntryHeaderLink.setAttribute("href", data.websiteLink); // TODO Get edit link
    tableEntryHeaderLink.textContent += data.name
    tableEntryHeader.appendChild(tableEntryHeaderLink);
    tableEntryHeader.setAttribute("class", "boxHeading");
    tableEntry.appendChild(tableEntryHeader);

    tableEntryThumbnail.setAttribute("src", data.file_path);
    tableEntry.appendChild(tableEntryThumbnail);
    tableEntryList.appendChild(tableEntry);
}
