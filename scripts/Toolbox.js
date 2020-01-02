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
	constructor(container, controller)
	{
		super(container, "inputs");
		this.controller = controller;
		//make the angle input.
		this.angleInput = new AngleInput(this.inputsContainer);
		//Make a layer for the sliders.
		this.slidersContainer = document.createElement("div");
		this.slidersContainer.setAttribute("id", "sliderInputs");
		this.inputsContainer.appendChild(this.slidersContainer);
		//make the sliders.
		this.lengthInput = new LengthSlider(this.slidersContainer, DEFAULT_MAXLENGTH);
		this.hueInput = new HueSlider(this.slidersContainer);
		//make a layer for the stop sorting button & the sorting type dropdown.
		this.sortercontrolsContainer = document.createElement("div");
		this.sortercontrolsContainer.setAttribute("id", "sortercontrols");
		this.inputsContainer.appendChild(this.sortercontrolsContainer);
		this.sorterSelector = new SorterSelector(this.sortercontrolsContainer, this.controller);
		this.stopSorters = new StopSorting(this.sortercontrolsContainer, this.controller);
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
		this.loadimage = new ImageUpload(this.inputsContainer, this.controller);
		this.rotateimage = new ImageRotate(this.inputsContainer, this.controller);
		this.saveimage = new ImageSave(this.inputsContainer, this.controller);
	}
}