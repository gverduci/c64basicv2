import * as vscode from 'vscode';
import { spawn } from 'child_process';
import * as path from 'path';
import * as TokenizedBASICFile from "./tokenizedBASICFile";
export function run (tokenizedBASICFile: TokenizedBASICFile.TokenizedBASICFile) {
	if (tokenizedBASICFile.outputFile){
		const configuration = vscode.workspace.getConfiguration('c64basicv2');
		const showDiagnostics : boolean | undefined = configuration.get("showDiagnostics");
		const x64scCommand : string | undefined = configuration.get("x64sc");

		const rootFolder = vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders[0].uri.path : undefined;
		let x64scOptions = [
			tokenizedBASICFile.outputFile
		];
		if (showDiagnostics) {
			const output = vscode.window.createOutputChannel('c64basicv2 Run');
            output.show(true);
            output.appendLine("");
            output.appendLine("**** COMMODORE 64 BASIC V2 ****");
            output.appendLine("c64basicv2 diagnostics");
            output.appendLine("");
            output.appendLine(`Platform                 : ${process.platform}`);
            output.appendLine(`Current Dir              : ${rootFolder}`);
            output.appendLine(`Emulator Runtime (x64sc) : ${x64scCommand}`);
            output.appendLine(`Emulator Options         :`);
            output.appendLine("");
            for (var i = 0; i < x64scOptions.length; i++) {
                output.appendLine(`  ${x64scOptions[i]}`);
            }
            output.appendLine("");
            output.appendLine("");
		}
		if (x64scCommand) {
			let x64sc = spawn(x64scCommand, x64scOptions,
				{
					detached: true,
					stdio: 'inherit',
					shell: true,
					cwd: rootFolder
				});
			x64sc.unref();
		}
        return;
	}
};
