import { downloadAndUnzipVSCode } from '@vscode/test-electron';
import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
// import * as myExtension from '../../extension';

const extensionNames='gverduci.c64basicv2';

const extensionCommandNames = [
    'c64basicv2.automaticProofreader',
  ];

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');
	test('Should activate extension', async () => {
		await vscode.extensions
		  .getExtension(extensionNames)
		  ?.activate();
	
		const isActive = vscode.extensions.getExtension(
			extensionNames
		)?.isActive;
		assert.ok(isActive);
	  });

	  test('Extension should register all commands', function (done) {
		vscode.extensions
		.getExtension(extensionNames)
		?.activate().then((api) => {
			return vscode.commands.getCommands();
		  }).then((commands) => {
			for (const commandName of extensionCommandNames) {
				assert.ok(
				  commands.find((name) => name === commandName),
				  `Command '${commandName}' is not registered.`,
				);
			  }
			  done();
		  });

	  });

	  test('Execute command ok', async () => {
		await vscode.extensions.getExtension(extensionNames)?.activate();
		const doc = await vscode.workspace.openTextDocument({ language: 'c64basicv2', content: '100 return' });
		await vscode.window.showTextDocument(doc);
		await new Promise(resolve => setTimeout(resolve, 100));
		const res = await vscode.commands.executeCommand('c64basicv2.automaticProofreader');
		assert.ok(res===113);
	});
});
