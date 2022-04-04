// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

const sum = (line: string) =>{
	let sum = 0;
	for (let index = 0; index < line.length; index++) {
		sum=sum+line.toUpperCase().charCodeAt(index);
		if(sum > 255){
			sum = sum % 256;
		}
	}
	return sum;
};

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	// console.log('Congratulations, your extension "testvscode" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('c64basicv2.automaticProofreader', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user

		const editor = vscode.window.activeTextEditor;
		
		if (editor) {
			
			const document = editor.document;
			const currLine = editor.selection.active.line;
			const line = document.lineAt(currLine).text;
			const trimmedLine = line.trim().replace(/ /g,"");
			const checksum = sum(trimmedLine);
			vscode.window.showInformationMessage(checksum.toString(10));
		}
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
