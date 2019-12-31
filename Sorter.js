class Sorter
{
	//This controls the adding of pixels.
	// Only valid pixels will be added to the list.
	addPixel(x, y)
	{
		if(this.pixelmap.isBusy(x, y) == false)
		{
			if(x >= 0 & x < this.pixelmap.imagedata.width)
				if(y >= 0 & y < this.pixelmap.imagedata.height)
				{
					//Check if the previous entry is a duplicate.
					//Assume that it is not.
					var duplicate = false;
					var indexOfLast = this.pixelList.length - 1;
					if(indexOfLast >= 0)
					{
						//If a previous entry exists, check it.
						var prev = this.pixelList[indexOfLast];
						//If the x & y both match, this is a duplicate.
						if(prev.x == x & prev.y == y)
							duplciate = true;
					}
					if(duplicate == false)
					{
						var pixel = this.pixelmap.getPixel(x, y);
						this.pixelmap.setBusy(pixel);
						this.pixelList.push(pixel);
					}
				}

		}
	}
	//Doing trig every step sounds...bad.
	//How about we do all the trig ahead of time and just make a list of points?
	//This function does that.
	createPixelList()
	{
		this.pixelList = [];
		for(var t = 0; t < this.tmax; t++)
		{
			var currentX = this.x + t * Math.cos(this.theta);
			var currentY = this.y + t * Math.sin(this.theta);
			this.addPixel(currentX, currentY);					
		}
	}
	constructor(pixelmap, x, y, theta, tmax)
	{
		this.pixelmap = pixelmap;
		this.x = x;
		this.y = y;
		this.theta = theta;
		this.tmax = tmax;
		this.createPixelList()
	}
	//Compares two pixel objects.
	pixelCompare(pixel1, pixel2)
	{
		return this.pixelmap.getLuma(pixel1) > this.pixelmap.getLuma(pixel2);
	}
	doSort()
	{
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
		return swapPerformed;
	}
	destroy()
	{
		//Free up all the pixels that were reserved by this sorter.
		for(var pixel of this.pixelList)
			this.pixelmap.setBusy(pixel);
	}
}

//This class encapsulates the creation of sorter objects.
class SorterCreator
{
	createMaxPixels(maxPixels, startX, startY, theta)
	{
		var pixelmap = controller.sourceAndPreview.getPixelmap();
		var newSorter = new this.sorterType(pixelmap, startX, startY, theta, maxPixels);
		this.controller.sorters.push(newSorter);
	}
	createHueMatching(hueRange, startX, startY, theta)
	{
		
	}
	create(maxValue, startX, startY, theta)
	{
		this.creationFunction(maxValue, startX, startY, theta);
	}
	constructor(controller)
	{
		this.controller = controller;
		this.sorterType = Sorter;
		this.creationFunction = this.createMaxPixels;
	}
}