//In a list, it can be better to store coordinate pairs as objects,
//rather than just as two variables.  This object allows that behavior.
class CoordinatePair
{
	constructor(x, y)
	{
		this.x = x;
		this.y = y;
	}
}

class Sorter
{
	//This controls the adding of coordinates.
	// Only valid coordinates will be added to the list.
	addCoordinate(x, y)
	{
		if(this.pixelmap.isBusy(x, y) == false)
		{
			if(x >= 0 & x < this.pixelmap.imagedata.width)
				if(y >= 0 & y < this.pixelmap.imagedata.height)
				{
					//Check if the previous entry is a duplicate.
					//Assume that it is not.
					var duplicate = false;
					var indexOfLast = this.coordinatesList.length - 1;
					if(indexOfLast >= 0)
					{
						//If a previous entry exists, check it.
						var prev = this.coordinatesList[indexOfLast];
						//If the x & y both match, this is a duplicate.
						if(prev.x == x & prev.y == y)
							duplciate = true;
					}
					if(duplicate == false)
					{
						var coordinate = new CoordinatePair(x, y);
						this.pixelmap.setBusy(x, y);
						this.coordinatesList.push(coordinate);
					}
				}

		}
	}
	//Doing trig every step sounds...bad.
	//How about we do all the trig ahead of time and just make a list of points?
	//This function does that.
	createCoordinatesList()
	{
		this.coordinatesList = [];
		for(var t = 0; t < this.tmax; t++)
		{
			var currentX = this.x + t * Math.cos(this.theta);
			var currentY = this.y + t * Math.sin(this.theta);
			this.addCoordinate(currentX, currentY);					
		}
	}
	constructor(pixelmap, x, y, theta, tmax)
	{
		this.pixelmap = pixelmap;
		this.x = x;
		this.y = y;
		this.theta = theta;
		this.tmax = tmax;
		this.createCoordinatesList()
	}
	//Compares two pixel objects.
	pixelCompare(pixel1, pixel2)
	{
		return this.pixelmap.getLuma(pixel1) > this.pixelmap.getLuma(pixel2);
	}
	//Compares two pixels at given coordinate pairs.
	comparePixelAt(coord1, coord2)
	{
		var pixel1 = this.pixelmap.getPixel(coord1.x, coord1.y);
		var pixel2 = this.pixelmap.getPixel(coord2.x, coord2.y);
		return this.pixelCompare(pixel1, pixel2);
	}
	doSort()
	{
		var swapPerformed = false;
		for(var t = 1; t < this.coordinatesList.length; t++)
		{
			var current = this.coordinatesList[t];
			var prev = this.coordinatesList[t - 1];
			if(this.comparePixelAt(current, prev))
			{
				this.pixelmap.swapAt(current.x,current.y, prev.x, prev.y);
				swapPerformed = true;
			}
		}
		return swapPerformed;
	}
	destroy()
	{
		//Free up all the pixels that were reserved by this sorter.
		for(var coordinate of this.coordinatesList)
			this.pixelmap.setNotBusy(coordinate.x, coordinate.y);
	}
}

//This class encapsulates the creation of sorter objects.
class SorterCreator
{
	createMaxPixels(maxPixels, startX, startY, theta)
	{
		var newSorter = new this.sorterType(this.controller.source.pixelmap, startX, startY, theta, maxPixels);
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