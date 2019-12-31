///This is a wrapper around the javascript "imagedata" object, which is a bit clunky to work with.
//It gets a canvas, then creates an image data object.
class PixelMap
{
	updateImageData()
	{
		this.imagedata = this.context.getImageData(0, 0, this.context.canvas.width, this.context.canvas.height);
		this.data = this.imagedata.data;
		//Maintain a list of busy pixels.
		//This list only needs to be 1/4 the size of the image data,
		//since it's only storing a boolean value, not RGBA data.
		this.busy = new Int8Array(this.data.length / 4);
	}
	constructor(context)
	{
		this.context = context;
		this.updateImageData();
	}
	//getPixel returns the index of the red pixel at the given x,y pair.
	getPixel(x, y)
	{
		x = Math.floor(x);
		y = Math.floor(y);
		var index = y * this.imagedata.width * 4;
		index += x * 4;
		return index;
	}
	getHue(redIndex)
	{
		//Calculate the y and x values for the hue.
		var y = Math.sqrt(3) * (this.data[redIndex + 1] - this.imageData.data[redIndex + 2]);
		var x = 2 * this.data[redIndex] - this.data[redIndex + 1] - this.data[redIndex + 2];
		//Get the hue in radians.
		var hue = Math.atan2(y,x);
		//Convert to degrees.
		hue *= 180 / Math.PI;
		if(hue < 0)
		{
			hue += 360;
		}
		return hue;
	}
	getIntensity(redIndex)
	{
		return (1/3) * (this.data[redIndex] + this.data[redIndex + 1] + this.data[redIndex + 2]);
	}
	getValue(redIndex)
	{
		return Math.max(this.data[redIndex], this.data[redIndex + 1], this.data[redIndex + 2]);
	}
	getLightness(redIndex)
	{
		var max = Math.max(this.data[redIndex], this.data[redIndex + 1], this.data[redIndex + 2]);
		var min = Math.min(this.data[redIndex], this.data[redIndex + 1], this.data[redIndex + 2]);
		return 0.5 * (max + min);
	}
	getLuma(redIndex)
	{
		return 0.2126 * this.data[redIndex] + 0.7152 * this.data[redIndex + 1] + 0.0722 * this.data[redIndex + 2];
	}
	swap(redIndex, otherRedIndex)
	{
		var tempRed = this.data[redIndex];
		var tempGreen = this.data[redIndex + 1];
		var tempBlue = this.data[redIndex + 2];
		var tempAlpha = this.data[redIndex + 3];
		this.data[redIndex] = this.data[otherRedIndex];
		this.data[redIndex + 1] = this.data[otherRedIndex + 1];
		this.data[redIndex + 2] = this.data[otherRedIndex + 2];
		this.data[redIndex + 3] = this.data[otherRedIndex + 3];
		this.data[otherRedIndex] = tempRed;
		this.data[otherRedIndex + 1] = tempGreen;
		this.data[otherRedIndex + 2] = tempBlue;
		this.data[otherRedIndex + 3] = tempAlpha;
	}
	swapAt(x1, y1, x2, y2)
	{
		x1 = Math.floor(x1);
		x2 = Math.floor(x2);
		y1 = Math.floor(y1);
		y2 = Math.floor(y2);
		var pixel1 = this.getPixel(x1, y1);
		var pixel2 = this.getPixel(x2, y2);
		this.swap(pixel1, pixel2);
	}
	isBusy(redIndex)
	{
		var result = this.busy[redIndex / 4];
		if(result == true)
			return true;
		else
			return false;
	}
	setBusy(redIndex)
	{
		this.busy[redIndex / 4] = true;
	}
	setNotBusy(redIndex)
	{
		this.busy[redIndex / 4] = false;
	}
	rotate()
	{
		var oldWidth = this.context.canvas.width;
		var oldHeight = this.context.canvas.height;
		var replacement = this.context.createImageData(oldHeight, oldWidth);
		//For each pixel, copy the image data.
		for(var y = 0; y < this.context.canvas.height; y++)
		{
			for(var x = 0; x < this.context.canvas.width; x++)
			{
				var originalIndex = this.getPixel(x, y);
				var newX = oldHeight - y;
				var newY = x;
				var newIndex = newY * replacement.width * 4;
				newIndex += newX * 4;
				replacement.data[newIndex] = this.data[originalIndex];
				replacement.data[newIndex + 1] = this.data[originalIndex + 1];
				replacement.data[newIndex + 2] = this.data[originalIndex + 2];
				replacement.data[newIndex + 3] = this.data[originalIndex + 3];
			}
		}
		//Replace the image data, then reinitialize the busy-pixel array.
		this.imagedata = replacement;
		this.data = replacement.data;
		this.busy = new Int8Array(this.data.length / 4);
	}
}