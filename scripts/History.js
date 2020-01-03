//Problem with this design:
// The "rotate" method changes the index of every pixel.
// The best fix I could think of is to rotate each history object,
// but it's a bit expensive...

const HISTORY_LENGTH = 4;

class AbstractHistoryNode
{
	constructor(pixelmap)
	{
		this.pixelmap = pixelmap;
		this.data = new Uint8ClampedArray(this.pixelmap.data.length);
		
	}
	restoreState()
	{
		this.pixelmap.data.set(this.data);
	}
	rotate(width, height)
	{
		var replacement = new Uint8ClampedArray(this.pixelmap.data.length);
		//For each pixel, copy the image data.
		for(var y = 0; y <= height; y++)
		{
			for(var x = 0; x <= width; x++)
			{
				//Get the index of the pixel you want to copy.
				var originalIndex = this.pixelmap.getPixel(x, y);
				//Get the new location of that pixel, then calculate its new index.
				var newX = height - y;
				var newY = x;
				var newIndex = newY * height * 4;
				newIndex += newX * 4;
				//copy the pixel data.
				for(var i = 0; i < 4; i++)
					replacement[newIndex + i] = this.data[originalIndex + i];
			}
		}
		//Replace the data.
		this.data.set(replacement);
	}
}

class HistoryStackBottom extends AbstractHistoryNode
{
	constructor(pixelmap)
	{
		super(pixelmap);
		this.data.set(this.pixelmap.data);
	}
}

class HistoryNode extends AbstractHistoryNode
{
	constructor(pixelmap)
	{
		super(pixelmap);
	}
	recordState()
	{
		this.data.set(this.pixelmap.data);
	}
}

class HistoryStack
{
	constructor(pixelmap)
	{
		//Create a link to the pixel map.
		this.pixelmap = pixelmap;
		//Create an array to keep track of history items.
		this.historyStack = new Array(HISTORY_LENGTH);
		//Initialize the nodes of the array.
		for(var i = 0; i < this.historyStack.length; i++)
			this.historyStack[i] = new HistoryNode(this.pixelmap);
		//Create a stack bottom, which contains the original image.
		this.stackBottom = new HistoryStackBottom(this.pixelmap);
		//Keep track of the size of the stack, and the index of the top.
		this.topIndex = -1;
		this.size = 0;
	}
	recordState()
	{
		//Increment the top index by 1.  If it goes outside the max size,
		//Go back to the start.  You might overwrite something.  That's okay.
		this.topIndex += 1;
		if(this.topIndex >= this.historyStack.length)
			this.topIndex = 0;
		//If the size isn't exceeding the max, increment it.
		if(this.size < this.historyStack.length)
			this.size += 1;
		//Record the state of the pixel map.
		this.historyStack[this.topIndex].recordState();
	}
	restoreState()
	{
		//Only attempt to restore state if the stack is non-empty.
		if(this.size > 0)
		{
			//Decrement the size of the stack and move the top index.
			this.size -= 1;
			this.topIndex -= 1;
			if(this.topIndex < 0)
				this.topIndex = this.historyStack.length - 1;
			//If, after decrementing the size of the stack, it is empty,
			//restore the state from the stack bottom.  Otherwise, use the current top of stack.
			if(this.size == 0)
				this.stackBottom.restoreState()
			else
				this.historyStack[this.topIndex].restoreState();
		}
	}
	rotate()
	{
		var oldWidth = this.pixelmap.context.canvas.width;
		var oldHeight = this.pixelmap.context.canvas.height;
		//Rotate the stack bottom.
		this.stackBottom.rotate(oldWidth, oldHeight)
		//Rotate all of the relevant entries on the stack.
		for(var i = 0; i < this.size; i++)
		{
			var index = this.topIndex - i;
			if(index < 0)
				index = this.historyStack.length - index;
			this.historyStack[i].rotate(oldWidth, oldHeight);
		}
	}
}