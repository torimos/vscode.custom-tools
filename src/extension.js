// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const config = require('./config');

// vscode api: https://code.visualstudio.com/api/references/vscode-api
// icons: https://code.visualstudio.com/api/references/icons-in-labels#icon-listing
// vars: https://code.visualstudio.com/docs/editor/variables-reference

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed


let statusBarItems = [];
let statusBarCommands = [];
let reloadCounter = 0;
/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	//vscode.window.showInformationMessage('...!');
	
	let log = vscode.window.createOutputChannel("custom-tools");
	config.watch((cfg)=>{
		log.appendLine(`[${reloadCounter}] Reloading Custom-Tools: ${JSON.stringify(cfg)}`);
		reloadCounter++;
		statusBarItems.forEach(item => item.dispose());
        statusBarItems = [];
		statusBarCommands.forEach(item => item.dispose());
        statusBarCommands = [];
		cfg.statusbar.forEach((item, idx) => {

			let cmdName = `custom-tools.statusbar.command_${idx}`;
			let command = vscode.commands.registerCommand(cmdName, () => {
				item.commands.forEach((cmd) => {
					vscode.commands.executeCommand(cmd.id, cmd.args);
				});
			});
			statusBarCommands.push(command)
			context.subscriptions.push(command);

			let statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0);
			statusBarItem.text = item.text;
			statusBarItem.tooltip = item.tooltip;
			statusBarItem.command = cmdName;
			statusBarItem.show();
			statusBarItems.push(statusBarItem)
			context.subscriptions.push(statusBarItem);
		});
	});
}

// This method is called when your extension is deactivated
function deactivate() {
}

module.exports = {
	activate,
	deactivate
}
