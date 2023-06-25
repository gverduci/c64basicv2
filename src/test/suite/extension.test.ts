import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';

const extensionNames = 'gverduci.c64basicv2';

const extensionCommandNames = [
    'c64basicv2.automaticProofreader',
];

suite('Extension Test Suite', () => {
    vscode.window.showInformationMessage('Start Extension tests.');
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
            ?.activate().then(() => {
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
});
