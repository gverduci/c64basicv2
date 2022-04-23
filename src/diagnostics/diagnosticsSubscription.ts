import * as vscode from 'vscode';
import * as diagnostics from './diagnostics';

export function subscription(context: vscode.ExtensionContext) {
	const c64basicv2Diagnostics = vscode.languages.createDiagnosticCollection('c64basicv2');
	context.subscriptions.push(c64basicv2Diagnostics);
	
	let activeEditor = vscode.window.activeTextEditor;

	vscode.workspace.onDidChangeTextDocument(event => {
		if (activeEditor && activeEditor.document.languageId === 'c64basicv2') {
			diagnostics.updateDiagnostics(activeEditor.document, c64basicv2Diagnostics);
		}
	}, null, context.subscriptions);

	return (document: vscode.TextDocument) => diagnostics.updateDiagnostics(document, c64basicv2Diagnostics);
}