class Sorter
{
	hueInRange(pixel)
	{
		var pixelHue = this.pixelmap.getHue(pixel);
		//If the hue hasn't been defined yet, define it and say it's in range.
		if(this.startHue == undefined)
		{
			this.startHue = pixelHue;
			return true;
		}
		else
		{
			var inRange = false;
			var minHue = this.startHue - this.hueRange;
			var maxHue = this.startHue + this.hueRange;
			//Hue is an angle in degrees, so some special edge-case handling is necessary
			if(minHue < 0)
			{
				//When the minimum is under 0, 
				//check the relevant high degrees, then clamp the minimum to 0.
				var offset = 360 + minHue;
				if(pixelHue >= offset)
					inRange = true;
				minHue = 0;
			}
			if(maxHue > 360)
			{
				//When the maximum is over 360,
				//check the relevant low degrees, then clamp the maximum to 360.
				var offset = maxHue - 360;
				if(pixelHue <= offset)
					inRange = true;
				maxHue = 360;
			}
			//check the normal case.
			if(pixelHue <= maxHue)
				if(pixelHue >= minHue)
					inRange = true;
			return inRange;
		}
	}
	//This controls the adding of pixels.
	// Only valid pixels will be added to the list.
	addPixel(x, y)
	{
		//Don't add the pixel if it's outside the image.
		var width = this.pixelmap.imagedata.width;
		var height = this.pixelmap.imagedata.height;
		if(x < 0 | x >= width | y < 0 | y >= height)
			return;
		var pixel = this.pixelmap.getPixel(x, y);
		//Break if the hue is outside the desired range.
		if(!this.hueInRange(pixel))
			throw "break";
		//Add the pixel, if it's not busy.
		if(this.pixelmap.isBusy(pixel) == false)
		{
			this.pixelmap.setBusy(pixel);
			this.pixelList.push(pixel);
		}
	}
	//Creates a lookup table of pixels that this sorter "owns"
	createPixelList()
	{
		this.pixelList = [];
		for(var t = 0; t < this.length; t++)
		{
			var currentX = this.x + t * Math.cos(this.theta);
			var currentY = this.y + t * Math.sin(this.theta);
			try
			{
				this.addPixel(currentX, currentY);
			}
			catch(error)
			{
				//If the exception is "break", break the for loop.
				//If it's something else, throw an error.
				if(error == "break")
					break;
				else
					throw "Unexpected error while adding a pixel to the list.";
			}
		}
	}
	constructor(pixelmap, x, y, theta, length, hueRange)
	{
		this.pixelmap = pixelmap;
		this.x = x;
		this.y = y;
		this.theta = theta;
		this.length = length;
		this.hueRange = hueRange;
		this.startHue;
		this.createPixelList()
	}
	setStrategy(sortingStrategy)
	{
		this.strategy = sortingStrategy;
	}
	//Compares two pixel objects.
	/*pixelCompare(pixel1, pixel2)
	{
		return this.pixelmap.getLuma(pixel1) < this.pixelmap.getLuma(pixel2);
	}*/
	doSort()
	{
		return this.strategy.sort(this.pixelList);
		/*
		var swapPerformed = false;
		for(var t = 1; t < this.pixelList.length; t++)
		{
			var current = this.pixelList[t];
			var prev = this.pixelList[t - 1];
			if(this.pixelCompare(current, prev))
			{
				this.pixelmap.swap(current, prev);
				swapPerformed = true;
			}
		}
		return swapPerformed;*/
	}
	destroy()
	{
		//Free up all the pixels that were reserved by this sorter.
		for(var pixel of this.pixelList)
			this.pixelmap.setNotBusy(pixel);
		
	}
}

/*class LightnessSorter extends Sorter
{
	constructor(pixelmap, x, y, theta, length, hueRange)
	{
		super(pixelmap, x, y, theta, length, hueRange);
	}
	pixelCompare(pixel1, pixel2)
	{
		return this.pixelmap.getLightness(pixel1) < this.pixelmap.getLightness(pixel2);
	}
}

class ValueSorter extends Sorter
{
	constructor(pixelmap, x, y, theta, length, hueRange)
	{
		super(pixelmap, x, y, theta, length, hueRange);
	}
	pixelCompare(pixel1, pixel2)
	{
		return this.pixelmap.getValue(pixel1) < this.pixelmap.getValue(pixel2);
	}
}

class IntensitySorter extends Sorter
{
	constructor(pixelmap, x, y, theta, length, hueRange)
	{
		super(pixelmap, x, y, theta, length, hueRange);
	}
	pixelCompare(pixel1, pixel2)
	{
		return this.pixelmap.getIntensity(pixel1) < this.pixelmap.getIntensity(pixel2);
	}
}

class LumaDescendingSorter extends Sorter
{
	constructor(pixelmap, x, y, theta, length, hueRange)
	{
		super(pixelmap, x, y, theta, length, hueRange);
	}
	pixelCompare(pixel1, pixel2)
	{
		return this.pixelmap.getLuma(pixel1) > this.pixelmap.getLuma(pixel2);
	}
}

class LightnessDescendingSorter extends Sorter
{
	constructor(pixelmap, x, y, theta, length, hueRange)
	{
		super(pixelmap, x, y, theta, length, hueRange);
	}
	pixelCompare(pixel1, pixel2)
	{
		return this.pixelmap.getLightness(pixel1) > this.pixelmap.getLightness(pixel2);
	}
}

class ValueDescendingSorter extends Sorter
{
	constructor(pixelmap, x, y, theta, length, hueRange)
	{
		super(pixelmap, x, y, theta, length, hueRange);
	}
	pixelCompare(pixel1, pixel2)
	{
		return this.pixelmap.getValue(pixel1) > this.pixelmap.getValue(pixel2);
	}
}

class IntensityDescendingSorter extends Sorter
{
	constructor(pixelmap, x, y, theta, length, hueRange)
	{
		super(pixelmap, x, y, theta, length, hueRange);
	}
	pixelCompare(pixel1, pixel2)
	{
		return this.pixelmap.getIntensity(pixel1) > this.pixelmap.getIntensity(pixel2);
	}
}

class StarSorter extends Sorter
{
	constructor(pixelmap, x, y, theta, length, hueRange)
	{
		super(pixelmap, x, y, theta, length, hueRange);
		this.sorters = new Array();
		for(var i = 0; i < 360; i += 36)
			this.sorters.push(new Sorter(pixelmap, x, y, theta + i, length, hueRange));
	}
	doSort()
	{
		var swapPerformed = false;
		swapPerformed = super.doSort();
		for(var sorter of this.sorters)
			swapPerformed = sorter.doSort();
		return swapPerformed;
	}
	destroy()
	{
		for(var sorter of this.sorters)
			sorter.destroy();
		super.destroy();
	}
}*/

//This class encapsulates the creation of sorter objects.
class SorterCreator
{
	setStrategy(strategy)
	{
		switch(strategy)
		{
			case "Bubble":
				this.strategyType = BubbleSort;
				break;
			case "Insertion":
				this.strategyType = InsertionSort;
				break;
			case "Selection":
				this.strategyType = SelectionSort;
				break;
			case "Quick":
				this.strategyType = QuickSort;
				break;
		}
	}
	setAscending(ascending)
	{
		this.ascending = ascending;
	}
	setCriteria(criteria)
	{
		this.sortOn = criteria;
	}
	create(startX, startY, theta, maxPixels, hueRange)
	{
		var pixelmap = this.controller.getPixelmap();
		var newSorter = new Sorter(pixelmap, startX, startY, theta, maxPixels, hueRange);
		var strategy = new this.strategyType(pixelmap, this.ascending, this.sortOn);
		newSorter.setStrategy(strategy);
		this.controller.sorters.push(newSorter);
	}
	constructor(controller)
	{
		this.controller = controller;
		this.strategyType = BubbleSort;
		this.sortOn = "Luma";
		this.ascending = true;
	}
}