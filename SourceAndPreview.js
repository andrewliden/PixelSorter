const MIN_HEIGHT = 100;
const HEIGHT_PADDING = 150;
const MIN_WIDTH = 100;
const WIDTH_PADDING = 50;
const DEFAULT_IMG = "default.jpg";

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
		var heightScale = targetHeight / this.source.image.height;
		var widthScale = targetWidth / this.source.image.width;
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

//Simplifies client interaction with the source & preview
// so that the two behave as one object.
// Also adds a cursor.
class SourcePreviewComposite
{
	constructor(container)
	{
		this.container = container;
		this.source = new Source(DEFAULT_IMG);
		//Create a div to put the preview in.
		this.previewContainer = document.createElement("div");
		this.previewContainer.setAttribute("id", "preview");
		this.container.appendChild(this.previewContainer);
		this.preview = new Preview(this.source, this.container);
		this.cursor = new Cursor(this.preview.context);
	}
	draw()
	{
		this.source.draw();
		this.preview.draw();
	}
	drawCursor(x, y, theta, length)
	{
		this.cursor.draw(x, y, theta, length);
	}
	setImage(src)
	{
		this.source.setImage(src);
	}
	getPixelmap()
	{
		return this.source.pixelmap;
	}
	getCanvas()
	{
		return this.preview.canvas;
	}
	getScale()
	{
		return this.preview.scale;
	}
	saveImage()
	{
		this.draw();
		var image = this.source.canvas.toDataURL();
		var imageDocument = window.open();
		imageDocument.document.title = "Pixelsorted image";
		var imageTag = imageDocument.document.createElement("img");
		imageTag.setAttribute("src", image);
		imageDocument.document.body.appendChild(imageTag);
	}
	rotate()
	{
		this.source.rotate();
	}
}