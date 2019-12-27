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
	//Doing trig every step sounds...bad.
	//How about we do all the trig ahead of time and just make a list of points?
	//This function does that.
	createCoordinatesList()
	{
		this.coordinatesList = [];
		for(var t = 0; t < this.tmax; t++)
		{
			var currentX = this.x + Math.floor(t * Math.cos(this.theta));
			var currentY = this.y + Math.floor(t * Math.sin(this.theta));
			var currentCoordinate = new CoordinatePair(currentX, currentY);
			var prev = this.coordinatesList[t - 1];
			//Only push this to the list if it's the first entry, or it's a non-duplicate.
			if(prev == undefined)
				this.coordinatesList.push(currentCoordinate);
			else if(prev.x != currentX | prev.y != currentY)
				this.coordinatesList.push(currentCoordinate);		
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
}

//This class encapsulates the creation of sorter objects.
class SorterCreator
{
	//Make sure the sorter fits in bounds
	boundsCheck(startX, startY)
	{
		var width = this.controller.source.image.width - 1;
		var height = this.controller.source.image.height - 1;
		return !(startX < 0 | startX > width | startY < 0 | startY > height);
	}
	//Use the law of sines to figure out how far away ray 1 is from ray 2.
	distanceTo(x1, y1, theta1, x2, y2, theta2, tmax)
	{
		var dx = x1 - x2;
		var dy = y1 - y2;
		var distance = Math.sqrt(dx ** 2 + dy ** 2);
		var angle = Math.atan2(dy, dx);
		var vectorDistance = Math.sin(theta2 - angle) * distance / Math.sin(theta1 - theta2);
		if(vectorDistance < 0 | vectorDistance == undefined)
			return Infinity;
		else if(vectorDistance > tmax)
			return Infinity;
		else
			return Math.round(vectorDistance);
	}
	collisionCheck(startX, startY, theta, tmax)
	{
		var image = this.controller.source.image;
		//Bound the sorter within the edges of the screen.
		var leftEdge = this.distanceTo(startX, startY, theta, 0, 0, Math.PI / 2, Infinity);
		var rightEdge = this.distanceTo(startX, startY, theta, image.width, 0, Math.PI / 2, Infinity);
		var topEdge = this.distanceTo(startX, startY, theta, 0, 0, 0, Infinity);
		var bottomEdge = this.distanceTo(startX, startY, theta, 0, image.height, 0, Infinity);
		tmax = Math.min(tmax, leftEdge, rightEdge, topEdge, bottomEdge);
		var sorters = this.controller.sorters;
		for(var sorter of sorters)
			tmax = Math.min(tmax, this.distanceTo(startX, startY, theta, sorter.x, sorter.y, sorter.theta, sorter.tmax));
		return tmax;
	}
	createMaxPixels(maxPixels, startX, startY, theta)
	{
		var tmax = this.collisionCheck(startX, startY, theta, maxPixels);
		if(tmax > 0)
		{
			var newSorter = new this.sorterType(this.controller.source.pixelmap, startX, startY, theta, tmax);
			this.controller.sorters.push(newSorter);
		}
	}
	createHueMatching(hueRange, startX, startY, theta)
	{
		
	}
	create(maxValue, startX, startY, theta)
	{
		if(this.boundsCheck(startX, startY))
			this.creationFunction(maxValue, startX, startY, theta);
	}
	constructor(controller)
	{
		this.controller = controller;
		this.sorterType = Sorter;
		this.creationFunction = this.createMaxPixels;
	}
}