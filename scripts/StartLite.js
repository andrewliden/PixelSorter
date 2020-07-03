///StartLite.js
///By Andrew Liden
///Starts the Lite version of the pixel sorter program.

$(document).ready(function(){
	var mainLayer = $("#main");
	var controller = new LiteController(mainLayer);
})