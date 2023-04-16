import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';

const extensionNames='gverduci.c64basicv2';

suite('Automatic Proofreader Test Suite', () => {
    vscode.window.showInformationMessage('Start Automatic Proofreader Test Suite.');
    test('Execute command ok', async () => {
        await vscode.extensions.getExtension(extensionNames)?.activate();
        const doc = await vscode.workspace.openTextDocument({ language: 'c64basicv2', content: '100 return' });
        await vscode.window.showTextDocument(doc);
        await new Promise(resolve => setTimeout(resolve, 100));
        const res = await vscode.commands.executeCommand('c64basicv2.automaticProofreader');
        assert.ok(res===113);
    });
});
