const REFRESH_RATE = 100 * 1/600;

class Controller
{
	start()
	{
		var selfReference = this;
		this.interval = setInterval(function(){ selfReference.refresh(); }, REFRESH_RATE);
	}
	constructor(container)
	{
		//Put this in a container (some html element, typically a div)
		this.container = container;
		this.sourceAndPreview = new SourcePreviewComposite(this.container);
		//Create a list of sorters.
		this.sorters = [];
		this.sorterCreator = new SorterCreator(this);
		//Create an input listener
		this.pointerInput = new PointerListener(this, this.sourceAndPreview.getCanvas());
		this.start();
		this.tmax = 100;
		//Create a div to put the inputs in.
		this.inputsContainer = document.createElement("div");
		this.inputsContainer.setAttribute("id", "inputs");
		this.container.appendChild(this.inputsContainer);
		this.angleInput = new AngleInput(this.inputsContainer);
	}
	click()
	{
		var theta = this.angleInput.theta;
		var scale = 1 / this.sourceAndPreview.getScale();
		var distance = Math.sqrt(this.pointerInput.dx ** 2 + this.pointerInput.dy ** 2);
		distance *= scale;
		distance = distance;
		for(var t = 0; t < distance; t++)
		{
			var x = scale * this.pointerInput.x - this.pointerInput.dx / distance * t ;
			var y = scale * this.pointerInput.y - this.pointerInput.dy / distance * t;
			this.sorterCreator.create(this.tmax, x, y, theta);
		}
	}
	doSorts()
	{
		//Iterate through the list of sorts.
		for(var i = 0; i < this.sorters.length; i++)
		{
			//For each sorter, do the sort and see if it completed.
			var sorter = this.sorters[i];
			var stillSorting = sorter.doSort();
			//If this sorter is done sorting, take it out of the array,
			//then decrement i, since the list is 1 item shorter now.
			if(!stillSorting)
			{
				this.sorters[i].destroy();
				this.sorters.splice(i, 1);
				i--;
			}
		}
	}
	clearSorts()
	{
		this.sorters = [];
	}
	refresh()
	{
		var theta = this.angleInput.theta;
		this.doSorts();
		this.sourceAndPreview.draw();
		this.sourceAndPreview.drawCursor(this.pointerInput.x, this.pointerInput.y, theta, this.tmax);
	}
	stop()
	{
		clearInterval(this.interval);
	}
	setImage(src)
	{
		this.clearSorts();
		this.source.setImage(src);
	}
	
	
}