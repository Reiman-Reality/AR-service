const selectBox: HTMLElement = document.getElementById("left-column");
const objectsFrame: HTMLElement = document.getElementById("nft-objects");
const modelsFrame: HTMLElement = document.getElementById("ar-models");

function changeFrame(): void {
    switch (this.value) {
        case "0":
            objectsFrame.removeAttribute("hidden");
            modelsFrame.setAttribute("hidden", "hidden");
            break;
        case "1":
            objectsFrame.setAttribute("hidden", "hidden");
            modelsFrame.removeAttribute("hidden");
            break;
    }
}

selectBox.addEventListener("change", changeFrame);
