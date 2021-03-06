import * as vscode from 'vscode';
import { spawn } from 'child_process';
import * as fs from 'fs';
import * as TokenizedBASICFile from "./tokenizedBASICFile";
export function run (tokenizedBASICFile: TokenizedBASICFile.TokenizedBASICFile) {
	if (tokenizedBASICFile.outputFile){
		const configuration = vscode.workspace.getConfiguration('c64basicv2');
		const showCommandLogs : boolean | undefined = configuration.get("showCommandLogs");
		let command : string | undefined = configuration.get("x64sc");
		if (command && fs.existsSync(command)) {
			const rootFolder = vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders[0].uri.path : undefined;
			let baseX64scOptions = [
				tokenizedBASICFile.outputFile
			];

			let x64scOptions = [];
			if (process.platform === "win32"){
				x64scOptions = ['/c', `"${command}"`];
				baseX64scOptions.forEach(o=>{
					let arg = o;
					if (arg.indexOf("\\c:\\") > -1){
						arg=arg.replace("\\c:\\", "c:\\");
					}
					if (arg.indexOf(" ") > -1){
						arg = `"${arg}`;
					}
					x64scOptions.push(arg);
				});
				command = process.env.ComSpec || "cmd.exe";
			} else{
				x64scOptions = baseX64scOptions;
			}

			if (showCommandLogs) {
				const output = vscode.window.createOutputChannel('c64basicv2 Run');
				output.show(true);
				output.appendLine("");
				output.appendLine("**** COMMODORE 64 BASIC V2 ****");
				output.appendLine("c64basicv2 diagnostics");
				output.appendLine("");
				output.appendLine(`Platform       : ${process.platform}`);
				output.appendLine(`Current Dir    : ${rootFolder}`);
				output.appendLine(`Current File   : ${tokenizedBASICFile.outputFile}`);
				output.appendLine(`Command        : ${command}`);
				output.appendLine(`Command Options:`);
				output.appendLine("");
				for (var i = 0; i < x64scOptions.length; i++) {
					output.appendLine(`  ${x64scOptions[i]}`);
				}
				output.appendLine("");
				output.appendLine("");
			}
			if (command) {
				let x64sc = spawn(command, x64scOptions,
					{
						detached: true,
						stdio: 'inherit',
						shell: true
					});
				x64sc.unref();
			}
		}else{
			vscode.window.showErrorMessage(`c64basicv2.x64sc: configuration error!`);
		}
	}
	return;
};
