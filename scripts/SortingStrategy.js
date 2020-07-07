//Abstract sorting strategy class.
//Gets a reference to the pixel map,
//Whether to sort in ascending or descending order,
//and what method to use to retrieve values for each pixel.
class SortingStrategy
{
	constructor(pixelmap, ascending, getValueMethod)
	{
		this.pixelmap = pixelmap;
		this.ascending = ascending;
		this.getValueMethod = getValueMethod;
	}
	getValueToSortOn(pixel)
	{
		switch(this.getValueMethod)
		{
			case "Luma":
				return this.pixelmap.getLuma(pixel);
			case "Intensity":
				return this.pixelmap.getIntensity(pixel);
			case "Value":
				return this.pixelmap.getValue(pixel);
			case "Lightness":
				return this.pixelmap.getLightness(pixel);
			default:
				return this.pixelmap.getLuma(pixel);
		}
	}
	sort(pixelList)
	{
		return true;
	}
}

class ComparisonSort extends SortingStrategy
{
	constructor(pixelmap, ascending, getValueMethod)
	{
		super(pixelmap, ascending, getValueMethod);
	}
	pixelCompare(pixel1, pixel2)
	{
		//Returns true if a swap should be performed, and false if it should not be performed.
		//Pixel 1 is assumed to come up earlier in the list than pixel 2.
		if(this.ascending)
			return this.getValueToSortOn(pixel1) < this.getValueToSortOn(pixel2);
		else
			return this.getValueToSortOn(pixel1) > this.getValueToSortOn(pixel2);
	}
}

class BubbleSort extends ComparisonSort
{
	constructor(pixelmap, ascending, getValueMethod)
	{
		super(pixelmap, ascending, getValueMethod);
	}
	sort(pixelList)
	{
		var swapPerformed = false;
		for(var t = 1; t < pixelList.length; t++)
		{
			var current = pixelList[t];
			var prev = pixelList[t - 1];
			if(this.pixelCompare(current, prev))
			{
				this.pixelmap.swap(current, prev);
				swapPerformed = true;
			}
		}
		return swapPerformed;
	}
}

class InsertionSort extends ComparisonSort
{
	constructor(pixelmap, ascending, getValueMethod)
	{
		super(pixelmap, ascending, getValueMethod);
		this.sortedListStartIndex = 0;
	}
	sort(pixelList)
	{
		if(this.sortedListStartIndex == pixelList.length - 1)
		{
			return false;
		}
		else
		{
			var pixelToInsert = pixelList[this.sortedListStartIndex + 1];
			for(var i = this.sortedListStartIndex; i >= 0; i--)
			{
				var possibleSwap = pixelList[i];
				if(this.pixelCompare(pixelToInsert, possibleSwap))
				{
					this.pixelmap.swap(pixelToInsert, possibleSwap);
					pixelToInsert = pixelList[i];
				}
				else
					break;
			}
			this.sortedListStartIndex++;
			return true;
		}
	}
	
}

class SelectionSort extends ComparisonSort
{
	constructor(pixelmap, ascending, getValueMethod)
	{
		super(pixelmap, ascending, getValueMethod);
		this.numSorted = 0;
	}
	sort(pixelList)
	{
		//Return false to end sorting if the number of sorted entries is 1 less than the list length.
		if(this.numSorted == pixelList.length - 1)
			return false;
		else
		{
			var pixelToReplace = pixelList[this.numSorted];
			var replacement = pixelToReplace;
			for(var t = this.numSorted + 1; t < pixelList.length; t++)
			{
				var possibleReplacement = pixelList[t];
				if(this.pixelCompare(possibleReplacement, replacement))
					replacement = possibleReplacement;
			}
			this.pixelmap.swap(pixelToReplace, replacement);
			this.numSorted++;
			return true;
		}
	}
}