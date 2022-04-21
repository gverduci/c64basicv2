import * as vscode from 'vscode';
import * as autoProofreader from '../commons/automaticProofreader';

export const annotationDecorationType = vscode.window.createTextEditorDecorationType({
    after: {
        margin: '0 0 0 0',
        textDecoration: 'none; position: absolute; left: 50em; white-space: pre;',
        color: 'gray',
        fontStyle: 'italic'
    },
    rangeBehavior: vscode.DecorationRangeBehavior.OpenOpen,
});

let activeEditor = vscode.window.activeTextEditor;

export function updateDecorations(activeEditor:vscode.TextEditor | undefined) {
    if (!activeEditor) {
        return;
    }
    const annotation: vscode.DecorationOptions[] = [];
    for (let index = 0; index < activeEditor.document.lineCount; index++) {
        const line = activeEditor.document.lineAt(index).text;
        const checksum = autoProofreader.automaticProofreader(line);
        const checksumTxt = ("   " + checksum).slice(-3);
        const decoration = { range: new vscode.Range(index, line.length, index, line.length), renderOptions: {after:{contentText:`:rem ${checksumTxt}`}} };			
        annotation.push(decoration);
    }
    activeEditor.setDecorations(annotationDecorationType, annotation);
}
