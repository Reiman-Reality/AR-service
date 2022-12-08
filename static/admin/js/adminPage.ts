var selectBox: HTMLElement|null = document.getElementById("left-column");
var objectsFrame: HTMLElement|null = document.getElementById("nft-objects");
var modelsFrame: HTMLElement|null = document.getElementById("ar-models");
var createUserFrame: HTMLElement|null = document.getElementById("create-user");



document.addEventListener("DOMContentLoaded", ()=>{
    selectBox = document.getElementById("left-column");
    objectsFrame = document.getElementById("nft-objects");
    modelsFrame = document.getElementById("ar-models");
    createUserFrame = document.getElementById("create-user");
    selectBox?.addEventListener("change", changeFrame);
    if( getCookie("perms") != 'ADMIN' ) {
        createUserFrame.remove();
        document.querySelector('#create-user-tab').remove();
    }
})

async function logOut(){
    await fetch("./api/logout");
    location.href = "./login";
}


function changeFrame(): void {
    switch ((selectBox as HTMLInputElement).value) {
        case "0":
            objectsFrame?.removeAttribute("hidden");
            modelsFrame?.setAttribute("hidden", "hidden");
            createUserFrame?.setAttribute("hidden", "hidden");
            break;
        case "1":
            objectsFrame?.setAttribute("hidden", "hidden");
            createUserFrame?.setAttribute("hidden", "hidden");
            modelsFrame?.removeAttribute("hidden");
            break;
        case "2":
            objectsFrame?.setAttribute("hidden", "hidden");
            modelsFrame?.setAttribute("hidden", "hidden");
            createUserFrame?.removeAttribute("hidden");
            break;
    }
    
}


function getCookie(cookie :string ) {
    let name = cookie + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }