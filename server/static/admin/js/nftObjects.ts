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

    for (threeDEvent in data) {
        makeTableEntry(threeDEvent);
    }
});

function makeTableEntry(data) : void {
    const tableEntryList = document.getElementById("boxList");
    const tableEntry = document.createElement("li");
    const tableEntryHeader = document.createElement("div");

    tableEntryHeader.setAttribute("class", "boxHeading");
    tableEntryHeader.innerHTML += "Test Heading"; // TODO possible security vulnerability, probably won't be needed anyways
    tableEntry.appendChild(tableEntryHeader);

    tableEntry.innerHTML += "Test Body"; // TODO possible security vulnerability, probably won't be needed anyways
    tableEntryList.appendChild(tableEntry);
}
