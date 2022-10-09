// TODO Make this TypeScript

window.addEventListener("DOMContentLoaded", async ()=>{
    const response = await fetch(""); // TODO put API URL here
    
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

    tableEntryHeaderLink.setAttribute("href", data.websiteLink);
    tableEntryHeaderLink.textContent += data.name
    tableEntryHeader.appendChild(tableEntryHeaderLink);
    tableEntryHeader.setAttribute("class", "boxHeading");
    tableEntry.appendChild(tableEntryHeader);

    tableEntry.innerHTML += "Test Body"; // TODO possible security vulnerability, probably won't be needed anyways
    tableEntryList.appendChild(tableEntry);
}
