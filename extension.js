const open = require("open");
const vscode = require("vscode");

/**
 * Generates modified Base64 Encoded String
 * @param {String} str - The string to be encoded.
 * @returns {String} Base64 Encoded String
 */
const generateEncodedCode = str => Buffer.from(str).toString("base64");

/**
 * Generate a URL from using the script-commands
 * by Raycast as a reference.
 * @param {Object} [options]
		Query parameters to be used to 
		construct the completed request.
	* @param {('candy'|'breeze'|'midnight'|'sunset')} [options.colors]
		The color scheme you want the
		uploaded code to have.
	* @param {(
		'true'|
		'false'
	)} [options.background]
		Will determine whether the background
		of the image is opaque or translucent.
	* @param {(
		'true'|
		'false'
	)} [options.darkMode]
		Will determine whether the background
		behind the text is light or dark.
	* @param {(
		'16'|
		'32'|
		'64'|
		'128'
	)} [options.padding]
		Determines the size of the padding
		around the content of the uploaded text.
	* @param {String} [options.title]
		The title of the code snippet.
	* @param {String} code
		The snippet of code.
	* @returns {String} Returns the URL of the snippet.
*/
const generateRayUrl = (
	code,
	options = {}
) => {
	const objParams = {...options, code: generateEncodedCode(code)},
				parameters = Object.keys(objParams).map(key => `${key}=${encodeURIComponent(objParams[key])}`).join("&");
	return "https://ray.so/?" + parameters;
};

function activate(context) {
	
	const publishSelectedSnippet = vscode.commands.registerCommand("ray-this.publishSelectedSnippet", () => {
		const { 
			activeTextEditor, 
			showErrorMessage, 
			showInformationMessage 
		} = vscode.window;

		// * If there is no active text editor,
		// * return an error message.
		if (!activeTextEditor)
			return showErrorMessage(
				`You need to have an open editor to upload a code snippet to Ray.so.
				Please select a file and make a text selection to upload a snippet.`
			)
		
		const selectedContent = activeTextEditor.document.getText(activeTextEditor.selection);

		// * If there is no selected content,
		// * return an error message.
		if (!selectedContent)
			return showErrorMessage(
				`You have to have text selected to upload a snippet to Ray.so.
				Please select the text you would like to be included in your snippet.`
			);

		// * Generate URL & open in default browser,
		// * then send success message.
		const url = generateRayUrl(selectedContent, {
			title: "Uploaded using RayThis Extension",
			colors: "breeze",
			padding: "16"
		});

		console.log(url);

		vscode.env.openExternal(vscode.Uri.parse(url));
		
		showInformationMessage(
			`Successfully generated Ray.so snippet!`,
			"View"
		).then(() =>
			open(url)
		);

		open(url);
	});

}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};