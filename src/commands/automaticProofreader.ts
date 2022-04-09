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

export function automaticProofreader () {
	let checksum = -1;
	const editor = vscode.window.activeTextEditor;
	if (editor) {
		
		const document = editor.document;
		const currLine = editor.selection.active.line;
		const line = document.lineAt(currLine).text;
		const trimmedLine = line.trim().replace(/ /g,"");
		checksum = sum(trimmedLine);
		vscode.window.showInformationMessage(checksum.toString(10));
	}
	return checksum;
};
