import * as vscode from 'vscode';
import * as path from 'path';
import * as formatter from "./outputFormatter";
import * as utils from '../utils';

export function copy (info:any, outputChannel: vscode.OutputChannel) {
	const editor = vscode.window.activeTextEditor;
	formatter.infoFormatter("Copy special character...", outputChannel);
	if (editor) {
		const document = editor.document;
		const fileExt = path.extname(document.fileName);
		if (utils.isC64basicv2Extension(fileExt)){
            let template;

            template = new vscode.SnippetString(info.item.symbolic);

            editor.insertSnippet(template, editor.selection.active);
        } else {
            vscode.window.showInformationMessage('Please open "*.bat/*.prg" file in the editor to add a new snippet.');
        }


	}
};

export function copyChr (info:any, outputChannel: vscode.OutputChannel) {
	const editor = vscode.window.activeTextEditor;
	formatter.infoFormatter("Copy special character...", outputChannel);
	if (editor) {
		const document = editor.document;
		const fileExt = path.extname(document.fileName);
		if (utils.isC64basicv2Extension(fileExt)){
            let template;

            template = new vscode.SnippetString(`chr$(${info.item.id})`);

            editor.insertSnippet(template, editor.selection.active);
        } else {
            vscode.window.showInformationMessage('Please open "*.bat/*.prg" file in the editor to add a new snippet.');
        }


	}
};
