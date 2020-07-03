///ImageInterface.js
///By Andrew Liden
///Contains concretions of the base image interface

//Just uses the base image interface.
class ImageInterface extends BaseImageInterface
{
	constructor(container)
	{
		super(container);
		this.source = new Source(DEFAULT_IMG);
		//Create a div to put the preview in.
		this.previewContainer = $("<div></div");
		this.previewContainer.attr("id", "preview");
		this.container.append(this.previewContainer);
		this.preview = new Preview(this.source, this.previewContainer);
		this.cursor = new Cursor(this.preview.context);
	}
}

//Redefine the constructor of the base image interface to use a "lite" source.
class LiteImageInterface extends BaseImageInterface
{
	constructor(container)
	{
		super(container);
		this.source = new SourceLite(DEFAULT_IMG);
		//Create a div to put the preview in.
		this.previewContainer = $("<div></div");
		this.previewContainer.attr("id", "preview");
		this.container.append(this.previewContainer);
		this.preview = new Preview(this.source, this.previewContainer);
		this.cursor = new Cursor(this.preview.context);
	}
}