import * as vscode from 'vscode';
import { spawnSync } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import * as TokenizedBASICFile from "./tokenizedBASICFile";

export function convert () : TokenizedBASICFile.TokenizedBASICFile {
	const editor = vscode.window.activeTextEditor;
	if (editor) {
		const document = editor.document;
		const configuration = vscode.workspace.getConfiguration('c64basicv2');
		const showDiagnostics : boolean | undefined = configuration.get("showDiagnostics");
		const outputRelativeDir : string | undefined = configuration.get("convertOutputDir");
		let command : string | undefined = configuration.get("petcat");
		if (command && fs.existsSync(command)) {
			const rootFolder = vscode.workspace.workspaceFolders ? path.normalize(vscode.workspace.workspaceFolders[0].uri.path) : undefined;
			const fileBasename = path.basename(document.fileName);
			const outputDir = `${rootFolder}${path.sep}${outputRelativeDir}`;
			const outputFile = `${outputDir}${path.sep}${fileBasename}`;
			if (outputDir && fs.existsSync(outputDir)) {
				const basePetcatOptions = [
					"-w2", 
					"-o",
					outputFile,
					"--",
					document.fileName
				];
				let petcatOptions = [];
				if (process.platform === "win32"){
					petcatOptions = ['/c', `"${command}"`];
						basePetcatOptions.forEach(o=>{
							let arg = o;
							if (arg.indexOf("\\c:\\") > -1){
								arg=arg.replace("\\c:\\", "c:\\");
							}
							if (arg.indexOf(" ") > -1){
								arg = `"${arg}`;
							}
							petcatOptions.push(arg);
						});
					command = process.env.ComSpec || "cmd.exe";
				} else{
					petcatOptions = basePetcatOptions;
				}		
		
				if (showDiagnostics) {
					const output = vscode.window.createOutputChannel('c64basicv2 convert');
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
					for (var i = 0; i < petcatOptions.length; i++) {
						output.appendLine(`  ${petcatOptions[i]}`);
					}
					output.appendLine("");
					output.appendLine("");
				}

				if (command){
					const petcat = spawnSync(command, petcatOptions, {shell: true});
					if (petcat){
						let errorCode = petcat.status;
						if (errorCode && errorCode > 0) {
							vscode.window.showErrorMessage(`${fileBasename} conversion error!`);
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
