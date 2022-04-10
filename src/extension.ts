// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as automaticProofreader from './commands/automaticProofreader';
import * as convert from './commands/convert';
import * as run from './commands/run';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	const commands = [
		{name: "c64basicv2.automaticProofreader", callback: () => automaticProofreader.automaticProofreader()},
		{name: "c64basicv2.convert", callback: () => convert.convert()},
		{name: "c64basicv2.convert-run", callback: () => run.run(convert.convert())}
	];

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	// console.log('Congratulations, your extension "testvscode" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	// let disposable = vscode.commands.registerCommand('c64basicv2.automaticProofreader', automaticProofreader.automaticProofreader);

    // context.subscriptions.push(disposable);
	commands.forEach((command) => {
		let disposable = vscode.commands.registerCommand(command.name, command.callback);
		context.subscriptions.push(disposable);
	});

}

// this method is called when your extension is deactivated
export function deactivate() {}
