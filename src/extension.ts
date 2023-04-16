// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as commands from './commands/commandsSubscription';
import * as diagnostics from './diagnostics/diagnosticsSubscription';

import { decorators } from './decorators/decoratorsSubscription';
import { SIDWebview } from './webview/sidWebview';
import { CharactersWebview } from './webview/charactersWebview';
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    const outputChannel: vscode.OutputChannel = vscode.window.createOutputChannel('c64basicv2');
    outputChannel.appendLine("");
    outputChannel.appendLine("**** COMMODORE 64 BASIC V2 ****");
    outputChannel.appendLine("");

    // Commands
    commands.subscription(context, outputChannel);
    
    // Diagnostics
    const c64basicv2Diagnostics = diagnostics.subscription(context);
    
    let activeEditor = vscode.window.activeTextEditor;
    
    if (activeEditor && activeEditor.document && activeEditor.document.languageId === 'c64basicv2') {
        decorators.onReady(context);
        c64basicv2Diagnostics(activeEditor.document);
    }
    // let lastEventWasClose = false;
    
    vscode.workspace.onDidOpenTextDocument(() => {
        //lastEventWasClose = false;
    });

    vscode.workspace.onDidCloseTextDocument(() => {
        //lastEventWasClose = true;
    });
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    vscode.window.onDidChangeTextEditorSelection(event => {
        const shouldUpdate = false;
        if (!shouldUpdate) {
        return;
        }

    });


    vscode.window.onDidChangeActiveTextEditor(editor => {
        activeEditor = editor;
        if (editor && editor.document && editor.document.languageId === 'c64basicv2') {
            c64basicv2Diagnostics(editor.document);
            decorators.onReady(context);
            vscode.commands.executeCommand('c64basicv2.commands.refreshPreview');
        }
    }, null, context.subscriptions);

    vscode.workspace.onDidChangeTextDocument(event => {
        if (activeEditor && activeEditor.document.languageId === 'c64basicv2') {
            if (event.document === activeEditor.document && activeEditor.document) {
                decorators.onActiveTextEditorChanged(context);
                vscode.commands.executeCommand('c64basicv2.commands.refreshPreview');
            }
        }
    }, null, context.subscriptions);

    const disposables: vscode.Disposable[] = [];
    context.subscriptions.push(new vscode.Disposable(() => vscode.Disposable.from(...disposables).dispose()));
    context.subscriptions.push(new SIDWebview(context));
    context.subscriptions.push(new CharactersWebview(context));
}

// this method is called when your extension is deactivated
// eslint-disable-next-line @typescript-eslint/no-empty-function
export function deactivate() {}
