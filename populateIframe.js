window.addEventListener("DOMContentLoaded", async ()=>{
	const response = await fetch("apiURL/getActiveEvents");

	if(!response.ok) {
		//TODO tell user to refresh page
		return;
	}

	const data = await response.json();

	if( !data.body.events) {
		//TODO alert that there are no evetns active at thsi time.
		return;
	}

	for(threeDEvent in data.body.events){
		makeTableEntry(threeDEvent);
	}


});

function makeTableEntry( data ) {
	const tableEntryContainer = document.createElement("div");
	tableEntryContainer.classList += "";

	tableEntryContainer.addEventListener('click', ()=>{

		const iframe = document.querySelector("#iframeIdentifier");
		if(!iframe){
			//TODO alert user of issue
		}
		iframe.classList.remove('hide');
		iframe.postmessage(data);
	})
}

//IFRAME 

window.addEventListener("DOMContentLoaded", ()=>{
	window.addEventListener("message",(event)=>{
		populateForm(data);
	});
})


function populateForm(data){
	document.querySelector("#eventName").value = data.eventName;
}
