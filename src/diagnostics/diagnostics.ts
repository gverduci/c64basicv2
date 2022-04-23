import * as vscode from 'vscode';

const lineChecks = [
    {
        check:(lineOfText: vscode.TextLine) => lineOfText.text.length > 80,
        createDiagnostic: (doc: vscode.TextDocument, lineOfText: vscode.TextLine, lineIndex: number): vscode.Diagnostic => {
            const index = 0;
            const range = new vscode.Range(lineIndex, index, lineIndex, lineOfText.text.length);
            const diagnostic = new vscode.Diagnostic(range, "Line over 80 characters!", vscode.DiagnosticSeverity.Error);
            diagnostic.code = 'OVER80';
            return diagnostic;
        }
    }
];

export function updateDiagnostics(document: vscode.TextDocument, collection: vscode.DiagnosticCollection): void {
	if (document) {
        const diagnostics: vscode.Diagnostic[] = [];
        for (let lineIndex = 0; lineIndex < document.lineCount; lineIndex++) {
            const lineOfText = document.lineAt(lineIndex);
            lineChecks.forEach((x)=>{
                if (x.check(lineOfText)){
                    diagnostics.push(x.createDiagnostic(document, lineOfText, lineIndex));
                }
            });
        }
        collection.set(document.uri, diagnostics);
	} else {
		collection.clear();
	}
}