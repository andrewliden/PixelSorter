///sorterFunctions.js
///By Andrew Liden
///Provides start-up functions for sorters.
///Deprecated.

var controller;

function init()
{
	var mainLayer = document.getElementById("main");
	controller = new Controller(mainLayer);
}

function initLite()
{
	var mainLayer = document.getElementById("main");
	controller = new LiteController(mainLayer);
}

//Deprecated, test function.
function circleSort(r)
{
	var x = controller.pointerInput.x;
	var y = controller.pointerInput.y;
    for(var i = 0; i < 360; i++)
    {
		var sorter = new Sorter(controller.sourceAndPreview.getPixelmap(), x, y, i, r);
		controller.sorters.push(sorter);
    }
}