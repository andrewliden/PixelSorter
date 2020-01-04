const ANGLEINPUT_LINE_COLOR = "white";
const ANGLEINPUT_LINE_WIDTH = 3;

//Encapsulates touch & mouse behaviors into one object
//Calls "click" on the owner when a pointer input happens.
//keeps track of important stats such as x & y values and movement values.
class PointerListener
{
	mouseInput(event)
	{
		var boundingRect = this.inputCanvas.getBoundingClientRect();
		this.x = event.pageX - boundingRect.left;
		this.y = event.pageY - boundingRect.top;
		this.dx = event.movementX;
		this.dy = event.movementY;
		this.clicking = true;
		if(event.buttons == 1)
		{
			this.owner.click();
			this.clicking = true;
		}
		else
			this.clicking = false;
	}
	//Touchstart is the same as touchInput, but dx is set to 0.
	//This is a bad design (don't repeat yourself).
	touchStart(event)
	{
		//Only perform clicks on single-touch.
		if(event.targetTouches.length == 1)
		{
			var touch = event.targetTouches[0];
			var boundingRect = this.inputCanvas.getBoundingClientRect();
			var offsetX = touch.pageX - boundingRect.left;
			var offsetY = touch.pageY - boundingRect.top;
			this.dx = 0;
			this.dy = 0;
			this.x = offsetX;
			this.y = offsetY;
			this.clicking = true;
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
			this.clicking = true;
			this.owner.click();
		}
		
	}
	constructor(owner, inputTarget, inputCanvas)
	{
		//owner:		some javascript object.
		//inputTarget:	The target of the event listener
		//inputCanvas:	The canvas we're working in.
		this.owner = owner;
		this.inputTarget = inputTarget;
		this.inputCanvas = inputCanvas;
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
		this.endClick = function(event)
		{
			selfReference.clicking = false;
		}
		inputTarget.addEventListener("mousedown", this.mouseListenFunction);
		inputTarget.addEventListener("mousemove", this.mouseListenFunction);
		inputTarget.addEventListener("touchstart", this.touchStartListenFunction);
		inputTarget.addEventListener("touchmove", this.touchListenFunction);
		inputTarget.addEventListener("mouseup", this.endclick);
		inputTarget.addEventListener("touchend", this.endclick);
		inputTarget.addEventListener("touchcancel", this.endclick);
		this.x = 0;
		this.y = 0;
		this.dx = 0;
		this.dy = 0;
		this.clicking = false;
	}
	
}

class AngleInput
{
	getDegrees(){ return this.theta * 180 / Math.PI; }
	getRadians(){ return this.theta; }
	setDegrees(degrees){ this.theta = degrees * Math.PI / 180; }
	setRadians(radians){ this.theta = radians; }
	addDegrees(degrees)
	{
		this.theta += degrees * Math.PI / 180;
		this.updateInputBox();
		this.draw();
	}
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
		this.labeltextNode = document.createTextNode("Angle");
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
		this.context.strokeStyle = ANGLEINPUT_LINE_COLOR;
		this.context.lineWidth = ANGLEINPUT_LINE_WIDTH;
		this.theta = Math.PI / 2;
		this.pointerListener = new PointerListener(this, this.inputCanvas, this.inputCanvas);
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
	uploadFile()
	{
		var file = this.input.files[0];
		this.controller.loadImage(file);
	}
	constructor(container, controller)
	{
		this.container = container;
		this.controller = controller;
		this.input = document.createElement("input");
		this.input.setAttribute("type", "file");
		this.input.setAttribute("id", "file");
		this.label = document.createElement("label");
		this.labeltext = document.createTextNode("Load Image");
		this.label.setAttribute("for", "file");
		this.label.appendChild(this.labeltext);
		this.container.appendChild(this.input);
		this.container.appendChild(this.label);
		var selfReference = this;
		this.input.addEventListener("input", function(){ selfReference.uploadFile(); });
	}
	
}

class Button
{
	action()
	{
		
	}
	constructor(container, text, id)
	{
		this.container = container;
		this.controller = controller;
		this.button = document.createElement("button");
		this.button.setAttribute("id", id);
		this.text = document.createTextNode(text);
		this.button.appendChild(this.text);
		this.container.appendChild(this.button);
		var selfReference = this;
		this.button.addEventListener("click", function(){ selfReference.action(); });
	}
}

class ImageSave extends Button
{
	action()
	{
		this.controller.saveImage();
	}
	constructor(container, controller)
	{
		super(container, "Save", "saveimage");
		this.controller = controller;
	}
}

class ImageRotate extends Button
{
	action()
	{
		this.controller.rotate();
	}
	constructor(container, controller)
	{
		super(container, "Rotate", "rotateimage");
		this.controller = controller;
	}
}

class Undo extends Button
{
	action()
	{
		this.controller.undo();
	}
	constructor(container, controller)
	{
		super(container, "Undo", "undo");
		this.controller = controller;
	}
}

class StopSorting extends Button
{
	action()
	{
		this.controller.clearSortsAndBusymap();
	}
	constructor(container, controller)
	{
		super(container, "Stop Sorting", "stopsort");
		this.controller = controller;
	}
}

class Dropdown
{
	action()
	{
		
	}
	constructor(container, id, labeltext)
	{
		this.container = container;
		this.controller = controller;
		this.subcontainer = document.createElement("div");
		this.container.appendChild(this.subcontainer);
		this.label = document.createElement("label");
		this.labeltextNode = document.createTextNode(labeltext);
		this.label.appendChild(this.labeltextNode);
		this.subcontainer.appendChild(this.label);
		this.input = document.createElement("select");
		this.input.setAttribute("id", id);
		this.subcontainer.appendChild(this.input);
		var selfReference = this;
		this.input.addEventListener("change", function(){ selfReference.action(); });
	}
	addOption(text, value)
	{
		var option = document.createElement("option");
		var textNode = document.createTextNode(text);
		option.setAttribute("value", value);
		option.appendChild(textNode);
		this.input.appendChild(option);
	}
	getValue(){ return this.input.value; }
}

class SorterSelector extends Dropdown
{
	action()
	{
		this.controller.setSorterType(this.getValue());
	}
	constructor(container, controller)
	{
		super(container, "sorterselector", "Sorter Type");
		this.controller = controller;
		//This approach isn't particularly scaleable.
		//It might be an area to consider improving.
		var sorterTypes = ["Luma", "Lightness", "Value", "Intensity", "Luma (Descending)", "Lightness (Descending)", "Value (Descending)", "Intensity (Descending)", "Star"];
		for(var type of sorterTypes)
			this.addOption(type, type);
	}
}

//Abstract hotkey class.
class Hotkey
{
	activate(event)
	{
		
	}
	constructor()
	{
		
	}
}

//Abstract wheel hotkey class.
class WheelHotkey extends Hotkey
{
	constructor()
	{
		super();
		var selfReference = this;
		document.addEventListener("wheel", function(event){ selfReference.activate(event); } );
	}
}

class AddAngleHotkey extends WheelHotkey
{
	activate(event)
	{
		//Should add a degree every mousewheel movement.
		this.angleInput.addDegrees(event.deltaY / 100);
		//Simulate a click.
		this.controller.click();
	}
	constructor(angleInput, controller)
	{
		super();
		this.angleInput = angleInput;
		this.controller = controller;
	}
}

class KeyboardHotkey extends Hotkey
{
	constructor()
	{
		super();
		var selfReference = this;
		document.addEventListener("keydown", function(event){ selfReference.activate(event); } );
	}
}

class StopSortingHotkey extends KeyboardHotkey
{
	activate(event)
	{
		//Simulate clicking the stop sorting button.
		if(event.code == "Space")
		{
			this.controller.clearSortsAndBusymap();
		}
	}
	constructor(controller)
	{
		super();
		this.controller = controller;
	}
}