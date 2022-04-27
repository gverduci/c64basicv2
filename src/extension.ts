// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as commands from './commands/commandsSubscription';
import * as diagnostics from './diagnostics/diagnosticsSubscription';

import { decorators } from './decorators/decoratorsSubscription';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// Commands
	commands.subscription(context);
	
	// Diagnostics
	const c64basicv2Diagnostics = diagnostics.subscription(context);
	
	let activeEditor = vscode.window.activeTextEditor;
	
	if (activeEditor && activeEditor.document && activeEditor.document.languageId === 'c64basicv2') {
		decorators.onReady();
		c64basicv2Diagnostics(activeEditor.document);
	}

	vscode.window.onDidChangeActiveTextEditor(editor => {
		activeEditor = editor;
		if (editor && editor.document && editor.document.languageId === 'c64basicv2') {
			c64basicv2Diagnostics(editor.document);
			decorators.onReady();
		}
	}, null, context.subscriptions);

	vscode.workspace.onDidChangeTextDocument(event => {
		if (activeEditor && activeEditor.document.languageId === 'c64basicv2') {
			if (event.document === activeEditor.document && activeEditor.document) {
				decorators.onActiveTextEditorChanged();
			}
		}
	}, null, context.subscriptions);
}

// this method is called when your extension is deactivated
export function deactivate() {}
