import * as vscode from 'vscode';
import * as path from 'path';
import { changeUpperCaseCharUnicode, crushControlCharsUnicode } from "../helpers/controlCharsHelper";

class Preview {
	doc: vscode.TextDocument;
	active: boolean;

	constructor(doc: vscode.TextDocument) {
		this.doc = doc;
		this.active = true;
	}
	setDoc(doc: vscode.TextDocument) {
		this.doc = doc;
	}
}

const VIEW_TYPE = 'c64basicv2.preview';
let panel: (vscode.WebviewPanel | undefined);
let panelDoc: (vscode.TextDocument | undefined);
let disposables: vscode.Disposable[] = [];
let currentPreview: Preview | undefined;

function disposePanel() {
	if (panel) {
		panel.dispose();
		while (disposables.length) {
			const disposable = disposables.pop();
			if (disposable) {
				disposable.dispose();
			}
		}
		panel = undefined;
	}
}

function setPanelHTML(preview: Preview, context: vscode.ExtensionContext) {
	const { extensionPath } = context;
	const { doc } = preview;
	if (panel) {
	const styleUri = vscode.Uri.file(path.join('/', extensionPath, 'resources', 'c64.css'));
	const styleSrc = panel.webview.asWebviewUri(styleUri);
	const fontUri = vscode.Uri.file(path.join('/', extensionPath, 'resources', 'fonts', 'PetMe64.ttf'));
	const fontSrc = panel.webview.asWebviewUri(fontUri);
	let webviewAppHTML = `<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Preview ${path.basename(doc.fileName)}</title>
			<style>
				@font-face {
					font-family: 'PetMe64';
					src: URL('${fontSrc}') format('truetype');
			  	}
			</style>
			<link rel="stylesheet" type="text/css" href="${styleSrc}">
		</head>
		<body>

		<section class="bluescreen">`;
		
	for (let index = 0; index < doc.lineCount; index++) {
		const line = doc.lineAt(index).text;
		let crushedLine = crushControlCharsUnicode(line);
		crushedLine = changeUpperCaseCharUnicode(crushedLine);
		const line40 = crushedLine.slice(0,40);
		const line80 = crushedLine.slice(40,80);
		webviewAppHTML = `${webviewAppHTML}<div id="root">${line40}</div>`;
		if (line80){
			webviewAppHTML = `${webviewAppHTML}<div id="root">${line80}</div>`;
		}
	}
	webviewAppHTML = `${webviewAppHTML}<div>READY</div><div id="cursor"></div></section></body></html>`;
		panel.webview.html = webviewAppHTML;
	}
}

function showPanel(preview: Preview, context: vscode.ExtensionContext, previewColumn: vscode.ViewColumn) {
	const previewTitle = `Preview ${path.basename(preview.doc.fileName)}`;

	if (!panel) {
		panel = vscode.window.createWebviewPanel(
			VIEW_TYPE,
			previewTitle,
			{
				viewColumn:previewColumn,
				preserveFocus:true
			},
			{
				enableScripts: true,
				enableCommandUris: true,
				retainContextWhenHidden: true
			}
		);
		panelDoc = preview.doc;
		setPanelHTML(preview, context);
		panel.onDidDispose(() => {
			preview.active = false;
			disposePanel();
		}, null, disposables);
	} else {
		if (panelDoc !== preview.doc) {
			panel.title = previewTitle;
			setPanelHTML(preview, context);
			panelDoc = preview.doc;
		}
		else if (panelDoc === preview.doc) {
			setPanelHTML(preview, context);
		}
		panel.reveal(previewColumn, true);
	}
	preview.active = true;
	return panel;
}

function openPreviewBase(info: any, outputChannel: vscode.OutputChannel, context: vscode.ExtensionContext, previewColumn: vscode.ViewColumn) {
	if (!vscode.window.activeTextEditor) {
		return;
	}
	const doc = vscode.window.activeTextEditor.document;
	if (!currentPreview) {
		currentPreview = new Preview(doc);
	} else {
		currentPreview.setDoc(doc);
	}
	showPanel(currentPreview, context, previewColumn);
};

export function openPreview(info: any, outputChannel: vscode.OutputChannel, context: vscode.ExtensionContext) {
	openPreviewBase(info, outputChannel, context, vscode.ViewColumn.Beside);
};

export function refreshPreview(info: any, outputChannel: vscode.OutputChannel, context: vscode.ExtensionContext) {
	if (!currentPreview || !currentPreview.active) {
		return;
	}
	if (!panel) {
		return;
	}
	openPreviewBase(info, outputChannel, context, vscode.ViewColumn.Beside);
}
