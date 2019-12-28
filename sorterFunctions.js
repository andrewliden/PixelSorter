var controller;

function init()
{
	var mainLayer = document.getElementById("main");
	controller = new Controller(mainLayer);
}

function circleSort(r)
{
	var x = controller.pointerInput.x;
	var y = controller.pointerInput.y;
    for(var i = 0; i < 360; i++)
    {
		var sorter = new Sorter(controller.source.pixelmap, x, y, i, r);
		controller.sorters.push(sorter);
    }
}