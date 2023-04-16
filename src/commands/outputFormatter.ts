import * as vscode from 'vscode';

export function outputFormatter (platform: string,  currentDir: string | undefined, currentFile: string, command:string, options:string[], outputChannel: vscode.OutputChannel) {
    const configuration = vscode.workspace.getConfiguration('c64basicv2');
    const showCommandLogs : boolean | undefined = configuration.get("showCommandLogs");
    if (showCommandLogs) {
        outputChannel.appendLine("**** Run configuration ****");
        outputChannel.appendLine(`Platform       : ${platform}`);
        outputChannel.appendLine(`Current Dir    : ${currentDir}`);
        outputChannel.appendLine(`Current File   : ${currentFile}`);
        outputChannel.appendLine(`Command        : ${command}`);
        outputChannel.appendLine(`Command Options:`);
        outputChannel.appendLine("");
        for (let i = 0; i < options.length; i++) {
            outputChannel.appendLine(`  ${options[i]}`);
        }
        outputChannel.appendLine("");
        outputChannel.appendLine("");
    }
}

function logFormatter (type:string, message: string, outputChannel: vscode.OutputChannel) {
    const configuration = vscode.workspace.getConfiguration('c64basicv2');
    const showCommandLogs : boolean | undefined = configuration.get("showCommandLogs");
    if (showCommandLogs) {
        outputChannel.appendLine(`${type}        : ${message}`);
    }
}

export function errorFormatter (message: string, outputChannel: vscode.OutputChannel) {
    logFormatter("error", message, outputChannel);
}

export function infoFormatter (message: string, outputChannel: vscode.OutputChannel) {
    logFormatter("info", message, outputChannel);
}