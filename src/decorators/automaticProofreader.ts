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

export const annotationDecorationOver80Type = vscode.window.createTextEditorDecorationType({
    after: {
        margin: '0 0 0 3em',
        textDecoration: 'none; white-space: pre;',
        color: 'gray',
        fontStyle: 'italic'
    },
    rangeBehavior: vscode.DecorationRangeBehavior.OpenOpen,
});

export function updateDecorations(activeEditor:vscode.TextEditor | undefined) {
    if (!activeEditor) {
        return;
    }
    const annotation: vscode.DecorationOptions[] = [];
    const annotationOver80: vscode.DecorationOptions[] = [];
    for (let index = 0; index < activeEditor.document.lineCount; index++) {
        const line = activeEditor.document.lineAt(index).text;
        const containsCommand = false; // line.indexOf('{') > -1;
        if (line.trim().length > 0 && !containsCommand){
            const checksum = autoProofreader.automaticProofreader(line);
            const checksumTxt = ("   " + checksum).slice(-3);
            const decoration = { range: new vscode.Range(index, line.length, index, line.length), renderOptions: {after:{contentText:`:rem ${checksumTxt}`}} };			
            if (line.length > 80){
                annotationOver80.push(decoration);
            }else{
                annotation.push(decoration);
            }
        }
    }
    activeEditor.setDecorations(annotationDecorationType, annotation);
    activeEditor.setDecorations(annotationDecorationOver80Type, annotationOver80);

}
