const MIN_HEIGHT = 100;
const HEIGHT_PADDING = 200;
const MIN_WIDTH = 100;
const WIDTH_PADDING = 50;

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
		this.scale = 1;
		/*
		var targetHeight = Math.max(window.innerHeight - HEIGHT_PADDING, MIN_HEIGHT);
		var targetWidth = Math.max(window.innerWidth - WIDTH_PADDING, MIN_WIDTH);
		this.scale = targetHeight / this.source.image.height;
		*/
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