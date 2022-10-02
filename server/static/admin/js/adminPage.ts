var selectBox = document.getElementById("left-column");
var objectsFrame = document.getElementById("nft-objects");
var modelsFrame = document.getElementById("ar-models");
var eventsFrame = document.getElementById("events");

function changeFrame(): void {
    switch (this.value) {
        case "0":
            objectsFrame.removeAttribute("hidden");
            modelsFrame.setAttribute("hidden", "hidden");
            eventsFrame.setAttribute("hidden", "hidden");
            break;
        case "1":
            objectsFrame.setAttribute("hidden", "hidden");
            modelsFrame.removeAttribute("hidden");
            eventsFrame.setAttribute("hidden", "hidden");
            break;
        case "2":
            objectsFrame.setAttribute("hidden", "hidden");
            modelsFrame.setAttribute("hidden", "hidden");
            eventsFrame.removeAttribute("hidden");
            break;
    }
}

selectBox.addEventListener("change", changeFrame);
