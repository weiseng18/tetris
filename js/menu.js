function addButtons() {
	var button = document.createElement("button");
	button.innerHTML = "Start Game";
	button.addEventListener("click", () => {
		game.start();
	});
	get("menu").appendChild(button);
}