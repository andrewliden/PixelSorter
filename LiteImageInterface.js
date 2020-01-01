//Redefine the constructor of the base image interface to use a "lite" source.
class ImageInterface extends BaseImageInterface
{
	constructor(container)
	{
		super(container);
		this.source = new SourceLite(DEFAULT_IMG);
		//Create a div to put the preview in.
		this.previewContainer = document.createElement("div");
		this.previewContainer.setAttribute("id", "preview");
		this.container.appendChild(this.previewContainer);
		this.preview = new Preview(this.source, this.container);
		this.cursor = new Cursor(this.preview.context);
	}
}