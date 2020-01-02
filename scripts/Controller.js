
//I'm sure someone will ask, "Why is the frame rate so low?"
//It's because when it's a bit slower, it's easier sometimes to stop sorting.
//If you really just want it to be 60, just change it...
const FRAME_RATE = 30;
const REFRESH_RATE = 100 * 1/ FRAME_RATE;

class Controller
{
	createImageInterface()
	{
		this.imageInterface = new ImageInterface(this.container);
	}
	start()
	{
		var selfReference = this;
		this.interval = setInterval(function(){ selfReference.refresh(); }, REFRESH_RATE);
	}
	constructor(container)
	{
		//Put this in a container (some html element, typically a div)
		this.container = container;
		//Create the image toolbox.
		this.imagetools = new ImageToolbox(this.container, this);
		//Create the image interface.
		this.createImageInterface();
		//Create a list of sorters.
		this.sorters = [];
		this.sorterCreator = new SorterCreator(this);
		//Create an input listener
		this.pointerInput = new PointerListener(this, this.imageInterface.getCanvas());
		this.start();
		//Create a toolbox
		this.toolbox = new ConfigToolbox(this.container, this);
	}
	click()
	{
		var theta = this.toolbox.getAngle();
		var length = this.toolbox.getLength();
		var hueRange = this.toolbox.getHueRange();
		var scale = 1 / this.imageInterface.getScale();
		var scaledDx = this.pointerInput.dx * scale;
		var scaledDy = this.pointerInput.dy * scale;
		//If the pointer wasn't moving, just add 1 sorter.
		if(scaledDx == 0 & scaledDy == 0)
		{
			var x = scale * this.pointerInput.x
			var y = scale * this.pointerInput.y
			this.sorterCreator.create(length, x, y, theta);
		}
		else
		{
			//If the pointer was moving, add sorters along the path the pointer
			var distance = Math.sqrt(scaledDx ** 2 + scaledDy ** 2);
			for(var t = 0; t < distance; t++)
			{
				var x = scale * this.pointerInput.x - scaledDx / distance * t;
				var y = scale * this.pointerInput.y - scaledDy / distance * t;
				this.sorterCreator.create(x, y, theta, length, hueRange);
			}
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
	//This clears all sorters and ensures all pixels they used are marked as non-busy.
	//It's a bit more work, but it keeps pixels from getting stuck.
	clearSortsAndBusymap()
	{
		while(this.sorters.length > 0)
		{
			var sorter = this.sorters.pop();
			sorter.destroy();
		}
	}
	//This does NOT mark pixels used by sorters as non-busy.
	//Use this method only if the pixelmap is being reinitialized.
	clearSorts()
	{
		this.sorters = [];
	}
	//This function clamps the max distance for the sorter length slider to the diagonal length of the image.
	applyMaxLength()
	{
		var maxDist = Math.floor( Math.sqrt( this.imageInterface.getWidth() ** 2 + this.imageInterface.getHeight() ** 2 ) );
		this.toolbox.setMaxLength(maxDist);
	}
	refresh()
	{
		this.applyMaxLength();
		var theta = this.toolbox.getAngle();
		var length = this.toolbox.getLength();
		this.doSorts();
		this.imageInterface.draw();
		var cursorSize = length * this.imageInterface.getScale();
		this.imageInterface.drawCursor(this.pointerInput.x, this.pointerInput.y, theta, cursorSize);
	}
	stop()
	{
		clearInterval(this.interval);
	}
	setImage(src)
	{
		this.clearSorts();
		this.imageInterface.setImage(src);
	}
	rotate()
	{
		this.clearSorts();
		this.imageInterface.rotate();
	}
	saveImage()
	{
		this.imageInterface.saveImage();
	}
	getPixelmap()
	{
		return this.imageInterface.getPixelmap();
	}
	loadImage(file)
	{
		var reader = new FileReader();
		var selfReference = this;
		reader.addEventListener("load", function(){ selfReference.setImage(reader.result); }, false);
		if(file)
			reader.readAsDataURL(file);
	}
	setSorterType(type)
	{
		this.sorterCreator.setType(type);
	}
}

class LiteController extends Controller
{
	createImageInterface()
	{
		this.imageInterface = new LiteImageInterface(this.container);
	}
	constructor(container)
	{
		super(container);
	}
}