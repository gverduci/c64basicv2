import * as vscode from 'vscode';
import { spawnSync } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import * as TokenizedBASICFile from "./tokenizedBASICFile";
import { TextDecoder } from 'util';

export function convert () : TokenizedBASICFile.TokenizedBASICFile {
	const editor = vscode.window.activeTextEditor;
	if (editor) {
		const document = editor.document;
		const configuration = vscode.workspace.getConfiguration('c64basicv2');
		const showCommandLogs : boolean | undefined = configuration.get("showCommandLogs");
		const outputRelativeDir : string | undefined = configuration.get("convertOutputDir");
		let command : string | undefined = configuration.get("petcat");
		if (command && fs.existsSync(command)) {
			let rootFolder = vscode.workspace.workspaceFolders ? path.normalize(vscode.workspace.workspaceFolders[0].uri.fsPath) : undefined;
			if (rootFolder  && process.platform === "win32"){
				if (rootFolder.indexOf("\\c:\\") > -1){
					rootFolder=rootFolder.replace("\\c:\\", "c:\\");
				}
			}
			const fileBasename = path.basename(document.fileName);
			const outputDir = `${rootFolder}${path.sep}${outputRelativeDir}`;
			
			const outputFile = `${outputDir}${path.sep}${fileBasename}`;
			if (outputDir && fs.existsSync(outputDir)) {
				const basePetcatArgs = [
					"-w2", 
					"-o",
					outputFile,
					"--",
					document.fileName
				];
				let petcatArgs: string[] = [];

				basePetcatArgs.forEach(o=>{
					let arg = o;
					if (arg.indexOf(" ") > -1){
						arg = `"${arg}"`;
					}
					petcatArgs.push(arg);
				});

				let output;
				if (showCommandLogs) {
					output = vscode.window.createOutputChannel('c64basicv2 convert');
					output.show(true);
					output.appendLine("");
					output.appendLine("**** COMMODORE 64 BASIC V2 ****");
					output.appendLine("c64basicv2 diagnostics");
					output.appendLine("");
					output.appendLine(`Platform       : ${process.platform}`);
					output.appendLine(`Current Dir    : ${rootFolder}`);
					output.appendLine(`Current File   : ${document.fileName}`);
					output.appendLine(`Command        : ${command}`);
					output.appendLine(`Command Options:`);
					output.appendLine("");
					for (var i = 0; i < petcatArgs.length; i++) {
						output.appendLine(`  ${petcatArgs[i]}`);
					}
					output.appendLine("");
					output.appendLine("");
				}

				if (command){
					const cmd = '.' + path.sep + path.basename(command);
					const petcat = spawnSync(cmd, petcatArgs, {
						shell: true,
						windowsVerbatimArguments: true, 
						cwd: path.dirname(command)
					});
					
					if (petcat){
						let errorCode = petcat.status;
						if (errorCode && errorCode > 0) {
							vscode.window.showErrorMessage(`${fileBasename} conversion error!`);
							if (showCommandLogs && output) {
								output.appendLine(`${fileBasename} conversion error!`);
								output.appendLine(new TextDecoder().decode(petcat.stderr));
							}
						} else{
							vscode.window.showInformationMessage(`${fileBasename} converted!`);
						}
					}
					return {outputFile, outputDir};
				}
			}else{
				if (outputDir){
					vscode.window.showErrorMessage(`c64basicv2: "${outputDir}" folder doesn't exist!`);
				}else{
					vscode.window.showErrorMessage(`c64basicv2.convertOutputDir: output folder error!`);
				}
			}
		}else{
			vscode.window.showErrorMessage(`c64basicv2.petcat: configuration error!`);
		}
	}
	return {outputFile:"", outputDir:""};
};
