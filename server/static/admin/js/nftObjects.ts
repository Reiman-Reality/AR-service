// TODO Make this TypeScript

window.addEventListener("DOMContentLoaded", async ()=>{
    const response = await fetch("admin/api/getMarkers");
    
    if (!response.ok) {
        alert("The server was unable to load the event list. Please refresh the page."); // TODO Put this on the document itself
        return;
    }

    const data = await response.json();

    if (!data) {
        alert("The event list may be malformed. Please refresh the page."); // TODO Put this on the document itself
        return;
    }

    if (data.length < 1) {
        alert("The event list is empty. Please add a new event."); // TODO Put this on the document itself
        return;
    }

    for (let i = 0; i < data.length; i++) {
        makeTableEntry(data[i]);
    }
});

function makeTableEntry(data) : void {
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
