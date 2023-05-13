import * as assert from 'assert';
// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import { beforeEach } from "mocha";
import { checkDocument } from '../../diagnostics/diagnostics';

const extensionNames = 'gverduci.c64basicv2';

suite('Diagnostic Test Suite', () => {
    vscode.window.showInformationMessage('Start Diagnostic Test Suite.');
    beforeEach(async () => {
        const configuration = vscode.workspace.getConfiguration('c64basicv2');
        await configuration.update('enableDiagnostics', true, true);
    });
    test('Diagnostic ok', async () => {
        await vscode.extensions.getExtension(extensionNames)?.activate();
        const doc = await vscode.workspace.openTextDocument({ language: 'c64basicv2', content: '123 5678901234567890123456789012345678901234567890123456789012345678901234567890' });
        const checkRes = checkDocument(doc);
        assert.ok(checkRes.length === 0);
    });
    test('Diagnostic error - line over', async () => {
        await vscode.extensions.getExtension(extensionNames)?.activate();
        const doc = await vscode.workspace.openTextDocument({ language: 'c64basicv2', content: '123 56789012345678901234567890123456789012345678901234567890123456789012345678901' });
        const checkRes = checkDocument(doc);
        assert.ok(checkRes.length > 0);
    });
    test('Diagnostic ok - line with control chars', async () => {
        await vscode.extensions.getExtension(extensionNames)?.activate();
        const doc = await vscode.workspace.openTextDocument({ language: 'c64basicv2', content: '123 567890123456789012345678901234567890123456789012345678901234567890123456789{right}' });
        const checkRes = checkDocument(doc);
        assert.ok(checkRes.length === 0);
    });
    test('Diagnostic error - line with control chars - line over', async () => {
        await vscode.extensions.getExtension(extensionNames)?.activate();
        const doc = await vscode.workspace.openTextDocument({ language: 'c64basicv2', content: '123 5678901234567890123456789012345678901234567890123456789012345678901234567890{right}' });
        const checkRes = checkDocument(doc);
        assert.ok(checkRes.length > 0);
    });
});
