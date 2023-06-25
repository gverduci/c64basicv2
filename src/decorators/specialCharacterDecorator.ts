import * as vscode from 'vscode';
import { controlCharsObjects } from '../helpers/controlCharsHelper';
import { SpecialCharacter } from "../helpers/SpecialCharacter";

export const annotationDecorationType = vscode.window.createTextEditorDecorationType({
    after: {
        margin: '0 0 0 0',
        color: 'gray',
        fontStyle: 'normal'
    },
    rangeBehavior: vscode.DecorationRangeBehavior.OpenOpen,
});

const ctrlChars: SpecialCharacter[] = [];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function updateDecorations(activeEditor: vscode.TextEditor | undefined, context: vscode.ExtensionContext) {
    if (!activeEditor) {
        return;
    }
    const annotation: vscode.DecorationOptions[] = [];
    if (ctrlChars.length === 0){
        const chars = controlCharsObjects();
        chars.forEach(c=>ctrlChars.push(c));
    }
    for (let index = 0; index < activeEditor.document.lineCount; index++) {
        const line = activeEditor.document.lineAt(index).text;
        ctrlChars.forEach(c => {
            const containsCommand = line.indexOf(c.symbolic);
            if (line.trim().length > 0 && containsCommand > -1) {
                const hoverMessage = new vscode.MarkdownString();
                hoverMessage.appendMarkdown(`**${c.id} - ${c.symbolic}**`);
                hoverMessage.appendMarkdown('\n\n');
                hoverMessage.appendMarkdown(`*${c.description}*`);
                const decoration = {
                    range: new vscode.Range(index, containsCommand, index, containsCommand + 5),
                    hoverMessage
                };
                annotation.push(decoration);

            }
        });
    }
    activeEditor.setDecorations(annotationDecorationType, annotation);
}
