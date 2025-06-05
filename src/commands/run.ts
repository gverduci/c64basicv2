import * as vscode from 'vscode';
import * as path from 'path';
import { spawn } from 'child_process';
import * as fs from 'fs';
import * as TokenizedBASICFile from "./tokenizedBASICFile";
import * as formatter from "./outputFormatter";

export function run(tokenizedBASICFile: TokenizedBASICFile.TokenizedBASICFile, outputChannel: vscode.OutputChannel) {
    if (tokenizedBASICFile.outputFile) {
        const configuration = vscode.workspace.getConfiguration('c64basicv2');
        formatter.infoFormatter("Run...", outputChannel);
        const command: string | undefined = configuration.get("x64sc");
        if (command && fs.existsSync(command)) {
            let rootFolder = vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders[0].uri.fsPath : undefined;
            if (!rootFolder) {
                const workspaceFolders = vscode.workspace.textDocuments.map(doc => path.dirname(doc.fileName));
                if (workspaceFolders.length > 0) {
                    rootFolder = workspaceFolders[0];
                }
            }
            const baseX64scArgs = [
                tokenizedBASICFile.outputFile
            ];

            const x64scArgs: string[] = [];

            baseX64scArgs.forEach(o => {
                let arg = o;
                if (arg.indexOf(" ") > -1) {
                    arg = `"${arg}"`;
                }
                x64scArgs.push(arg);
            });

            formatter.outputFormatter(process.platform, rootFolder, tokenizedBASICFile.outputFile, command, x64scArgs, outputChannel);

            if (command) {
                const cmd = '.' + path.sep + path.basename(command);
                const x64sc = spawn(cmd, x64scArgs,
                    {
                        windowsVerbatimArguments: true,
                        cwd: path.dirname(command),
                        detached: true,
                        stdio: 'inherit',
                        shell: true
                    });
                x64sc.unref();
            }
        } else {
            const message = `c64basicv2.x64sc: configuration error!`;
            vscode.window.showErrorMessage(message);
            formatter.errorFormatter(message, outputChannel);
        }
    }
    return;
}
