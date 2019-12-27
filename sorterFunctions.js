function controllerTest()
{
	controller = new Controller(document.body);
}

function init()
{
	controllerTest();
}

function circleSort(x,y,r)
{
    for(var i = 0; i < 360; i++)
    {
        sorterTest(x,y,i,r)
        sortAndDraw();
    }
}