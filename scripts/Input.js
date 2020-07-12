///Input.js
///Andrew Liden
///Simplifies client use of event listeners for touch and mouse input

const ANGLEINPUT_LINE_COLOR = "white";
const ANGLEINPUT_LINE_WIDTH = 3;

//Encapsulates touch & mouse behaviors into one object
//Calls "click" on the owner when a pointer input happens.
//keeps track of important stats such as x & y values and movement values.
class PointerListener
{
	isInTarget(event)
	{
		return event.target == this.inputTarget[0] || $.contains(this.inputTarget[0], event.target);
	}

	mouseInput(event)
	{
		if(this.isInTarget(event))
		{

			var boundingRect = this.inputCanvas.getBoundingClientRect();
			var offsetX = event.clientX - boundingRect.left;
			var offsetY = event.clientY - boundingRect.top;
			//If the original event has a movement amount, use that for dx and dy.
			//Assume that if movementX exists, so does movementY.
			if(event.originalEvent.movementX)
			{
				this.dx = event.originalEvent.movementX;
				this.dy = event.originalEvent.movementY;
			}
			else
			{
				this.dx = this.x - offsetX;
				this.dy = this.y - offsetY;
			}
			this.x = offsetX;
			this.y = offsetY;
			if(event.which == 1)
			{
				this.clicking = true;
				this.owner.click();
			}
		}
		else
		{
			this.clicking = false;
		}
	}
	//Touchstart is the same as touchInput, but dx is set to 0.
	//This is a bad design (don't repeat yourself).
	touchStart(event)
	{
		if(this.isInTarget(event))
		{
			//Only perform clicks on single-touch.
			if(event.targetTouches.length == 1)
			{
				var touch = event.targetTouches[0];
				var boundingRect = this.inputCanvas.getBoundingClientRect();
				var offsetX = touch.clientX - boundingRect.left;
				var offsetY = touch.clientY - boundingRect.top;
				this.dx = 0;
				this.dy = 0;
				this.x = offsetX;
				this.y = offsetY;
				this.clicking = true;
				this.owner.click();
			}
		}
	}
	touchInput(event)
	{
		if(this.isInTarget(event))
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
		
		$(document).on("mousemove", function(event){
			if(selfReference.isInTarget(event))
				event.preventDefault();
			selfReference.mouseInput(event);
		});
		$(document).on("touchstart", function(event){
			selfReference.touchStart(event);
		});
		$(document).on("touchmove", function(event){
			selfReference.touchInput(event);
		});
		$(document).on("touchend", function(event){
			selfReference.clicking = false;
		});
		$(document).on("touchcancel", function(event){
			selfReference.clicking = false;
		});
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
		this.inputBox.attr("value", this.getDegrees());
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
		this.inputBox.on("input", this.updateFromInputBox);
	}
	constructor(container)
	{
		this.container = container;
		//Create HTML elements.
		this.label = $("<label></label>").text("Angle");
		this.inputBox = $("<input></input>");
		this.inputBox.attr("type", "number");
		this.jqCanvas = $("<canvas>");
		this.jqCanvas.attr("width", 100);
		this.jqCanvas.attr("height", 100);
		this.inputCanvas = this.jqCanvas[0];
		this.subcontainer = $("<div></div>");
		this.subcontainer.attr("id", "angleinput");
		//Put the subcontainer inside the container.
		this.container.append(this.subcontainer);
		//Put the canvas & input box inside the subcontainer.
		this.subcontainer.append(this.label);
		this.subcontainer.append(this.inputCanvas);
		this.subcontainer.append(this.inputBox);
		//Start setting up the canvas.
		this.context = this.inputCanvas.getContext("2d");
		this.context.strokeStyle = ANGLEINPUT_LINE_COLOR;
		this.context.lineWidth = ANGLEINPUT_LINE_WIDTH;
		this.theta = Math.PI / 2;
		this.pointerListener = new PointerListener(this, this.jqCanvas, this.inputCanvas);
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
		this.subcontainer = $("<div></div>");
		this.label = $("<label></label>").text(this.labeltext);
		this.inputSlider = $("<input></input>");
		this.inputBox = $("<input></input>");
		//Define attributes.
		this.inputSlider.attr("type", "range");
		this.inputSlider.attr("min", "0");
		this.inputSlider.attr("max", this.max);
		this.inputBox.attr("type", "number");
		//Append all of the elements into the container.
		this.container.append(this.subcontainer);
		this.subcontainer.append(this.label);
		this.label.append(this.labeltextNode);
		this.subcontainer.append(this.inputSlider);
		this.subcontainer.append(this.inputBox);
		this.inputBox.attr("value", this.value);
		this.inputSlider.attr("value", this.value);
	}
	createListeners()
	{
		//Get a reference to this object to avoid weird event-listener scope resolution.
		var selfReference = this;
		this.updateValueFromSlider = function()
		{
			//Get the value attribute from the slider, then give it to the input box.
			selfReference.value = selfReference.inputSlider.val();
			selfReference.inputBox.val(selfReference.value);
		}
		this.updateValueFromBox = function()
		{
			console.log(selfReference.inputBox.val());
			//Clamp the value from the input box.
			if(selfReference.inputBox.val() < 0)
				selfReference.inputBox.val(0);
			else if(selfReference.inputBox.attr("value") > selfReference.max)
				selfReference.inputBox.val(selfReference.max);
			//Get the value attribute from the box, then give it to the slider
			selfReference.value = selfReference.inputBox.val();
			selfReference.inputSlider.val(selfReference.value);
		}
		this.inputSlider.on("change", this.updateValueFromSlider);
		this.inputBox.on("change", this.updateValueFromBox);
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
		this.inputSlider.attr("max", this.max);
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
		var file = this.input[0].files[0];
		this.controller.loadImage(file);
	}
	constructor(container, controller)
	{
		this.container = container;
		this.controller = controller;
		this.input = $("<input></input>");
		this.input.attr("type", "file");
		this.input.attr("id", "file");
		this.label = $("<label></label>").text("Load Image");
		this.label.attr("for", "file");
		this.container.append(this.input);
		this.container.append(this.label);
		var selfReference = this;
		this.input.on("input", function(){ selfReference.uploadFile(); });
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
		this.button = $("<button></button>");
		this.button.attr("id", id).text(text);
		this.container.append(this.button);
		var selfReference = this;
		this.button.on("click", function(){ selfReference.action(); });
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
		//this.controller = controller;
		this.subcontainer = $("<div></div>");
		this.container.append(this.subcontainer);
		this.label = $("<label></label>").text(labeltext);
		this.subcontainer.append(this.label);
		this.input = $("<select></select>");
		this.input.attr("id", id);
		this.subcontainer.append(this.input);
		var selfReference = this;
		this.input.on("change", function(){ selfReference.action(); });
	}
	addOption(text, value)
	{
		var option = $("<option></option>").text(text);
		option.attr("value", value);
		this.input.append(option);
	}
	getValue(){ return this.input.val(); }
}

class SorterCriteriaSelector extends Dropdown
{
	action()
	{
		this.controller.setSorterCriteria(this.getValue());
	}
	constructor(container, controller)
	{
		super(container, "sorterselector", "Sort on...");
		this.controller = controller;
		//This approach isn't particularly scaleable.
		//It might be an area to consider improving.
		var sorterTypes = ["Luma", "Lightness", "Value", "Intensity"];
		for(var type of sorterTypes)
			this.addOption(type, type);
	}
}

class AlgorithmSelector extends Dropdown
{
	action()
	{
		this.controller.setSortingAlgorithm(this.getValue());
	}
	constructor(container, controller)
	{
		super(container, "algorithmselector", "Using this algorithm...");
		this.controller = controller;
		var algorithms = ["Bubble", "Insertion", "Selection", "Quick"];
		for(var algo of algorithms)
			this.addOption(algo, algo);
	}
}

class ToggleButton
{
	toggle()
	{
		this.state = !this.state;
		if(this.state)
		{
			this.button.text(this.onText);
			this.button.attr("class", "toggleOn");
		}
		else
		{
			this.button.text(this.offText);
			this.button.attr("class", "toggleOff");
		}
	}
	action()
	{
		
	}
	constructor(container, offText, onText)
	{
		//Get attributes from arguments
		this.container = container;
		this.offText = offText;
		this.onText = onText;
		this.state = true;
		this.button = $("<button></button>");
		this.button.text(onText);
		//Add the checkbox and label to the DOM.
		this.container.append(this.button).append(this.label);
		var selfReference = this;
		this.button.on("click", function(){
			selfReference.toggle();
			selfReference.action();
		});
	}
}

class AscendingToggle extends ToggleButton
{
	action()
	{
		this.controller.setAscendingState(this.state);
	}
	constructor(container, controller)
	{
		super(container, "Descending", "Ascending");
		this.button.attr("id", "ascendingToggle");
		this.controller = controller;
	}
}

//Abstract hotkey class.
class Hotkey
{
	activate(event)
	{
		
	}
	constructor(eventType)
	{
		var selfReference = this;
		$(document).on(eventType, function(event){ selfReference.activate(event); });
	}
}

//Abstract wheel hotkey class.
class WheelHotkey extends Hotkey
{
	constructor()
	{
		super("wheel");
	}
}

class AddAngleHotkey extends WheelHotkey
{
	activate(event)
	{
		//Should add a degree every mousewheel movement.
		this.angleInput.addDegrees(event.originalEvent.deltaY / 100);
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
		super("keydown");
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