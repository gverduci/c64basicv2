import { TextEditor } from 'vscode';

export function isTextEditor(editor: TextEditor | undefined): boolean {
    if (editor) {
        const scheme = editor.document.uri.scheme;
        return scheme !== 'output' && scheme !== 'debug';
    }
    return false;
}

export function getFileExtensions(): string[] | undefined {
    return [
        ".prg",
        ".bas"
    ];
}

export function isC64basicv2Extension(extension: string): boolean {
    const extensions = getFileExtensions();
    if (extensions) {
        return extensions.indexOf(extension) > -1;
    }
    return false;
}
