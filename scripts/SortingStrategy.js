
//Abstract value retrieval strategy class.
class SortOnStrategy
{
	constructor(parentStrategy)
	{
		this.parentStrategy = parentStrategy;
	}
	getValue(pixel){}
}

class getLumaStrategy extends SortOnStrategy
{
	constructor(parentStrategy)
	{
		super(parentStrategy);
	}
	getValue(pixel)
	{
		return this.parentStrategy.pixelmap.getLuma(pixel);
	}
}

class getIntensityStrategy extends SortOnStrategy
{
	constructor(parentStrategy)
	{
		super(parentStrategy);
	}
	getValue(pixel)
	{
		return this.parentStrategy.pixelmap.getIntensity(pixel);
	}
}

class getValueStrategy extends SortOnStrategy
{
	constructor(parentStrategy)
	{
		super(parentStrategy);
	}
	getValue(pixel)
	{
		return this.parentStrategy.pixelmap.getValue(pixel);
	}
}

class getLightnessStrategy extends SortOnStrategy
{
	constructor(parentStrategy)
	{
		super(parentStrategy);
	}
	getValue(pixel)
	{
		return this.parentStrategy.pixelmap.getLightness(pixel);
	}
}

function createSortOnStrategy(sortingStrategy, methodName)
{
	switch(methodName)
	{
		case "Luma":
			return new getLumaStrategy(sortingStrategy);
		case "Intensity":
			return new getIntensityStrategy(sortingStrategy);
		case "Value":
			return new getValueStrategy(sortingStrategy);
		case "Lightness":
			return new getLightnessStrategy(sortingStrategy);
		default:
			return new getLumaStrategy(sortingStrategy);
	}
}

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
		this.sortOnStrategy = createSortOnStrategy(this, this.getValueMethod);
	}
	getValueToSortOn(pixel)
	{
		return this.sortOnStrategy.getValue(pixel);
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

class QuickSortWorker extends ComparisonSort
{
	constructor(pixelmap, ascending, getValueMethod, start, end)
	{
		super(pixelmap, ascending, getValueMethod);
		this.start = start;
		this.end = end;
	}
	partition(pixelList)
	{
		//Index of the rightmost element that is known
		//to belong on the left side. Starts at -1 (no such value exists yet)
		var i = this.start - 1;
		var pivot = pixelList[this.end];
		for(var j = this.start; j < this.end - 1; j++)
		{
			var possibleSwap = pixelList[j];
			if(this.pixelCompare(possibleSwap, pivot))
			{
				i++;
				this.pixelmap.swap(possibleSwap, pixelList[i]);
			}
		}
		this.pixelmap.swap(pixelList[i + 1], pivot);
		return (i + 1);
	}
	sort(pixelList)
	{
		var workers = [];
		if(this.start <= this.end)
		{
			var pivotIndex = this.partition(pixelList);
			workers.push(new QuickSortWorker(this.pixelmap, this.ascending, this.getValueMethod, this.start, pivotIndex - 1));
			workers.push(new QuickSortWorker(this.pixelmap, this.ascending, this.getValueMethod, pivotIndex + 1, this.end));
		}
		return workers;
	}
}

class QuickSort extends SortingStrategy
{
	constructor(pixelmap, ascending, getValueMethod)
	{
		super(pixelmap, ascending, getValueMethod);
		this.workers = [];
		this.firstRun = true;
	}
	sort(pixelList)
	{
		//On first run, add a quicksort worker for the whole list.
		if(this.firstRun)
		{
			this.workers.push(new QuickSortWorker(this.pixelmap, this.ascending, this.getValueMethod, 0, pixelList.length - 1));
			this.firstRun = false;
		}
		
		//If there are no workers, the sorting operation is complete.
		if(this.workers.length == 0)
			return false;
		else
		{
			//Make a temporary workers list of workers to add later.
			var workersToAdd = [];
			while(this.workers.length > 0)
			{
				//Get a worker from the list and sort it.
				//You'll get a list of new sorters from the quicksort worker.
				var worker = this.workers.pop();
				var workersFromQuicksort = worker.sort(pixelList);
				//Add the workers you got to the temporary list of workers to add.
				while(workersFromQuicksort.length > 0)
					workersToAdd.push(workersFromQuicksort.pop());
			}
			//Now that sorting is done for this frame, add the contents of the temporary workers list to the actual workers list.
			while(workersToAdd.length > 0)
				this.workers.push(workersToAdd.pop());

			return true;
		}
	}
}

class BucketSort extends SortingStrategy
{
	
}