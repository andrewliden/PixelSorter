//Abstract interface intended to simplify
//client interaction with the source & preview
// so that the two behave as one object.
// Also adds a cursor.
//To use, create a derived class that defines the source, preview, and cursor.
class BaseImageInterface
{
	constructor(container)
	{
		this.container = container;
		this.source;
		this.preview;
		this.cursor;
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
	
	getPixelmap(){ return this.source.pixelmap; }
	getCanvas(){ return this.preview.canvas; }
	getPreviewContainer(){return this.preview.container; }
	getScale(){ return this.preview.scale; }
	getWidth(){ return this.source.canvas.width; }
	getHeight(){ return this.source.canvas.height; }
	setImage(src)
	{ 
		this.source.setImage(src); 
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
	saveUndoState()
	{
		this.source.pixelmap.recordUndoState();
	}
	undo()
	{
		this.source.pixelmap.undo();
	}
}