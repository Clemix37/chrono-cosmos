const endScreenUrl = "./screens/end.html";

/**
 * Gets the HTML file of the end screen and display it inside the DOM
 */
async function launchGameEndScreen(): Promise<void> {
	const res = await fetch(endScreenUrl);
	const htmlContent = await res.text();
	document.body.innerHTML = htmlContent;
}

export { launchGameEndScreen };
