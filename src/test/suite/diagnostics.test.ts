import * as assert from 'assert';
// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import {checkDocument} from '../../diagnostics/diagnostics';

const extensionNames='gverduci.c64basicv2';

const extensionCommandNames = [
    'c64basicv2.automaticProofreader',
  ];

suite('Diagnostic Test Suite', () => {
	vscode.window.showInformationMessage('Diagnostic Test Suite.');
	test('Diagnostic ok', async () => {
		await vscode.extensions.getExtension(extensionNames)?.activate();
		const doc = await vscode.workspace.openTextDocument({ language: 'c64basicv2', content: '100 return' });
        const checkRes = checkDocument(doc);
        assert.ok(checkRes.length === 0);
	});
    test('Diagnostic error - line over', async () => {
		await vscode.extensions.getExtension(extensionNames)?.activate();
		const doc = await vscode.workspace.openTextDocument({ language: 'c64basicv2', content: '123 56789012345678901234567890123456789012345678901234567890123456789012345678901' });
        const checkRes = checkDocument(doc);
        assert.ok(checkRes.length > 0);
	});
    test('Diagnostic Issue #1: control chars', async () => {
		await vscode.extensions.getExtension(extensionNames)?.activate();
		const doc = await vscode.workspace.openTextDocument({ language: 'c64basicv2', content: '135 print "{right}{right}{right}{right}{right}{right}{right}{right}{right}{right}{right}{right}{right}{right}{right}{right}{right}{right}{right}{right}{right}{right}{right}{right}{right}{right}{right}{right}{yellow}";' });
        const checkRes = checkDocument(doc);
        assert.ok(checkRes.length === 0);
	});
});
