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
		this.lengthInput = new LengthSlider(this.inputsContainer, DEFAULT_MAXLENGTH);
		this.hueInput = new HueSlider(this.inputsContainer);
	}
	getAngle(){ return this.angleInput.theta; }
	getLength(){ return this.lengthInput.getValue(); }
	setMaxLength(length){ this.lengthInput.updateMax(length); }
	getHueRange(){ return this.hueInput.getValue(); }
}

class ImageToolbox extends Toolbox
{
	constructor(container)
	{
		super(container, "imagetools");
	}
}