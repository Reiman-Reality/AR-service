let fullscreen = false

function MaximizeMinimizeFunction() {
	if(!fullscreen){
		document.querySelector("#arIframe")?.classList.add("fullscreen");
		document.querySelector(".header").classList.add('hide');
		document.querySelectorAll(".intro").forEach( element =>{element.classList.add('hide')});
		document.querySelector("#footer").classList.add('hide');
		let ribbon = document.querySelector("#FullScreenId")
		ribbon.innerHTML = "Minimize"

		fullscreen = true
	} else {
		document.querySelector("#arIframe")?.classList.remove("fullscreen");
		document.querySelector(".header").classList.remove('hide');
		document.querySelectorAll(".intro").forEach( element =>{element.classList.remove('hide')});
		document.querySelector("#footer").classList.remove('hide');
		let ribbon = document.querySelector("#FullScreenId")
		ribbon.innerHTML = "Fullscreen"

		fullscreen = false
	}
}
