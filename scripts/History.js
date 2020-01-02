//Problem with this design:
// The "rotate" method changes the index of every pixel.

const HISTORY_LENGTH = 5;

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
		this.changed = new Array();
	}
	restoreState()
	{
		for(var changeIndex of this.changed)
		{
			for(var i = 0; i < 4; i++)
				this.pixelmap.data[changeIndex + i] = this.data[changeIndex + i];
			
		}
	}
	recordState()
	{
		this.changed = new Array();
		var changed = this.pixelmap.getChangelist()
		while(changes.length > 0)
		{
			var changeIndex = changed.pop();
			this.changed.push(changeIndex);
			//Copy the red, green, blue and alpha pixels that were changed.
			for(var i = 0; i < 4; i++)
				this.data[changeIndex + i] = this.pixelmap.data[changeIndex + i];
		}
	}
}

class HistoryStack
{
	constructor(pixelmap)
	{
		this.pixelmap = pixelmap;
		this.history = new Array(HISTORY_LENGTH);
		this.stackBottom = new HistoryStackBottom(this.pixelmap);
		for(var i = 0; i < this.history.length; i++)
			this.history[i] = new HistoryNode(this.pixelmap);
	}
}