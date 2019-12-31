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
		this.inputBox = document.createElement("input");
		this.inputCanvas = document.createElement("canvas");
		this.subcontainer = document.createElement("div");
		this.subcontainer.setAttribute("id", "angleinput");
		//Put the subcontainer inside the container.
		this.container.appendChild(this.subcontainer);
		//Put the canvas & input box inside the subcontainer.
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

class SliderInput
{
	createElements()
	{
		this.label = document.createElement("label");
		this.labeltextNode = document.createTextNode(this.labeltext);
		this.input = document.createElement("input");
		input.setAttribute("type", "range");
		input.setAttribute("min", "0");
		input.setAttribute("max", this.max);
		
	}
	constructor(container, labeltext, max)
	{
		this.max = max;
		this.container = container;
		this.labeltext = labeltext;
		this.createElements();
	}
}

class Toolbox
{
	constructor(container)
	{
		this.container = container;
		//Create a div to put the inputs in.
		this.inputsContainer = document.createElement("div");
		this.inputsContainer.setAttribute("id", "inputs");
		this.container.appendChild(this.inputsContainer);
		this.angleInput = new AngleInput(this.inputsContainer);
	}
	getAngle(){ return this.angleInput.theta; }
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