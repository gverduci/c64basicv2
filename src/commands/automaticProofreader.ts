import * as vscode from 'vscode';
import * as autoProofreader from '../commons/automaticProofreader';
import * as formatter from "./outputFormatter";

export function automaticProofreader (outputChannel: vscode.OutputChannel) {
    let checksum = -1;
    const editor = vscode.window.activeTextEditor;
    if (editor) {
        const document = editor.document;
        const currLine = editor.selection.active.line;
        const line = document.lineAt(currLine).text;
        checksum = autoProofreader.automaticProofreader(line);
        // const trimmedLine = line.trim().replace(/ /g,"");
        // checksum = sum(trimmedLine);
        vscode.window.showInformationMessage(`Line checksum: ${checksum.toString(10)}`);
    }else{
        formatter.errorFormatter("no editor", outputChannel);
    }
    return checksum;
}
