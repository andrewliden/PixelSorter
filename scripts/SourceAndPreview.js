const MIN_HEIGHT = 100;
const HEIGHT_PADDING = 300;
const MIN_WIDTH = 100;
const WIDTH_PADDING = 50;
const DEFAULT_IMG = "media/default.jpg";
const LITE_MAX_MEGAPIXELS = 2.5;

//This class contains the actual image and ways for the user to interact with it.
class Source
{
	createPixelmap()
	{
		this.pixelmap = new PixelMap(this.context);
	}
	setImage(src)
	{
		//Create an image, a canvas, and a container for some image data.
		this.image = new Image();
		this.image.src = src;
		//Create a reference to this object for the image load event listener
		var selfReference = this;
		//Create a function for the image load event listener to use.
		this.image.onload = function()
		{
			var canvas = selfReference.canvas;
			var image = selfReference.image;
			var context = selfReference.context;
			canvas.width = image.width;
			canvas.height = image.height;
			context.drawImage(image, 0, 0);
			selfReference.createPixelmap();
		}
	}
	constructor(src)
	{
		this.setImage(src);
		this.canvas = document.createElement("canvas");
		this.context = this.canvas.getContext("2d");
		//Create a blank pixelmap at first.
		this.createPixelmap();
	}
	draw()
	{
		this.context.putImageData(this.pixelmap.imagedata, 0,0);
	}
	rotate()
	{
		this.pixelmap.rotate();
		var tempWidth = this.canvas.width;
		this.canvas.width = this.canvas.height;
		this.canvas.height = tempWidth;
	}
}

//This is a version of the source image that restricts photo sizes,
//In order to improve performance.
class SourceLite extends Source
{
	constructor(src)
	{
		super(src);
	}
	calculateMegapixels(image){ return image.width * image.height / 1000000; }
	setImage(src)
	{
		//Create an image, a canvas, and a container for some image data.
		this.image = new Image();
		this.image.src = src;
		//Create a reference to this object for the image load event listener
		var selfReference = this;
		//Create a function for the image load event listener to use.
		this.image.onload = function()
		{
			var canvas = selfReference.canvas;
			var image = selfReference.image;
			var context = selfReference.context;
			var megapixels = selfReference.calculateMegapixels(image);
			var scalar = 1;
			if(megapixels > LITE_MAX_MEGAPIXELS)
			{
				//If the number exceeds the megapixel limit, modify the scalar.
				var scalar = Math.sqrt(LITE_MAX_MEGAPIXELS / megapixels);
			}
			var width = Math.floor(image.width * scalar);
			var height = Math.floor(image.height * scalar);
			canvas.width = width;
			canvas.height = height;
			context.drawImage(image, 0, 0, width, height);
			selfReference.createPixelmap();
		}
	}
}

class Preview
{
	constructor(source, container)
	{
		this.source = source;
		this.container = container;
		this.canvas = document.createElement("canvas");
		container.appendChild(this.canvas);
		this.context = this.canvas.getContext("2d");
		this.scale = 1;
	}
	updateScale()
	{
		//Get the potential target width & height.
		var targetHeight = Math.max(window.innerHeight - HEIGHT_PADDING, MIN_HEIGHT);
		var targetWidth = Math.max(window.innerWidth - WIDTH_PADDING, MIN_WIDTH);
		//Figure out how much you'd need to scale if you were limited by height or width.
		var heightScale = targetHeight / this.source.canvas.height;
		var widthScale = targetWidth / this.source.canvas.width;
		//Take the smaller of the two possible scaling factors.
		this.scale = Math.min(heightScale, widthScale);
	}
	setDimensions()
	{
		this.updateScale();
		this.canvas.width = this.source.canvas.width * this.scale;
		this.canvas.height = this.source.canvas.height * this.scale;
	}
	draw()
	{
		this.setDimensions();
		//Draw the image from the source canvas onto this canvas.
		var canvas = this.canvas;
		var context = this.context;
		var image = this.source.canvas;
		context.drawImage(image, 0, 0, canvas.width, canvas.height);
	}
}

class Cursor
{
	constructor(context)
	{
		this.context = context;
	}
	draw(x, y, theta, length)
	{
		//Find the end point of the path.
		var finalX = x + Math.cos(theta) * length;
		var finalY = y + Math.sin(theta) * length;
		//Create a path, 
		//then make a line from the origin point to the final point.
		this.context.beginPath();
		this.context.moveTo(x, y);
		this.context.lineTo(finalX, finalY);
		//Put a thick white stroke, with a thinner black stroke.
		this.context.strokeStyle = "white";
		this.context.lineWidth = 4;
		this.context.stroke();
		this.context.strokeStyle = "black";
		this.context.lineWidth = 2;
		this.context.stroke();
	}
}