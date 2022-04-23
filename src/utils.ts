import { TextEditor } from 'vscode';

export function isTextEditor(editor: TextEditor | undefined): boolean {
    if (editor) {
        const scheme = editor.document.uri.scheme;
        return scheme !== 'output' && scheme !== 'debug';
    }
    return false;
}