
//Encapsulates touch & mouse behaviors into one object
//Calls "click" on the owner when a pointer input happens.
//keeps track of important stats such as x & y values and movement values.
class PointerListener
{
	mouseInput(event)
	{
		this.x = event.offsetX;
		this.y = event.offsetY;
		this.dx = event.movementX;
		this.dy = event.movementY;
		if(event.buttons == 1)
		{
			this.owner.click();
		}
	}
	touchInput(event)
	{
		
	}
	constructor(owner, htmlElement)
	{
		//owner:		some javascript object.
		//htmlElement:	some html element to attach the event listener to.
		this.owner = owner;
		this.htmlElement = htmlElement;
		//Create a variable that refers to this object
		//to make sure the event listener functions use 
		var selfReference = this;
		this.mouseListenFunction = function(event)
		{
			selfReference.mouseInput(event);
		}
		this.touchListenFunction = function(event)
		{
			selfReference.touchInput(event);
			event.preventDefault();
		}
		htmlElement.addEventListener("mousedown", this.mouseListenFunction);
		htmlElement.addEventListener("mousemove", this.mouseListenFunction);
		this.x = 0;
		this.y = 0;
		this.dx = 0;
		this.dy = 0;
	}
	
}

class ConfigurationInput
{
	constructor(initConfig)
	{
		this.config = initConfig;
	}
	getValue(){ return this.config; }
}

class AngleInput extends ConfigurationInput
{
	constructor(container)
	{
		super(90);
		
	}
}