const REFRESH_RATE = 100 * 1/60;
const DEFAULT_IMG = "default.jpg";

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
		//Create a div to put the preview in.
		this.previewContainer = document.createElement("div");
		this.previewContainer.setAttribute("id", "preview");
		this.container.appendChild(this.previewContainer);
		//Create the source, then the preview.
		this.source = new Source(DEFAULT_IMG);
		this.preview = new Preview(this.source, this.previewContainer);
		//Create a list of sorters.
		this.sorters = [];
		this.sorterCreator = new SorterCreator(this);
		//Create an input listener
		this.pointerInput = new PointerListener(this, this.preview.canvas);
		this.start();
		this.theta = Math.PI / 2;
		this.tmax = 100;
	}
	click()
	{
		var scale = 1 / this.preview.scale;
		var distance = Math.sqrt(this.pointerInput.dx ** 2 + this.pointerInput.dy ** 2);
		distance *= scale;
		distance = Math.floor(distance);
		for(var t = 0; t < distance; t++)
		{
			var x = Math.floor(scale * this.pointerInput.x - this.pointerInput.dx / distance * t );
			var y = Math.floor(scale * this.pointerInput.y - this.pointerInput.dy / distance * t);
			this.sorterCreator.create(this.tmax, x, y, this.theta);
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
		this.doSorts();
		this.source.draw();
		this.preview.draw();
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