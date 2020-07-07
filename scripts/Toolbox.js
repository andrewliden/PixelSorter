const DEFAULT_MAXLENGTH = 1435;

class Toolbox
{
	constructor(container, subcontainerID)
	{
		this.container = container;
		//Create a div to put the inputs in.
		this.inputsContainer = $("<div></div>");
		this.inputsContainer.attr("id", subcontainerID);
		this.container.append(this.inputsContainer);
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
		this.slidersContainer = $("<div></div>");
		this.slidersContainer.attr("id", "sliderInputs");
		this.inputsContainer.append(this.slidersContainer);
		//make the sliders.
		this.lengthInput = new LengthSlider(this.slidersContainer, DEFAULT_MAXLENGTH);
		this.hueInput = new HueSlider(this.slidersContainer);
		this.inputsContainer.append(this.sortercontrolsContainer);
		//Make a layer for the sorter controls (stop sort + sorter settings)
		this.sortercontrolsContainer = $("<div></div>");
		this.sortercontrolsContainer.attr("id", "sortercontrols");
		this.inputsContainer.append(this.sortercontrolsContainer);
		//Make a layer for the sorter settings (what to sort on, what sorting algo)
		this.sorterSettingsContainer = $("<div></div>");
		this.sorterSettingsContainer.attr("id", "sorterSettings");
		this.sortercontrolsContainer.append(this.sorterSettingsContainer);
		
		//Add the selector for what to sort on and how to sort it.
		this.sorterCriteriaSelector = new SorterCriteriaSelector(this.sorterSettingsContainer, this.controller);
		this.sorterAlgoSelector = new AlgorithmSelector(this.sorterSettingsContainer, this.controller);
		this.ascendingSelector = new AscendingToggle(this.sorterSettingsContainer, this.controller);
		//Add the stop sorting button
		this.stopSorters = new StopSorting(this.sortercontrolsContainer, this.controller);
		//Add the hotkeys.
		this.angleHotkey = new AddAngleHotkey(this.angleInput, this.controller);
		this.stopHotkey = new StopSortingHotkey(this.controller);
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
		this.undo = new Undo(this.inputsContainer, this.controller);
		this.saveimage = new ImageSave(this.inputsContainer, this.controller);
	}
}