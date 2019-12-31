class Sorter
{
	hueInRange(pixel)
	{
		var pixelHue = this.pixelmap.getHue(pixel);
		//If the hue hasn't been defined yet, define it and say it's in range.
		if(this.hue == undefined)
		{
			this.hue = pixelHue;
			return true;
		}
		else
		{
			var inRange = false;
			var minHue = this.hue - this.hueRange;
			var maxHue = this.hue + this.hueRange;
			//There's some nasty edge cases here.  The range of hue is 0 - 360.
			//But, adding or subtracting the range from the hue can yield a result outside the range!
			if(minHue < 0)
			{
				//Our minimum was negative!
				//Figure out how far off set we'd be from 360,
				//if this negative value were added to it.
				var offset = 360 + minHue;
				//Check from 360 to that offset
				//An assumption is made that the comparison hue is from 0 - 360.
				if(pixelHue >= offset)
					inRange = true;
				//Now that we're done checking the edge case, clamp to 0.
				minHue = 0;
			}
			if(maxHue > 360)
			{
				//Our maximum was more than 360!
				//Figure out how much we exceeded 360 by.
				var offset = maxHue - 360;
				//Check from 0 to that excess range.
				//An assumption here is that comparsionHue ranges from 0 - 360.
				if(pixelHue <= offset)
					inRange = true;
				//Clamp the maxHue calculation to 360 now that we're done checking the edge case.
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
		if(x >= 0 & x < this.pixelmap.imagedata.width)
		{
			if(y >= 0 & y < this.pixelmap.imagedata.height)
			{
				var pixel = this.pixelmap.getPixel(x, y);
				if(this.hueInRange(pixel))
				{
					if(this.pixelmap.isBusy(pixel) == false)
					{
						this.pixelmap.setBusy(pixel);
						this.pixelList.push(pixel);
					}
				}
				else
				{
					throw "break";
				}
			}
			else
			{
				throw "break"; 
			}
		}
		else
		{
			throw "break";
		}
	}
	//Doing trig every step sounds...bad.
	//How about we do all the trig ahead of time and just make a list of points?
	//This function does that.
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
				if(error == "break")
					break;
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
			this.pixelmap.setNotBusy(pixel);
	}
}

//This class encapsulates the creation of sorter objects.
class SorterCreator
{
	create(startX, startY, theta, maxPixels, hueRange)
	{
		var pixelmap = this.controller.sourceAndPreview.getPixelmap();
		var newSorter = new this.sorterType(pixelmap, startX, startY, theta, maxPixels, hueRange);
		this.controller.sorters.push(newSorter);
	}
	constructor(controller)
	{
		this.controller = controller;
		this.sorterType = Sorter;
	}
}