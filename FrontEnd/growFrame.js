console.log("hihihihi");

window.addEventListener("DOMContentLoaded", (event)=>{
	document.querySelector("#loadingButton")?.addEventListener('click', (event)=>{
		document.querySelector("#arIframe")?.classList.add("fullscreen");
		document.querySelector(".header").classList.add('hide');
		document.querySelectorAll(".intro").forEach( element =>{element.classList.add('hide')});
		document.querySelector("#footer").classList.add('hide');
	});
});