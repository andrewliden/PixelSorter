///This is a wrapper around the javascript "imagedata" object, which is a bit clunky to work with.
//It gets a canvas, then creates an image data object.
class PixelMap
{
	updateImageData()
	{
		this.imagedata = this.context.getImageData(0, 0, this.context.canvas.width, this.context.canvas.height);
		this.data = this.imagedata.data;
	}
	constructor(context)
	{
		this.context = context;
		this.updateImageData();
	}
	//getPixel returns the index of the red pixel at the given x,y pair.
	getPixel(x, y)
	{
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
		var pixel1 = this.getPixel(x1, y1);
		var pixel2 = this.getPixel(x2, y2);
		this.swap(pixel1, pixel2);
	}
}

//The pixel class stores RGB pixels and allows the user to perform some basic methods,
//such as retrieving their hue, intensity, etc.
//Formulas retrieved from wikipedia.
class Pixel
{
	setComponents(red, green, blue, alpha)
	{
		this.red = red; this.green = green; this.blue = blue; this.alpha = alpha;
	}
	constructor(red, green, blue, alpha)
	{
		this.setComponents(red, green, blue, alpha);
	}
	getHue()
	{
		//Calculate the y and x values for the hue.
		var y = Math.sqrt(3) * (this.green - this.blue);
		var x = 2 * this.red - this.green - this.blue;
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
	getIntensity()
	{
		return (1/3) * (this.red + this.green + this.blue);
	}
	getValue()
	{
		return Math.max(this.red, this.green, this.blue);
	}
	getLightness()
	{
		var max = Math.max(this.red, this.green, this.blue);
		var min = Math.min(this.red, this.green, this.blue);
		return 0.5 * (max + min);
	}
	getLuma()
	{
		return 0.2126 * this.red + 0.7152 * this.green + 0.0722 * this.blue;
	}
	
}

class FastPixel
{
	constructor(imageData, x, y)
	{
		this.imageData = imageData;
		this.redIndex = y * imageData.width * 4;
		this.redIndex += x * 4;
	}
	getRed(){ return this.imageData.data[this.redIndex]; }
	getGreen(){ return this.imageData.data[this.redIndex + 1]; }
	getBlue(){ return this.imageData.data[this.redIndex + 2]; }
	getAlpha(){ return this.imageData.data[this.redIndex + 3]; }
	setRed(red){ this.imageData.data[this.redIndex] = red; }
	setGreen(green){ this.imageData.data[this.redIndex + 1] = green; }
	setBlue(blue){ this.imageData.data[this.redIndex + 2] = blue; }
	setAlpha(alpha){ this.imageData.data[this.redIndex + 3] = alpha; }
	swapWith(otherPixel)
	{
		var tempRed = this.imageData.data[this.redIndex];
		var tempGreen = this.imageData.data[this.redIndex + 1];
		var tempBlue = this.imageData.data[this.redIndex + 2];
		var tempAlpha = this.imageData.data[this.redIndex + 3];
		this.imageData.data[this.redIndex] = otherPixel.imageData.data[otherPixel.redIndex];
		this.imageData.data[this.redIndex + 1] = otherPixel.imageData.data[otherPixel.redIndex + 1];
		this.imageData.data[this.redIndex + 2] = otherPixel.imageData.data[otherPixel.redIndex + 2];
		this.imageData.data[this.redIndex + 3] = otherPixel.imageData.data[otherPixel.redIndex + 3];
		otherPixel.imageData.data[otherPixel.redIndex] = tempRed;
		otherPixel.imageData.data[otherPixel.redIndex + 1] = tempGreen;
		otherPixel.imageData.data[otherPixel.redIndex + 2] = tempBlue;
		otherPixel.imageData.data[otherPixel.redIndex + 3] = tempAlpha;
	}
	getHue()
	{
		//Calculate the y and x values for the hue.
		var y = Math.sqrt(3) * (this.imageData.data[this.redIndex + 1] - this.imageData.data[this.redIndex + 2]);
		var x = 2 * this.imageData.data[this.redIndex] - this.imageData.data[this.redIndex + 1] - this.imageData.data[this.redIndex + 2];
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
	getIntensity()
	{
		return (1/3) * (this.imageData.data[this.redIndex] + this.imageData.data[this.redIndex + 1] + this.imageData.data[this.redIndex + 2]);
	}
	getValue()
	{
		return Math.max(this.imageData.data[this.redIndex], this.imageData.data[this.redIndex + 1], this.imageData.data[this.redIndex + 2]);
	}
	getLightness()
	{
		var max = Math.max(this.imageData.data[this.redIndex], this.imageData.data[this.redIndex + 1], this.imageData.data[this.redIndex + 2]);
		var min = Math.min(this.imageData.data[this.redIndex], this.imageData.data[this.redIndex + 1], this.imageData.data[this.redIndex + 2]);
		return 0.5 * (max + min);
	}
	getLuma()
	{
		return 0.2126 * this.imageData.data[this.redIndex] + 0.7152 * this.imageData.data[this.redIndex + 1] + 0.0722 * this.imageData.data[this.redIndex + 2];
	}
}

//External functions for pixel values.

function calculateHue(red, green, blue)
{
	//Calculate the y and x values for the hue.
	var y = Math.sqrt(3) * (green - blue);
	var x = 2 * red - green - blue;
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

function calculateIntensity(red, green, blue)
{
	return (1/3) * (red + green + blue);
}

function calculateValue(red, green, blue)
{
	return Math.max(red, green, blue);
}

function calculateLightness(red,green, blue)
{
	var max = Math.max(red, green, blue);
	var min = Math.min(red, green, blue);
	return 0.5 * (max + min);
}

function calculateLuma(red, green, blue)
{
	return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}