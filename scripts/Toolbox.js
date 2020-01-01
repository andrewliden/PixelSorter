const DEFAULT_MAXLENGTH = 1435;

class Toolbox
{
	constructor(container, subcontainerID)
	{
		this.container = container;
		//Create a div to put the inputs in.
		this.inputsContainer = document.createElement("div");
		this.inputsContainer.setAttribute("id", subcontainerID);
		this.container.appendChild(this.inputsContainer);
	}
}

class ConfigToolbox extends Toolbox
{
	constructor(container)
	{
		super(container, "inputs");
		this.angleInput = new AngleInput(this.inputsContainer);
		this.slidersContainer = document.createElement("div");
		this.slidersContainer.setAttribute("id", "sliderInputs");
		this.inputsContainer.appendChild(this.slidersContainer);
		this.lengthInput = new LengthSlider(this.slidersContainer, DEFAULT_MAXLENGTH);
		this.hueInput = new HueSlider(this.slidersContainer);
	}
	getAngle(){ return this.angleInput.theta; }
	getLength(){ return this.lengthInput.getValue(); }
	setMaxLength(length){ this.lengthInput.updateMax(length); }
	getHueRange(){ return this.hueInput.getValue(); }
}

class ImageToolbox extends Toolbox
{
	constructor(container, controller)
	{
		super(container, "imagetools");
		this.controller = controller;
		this.loadimage = new ImageUpload(this.container, this.controller);
		this.rotateimage = new ImageRotate(this.container, this.controller);
		this.saveimage = new ImageSave(this.container, this.controller);
		
		
	}
}