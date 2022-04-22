// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
// import * as autoProofreader from './commons/automaticProofreader';
import * as autoProofreaderCommand from './commands/automaticProofreader';
import * as autoProofreaderDecorator from './decorators/automaticProofreader';
import * as convert from './commands/convert';
import * as run from './commands/run';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// commands subscription
	const commands = [
		{name: "c64basicv2.automaticProofreader", callback: () => autoProofreaderCommand.automaticProofreader()},
		{name: "c64basicv2.convert", callback: () => convert.convert()},
		{name: "c64basicv2.convert-run", callback: () => run.run(convert.convert())}
	];

	commands.forEach((command) => {
		let disposable = vscode.commands.registerCommand(command.name, command.callback);
		context.subscriptions.push(disposable);
	});

	// enable decorator and related events
	const configuration = vscode.workspace.getConfiguration('c64basicv2');
	const showInlineAutomaticProofreader : boolean | undefined = configuration.get("showInlineAutomaticProofreader");
	let timeout: NodeJS.Timer | undefined = undefined;
	let activeEditor = vscode.window.activeTextEditor;

	function triggerUpdateDecorations(throttle = false) {
		if (timeout) {
			clearTimeout(timeout);
			timeout = undefined;
		}
		if (throttle) {
			timeout = setTimeout(() => autoProofreaderDecorator.updateDecorations(activeEditor), 500);
		} else {
			autoProofreaderDecorator.updateDecorations(activeEditor);
		}
	}

	if (showInlineAutomaticProofreader) {
		if (activeEditor && activeEditor.document && activeEditor.document.languageId === 'c64basicv2') {
			triggerUpdateDecorations();
		}
		vscode.window.onDidChangeActiveTextEditor(editor => {
			activeEditor = editor;
			if (editor && editor.document && editor.document.languageId === 'c64basicv2') {
				triggerUpdateDecorations();
			}
		}, null, context.subscriptions);

		vscode.workspace.onDidChangeTextDocument(event => {
			if (activeEditor && event.document === activeEditor.document && activeEditor.document && activeEditor.document.languageId === 'c64basicv2') {
				triggerUpdateDecorations(true);
			}
		}, null, context.subscriptions);
	}
}

// this method is called when your extension is deactivated
export function deactivate() {}
