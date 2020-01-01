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
	//Touchstart is the same as touchInput, but dx is set to 0.
	//This is a bad design (don't repeat yourself).
	touchStart(event)
	{
		//Only perform clicks on single-touch.
		if(event.targetTouches.length == 1)
		{
			var touch = event.targetTouches[0];
			var boundingRect = event.target.getBoundingClientRect();
			var offsetX = touch.pageX - boundingRect.left;
			var offsetY = touch.pageY - boundingRect.top;
			this.dx = 0;
			this.dy = 0;
			this.x = offsetX;
			this.y = offsetY;
			this.owner.click();
		}
	}
	touchInput(event)
	{
		//Only perform clicks on single-touch.
		if(event.targetTouches.length == 1)
		{
			var touch = event.targetTouches[0];
			var boundingRect = event.target.getBoundingClientRect();
			var offsetX = touch.pageX - boundingRect.left;
			var offsetY = touch.pageY - boundingRect.top;
			this.dx = this.x - offsetX;
			this.dy = this.y - offsetY;
			this.x = offsetX;
			this.y = offsetY;
			this.owner.click();
		}
		
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
		this.touchStartListenFunction = function(event)
		{
			selfReference.touchStart(event);
			event.preventDefault();
		}
		htmlElement.addEventListener("mousedown", this.mouseListenFunction);
		htmlElement.addEventListener("mousemove", this.mouseListenFunction);
		htmlElement.addEventListener("touchstart", this.touchStartListenFunction);
		htmlElement.addEventListener("touchmove", this.touchListenFunction);
		this.x = 0;
		this.y = 0;
		this.dx = 0;
		this.dy = 0;
	}
	
}

class AngleInput
{
	getDegrees(){ return this.theta * 180 / Math.PI; }
	getRadians(){ return this.theta; }
	setDegrees(degrees){ this.theta = degrees * Math.PI / 180; }
	setRadians(radians){ this.theta = radians; }
	updateInputBox()
	{
		this.inputBox.value = this.getDegrees();
	}
	draw()
	{
		var center = this.inputCanvas.width / 2
		var radius = center - 5;
		//clear the drawing.
		this.context.clearRect(0,0,this.inputCanvas.width,this.inputCanvas.height);
		//draw a circle.
		this.context.beginPath();
		this.context.arc(center, center, radius, 0, Math.PI * 2);
		//Draw a line indicating the direction.
		this.context.moveTo(center, center);
		this.context.lineTo(center + radius * Math.cos(this.theta), center + radius * Math.sin(this.theta));
		this.context.stroke();
	}
	click()
	{
		var center = this.inputCanvas.width / 2
		var y = this.pointerListener.y - center;
		var x = this.pointerListener.x - center;
		this.theta = Math.atan2(y,x);
		this.draw();
		this.updateInputBox();
	}
	createInputBoxListener()
	{
		var selfReference = this;
		this.updateFromInputBox = function(event)
		{
			selfReference.setDegrees(selfReference.inputBox.value);
			selfReference.draw();
		}
		this.inputBox.addEventListener("input", this.updateFromInputBox);
	}
	constructor(container)
	{
		this.container = container;
		//Create HTML elements.
		this.label = document.createElement("label");
		this.labeltextNode = document.createTextNode("Angle (deg)");
		this.inputBox = document.createElement("input");
		this.inputBox.setAttribute("type", "number");
		this.inputCanvas = document.createElement("canvas");
		this.subcontainer = document.createElement("div");
		this.subcontainer.setAttribute("id", "angleinput");
		//Put the subcontainer inside the container.
		this.container.appendChild(this.subcontainer);
		//Put the canvas & input box inside the subcontainer.
		this.label.appendChild(this.labeltextNode);
		this.subcontainer.appendChild(this.label);
		this.subcontainer.appendChild(this.inputCanvas);
		this.subcontainer.appendChild(this.inputBox);
		//Start setting up the canvas.
		this.context = this.inputCanvas.getContext("2d");
		this.inputCanvas.width = 100;
		this.inputCanvas.height = 100;
		this.theta = Math.PI / 2;
		this.pointerListener = new PointerListener(this, this.inputCanvas);
		this.createInputBoxListener();
		this.draw();
		this.updateInputBox();
	}
}

//Boilerplate slider input with a text box for specific values.
class SliderInput
{
	createElements()
	{
		//Create the elements
		this.subcontainer = document.createElement("div");
		this.label = document.createElement("label");
		this.labeltextNode = document.createTextNode(this.labeltext);
		this.inputSlider = document.createElement("input");
		this.inputBox = document.createElement("input");
		//Define attributes.
		this.inputSlider.setAttribute("type", "range");
		this.inputSlider.setAttribute("min", "0");
		this.inputSlider.setAttribute("max", this.max);
		this.inputBox.setAttribute("type", "number");
		//Append all of the elements into the container.
		this.container.appendChild(this.subcontainer);
		this.subcontainer.appendChild(this.label);
		this.label.appendChild(this.labeltextNode);
		this.subcontainer.appendChild(this.inputSlider);
		this.subcontainer.appendChild(this.inputBox);
		this.inputBox.value = this.value;
		this.inputSlider.value = this.value;
	}
	createListeners()
	{
		//Get a reference to this object to avoid weird event-listener scope resolution.
		var selfReference = this;
		this.updateValueFromSlider = function()
		{
			selfReference.value = selfReference.inputSlider.value;
			selfReference.inputBox.value = selfReference.value;
		}
		this.updateValueFromBox = function()
		{
			//Clamp the value from the input box.
			if(selfReference.inputBox.value < 0)
				selfReference.inputBox.value = 0;
			else if(selfReference.inputBox.value > selfReference.max)
				selfReference.inputBox.value = selfReference.max;
			selfReference.value = selfReference.inputBox.value;
			selfReference.inputSlider.value = selfReference.value;
		}
		this.inputSlider.addEventListener("input", this.updateValueFromSlider);
		this.inputBox.addEventListener("input", this.updateValueFromBox);
	}
	constructor(container, labeltext, initialValue, max)
	{
		this.max = max;
		this.container = container;
		this.labeltext = labeltext;
		this.value = initialValue;
		this.createElements();
		this.createListeners();
	}
	updateMax(newMax)
	{
		this.max = newMax;
		this.inputSlider.setAttribute("max", this.max);
		if(this.value > this.max)
		{
			this.value = this.max;
			this.inputBox.value = this.max;
			this.inputSlider.value = this.max;
		}
	}
	getValue(){ return parseFloat(this.value); }
}

class LengthSlider extends SliderInput
{
	constructor(container, max)
	{
		super(container, "Sorter Length", 100, max)
	}
}

class HueSlider extends SliderInput
{
	constructor(container)
	{
		super(container, "Hue Threshold", 60, 180);
	}
}

class ImageUpload
{
	constructor(container)
	{
		
	}
}

class ImageSave
{
	constructor(container)
	{
		
	}
}

class ImageRotate
{
	constructor(container)
	{
		
	}
}