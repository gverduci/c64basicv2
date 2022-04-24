import * as vscode from 'vscode';

function crushControlChars(lineText: string): string {
    const crushed = lineText.replace(/\{(\w+|-|\s|\d+|\/|\.)*\}/gi, "_");
    return crushed;
}

const lineChecks = [
    {
        check:(lineOfText: vscode.TextLine) => crushControlChars(lineOfText.text).length > 80,
        createDiagnostic: (doc: vscode.TextDocument, lineOfText: vscode.TextLine, lineIndex: number): vscode.Diagnostic => {
            const index = 0;
            const range = new vscode.Range(lineIndex, index, lineIndex, lineOfText.text.length);
            const diagnostic = new vscode.Diagnostic(range, "Line over 80 characters!", vscode.DiagnosticSeverity.Error);
            diagnostic.code = 'OVER80';
            return diagnostic;
        }
    }
];

export function checkDocument(document: vscode.TextDocument): vscode.Diagnostic[] {
    const configuration = vscode.workspace.getConfiguration('c64basicv2');
    const enableDiagnostics : boolean | undefined = configuration.get("enableDiagnostics");
    const diagnostics: vscode.Diagnostic[] = [];
	if (enableDiagnostics && document) {
        for (let lineIndex = 0; lineIndex < document.lineCount; lineIndex++) {
            const lineOfText = document.lineAt(lineIndex);
            lineChecks.forEach((x)=>{
                if (x.check(lineOfText)){
                    diagnostics.push(x.createDiagnostic(document, lineOfText, lineIndex));
                }
            });
        }
	}
    return diagnostics;
}

export function updateDiagnostics(document: vscode.TextDocument, collection: vscode.DiagnosticCollection): void {
	if (document) {
        const diagnostics = checkDocument(document);
        collection.set(document.uri, diagnostics);
	} else {
		collection.clear();
	}
}