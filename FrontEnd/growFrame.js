// Boolean to keep track of the users current screen setting
let fullscreen = false

/**
 * Method to switch users screen from full screen to regular size and vice versa.
 */
function MaximizeMinimizeFunction() {
	// If the users screen is not fullscreen, set all attributes
	// and make the arjs scene fullscreen with the current ribbon of options
	// minimize everything else
	if(!fullscreen){
		document.querySelector("#arIframe")?.classList.add("fullscreen");
		document.querySelector(".header").classList.add('hide');
		document.querySelectorAll(".intro").forEach( element =>{element.classList.add('hide')});
		document.querySelector("#footer").classList.add('hide');
		let ribbon = document.querySelector("#FullScreenId")
		ribbon.innerHTML = "Minimize"

		fullscreen = true
	} else {
		// If the users screen is fullscreen, set everything back to normal, minimizing the ribbon and arjs scene
		document.querySelector("#arIframe")?.classList.remove("fullscreen");
		document.querySelector(".header").classList.remove('hide');
		document.querySelectorAll(".intro").forEach( element =>{element.classList.remove('hide')});
		document.querySelector("#footer").classList.remove('hide');
		let ribbon = document.querySelector("#FullScreenId")
		ribbon.innerHTML = "Fullscreen"

		fullscreen = false
	}
}
