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
	}
	getAngle(){ return this.angleInput.theta; }
}

class ImageToolbox extends Toolbox
{
	constructor(container)
	{
		super(container, "imagetools");
	}
}