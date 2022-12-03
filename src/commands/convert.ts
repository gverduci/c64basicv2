import * as vscode from 'vscode';
import { spawnSync } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import * as TokenizedBASICFile from "./tokenizedBASICFile";
import { TextDecoder } from 'util';
import * as formatter from "./outputFormatter";
import * as utils from '../utils';

export function convert (outputChannel: vscode.OutputChannel) : TokenizedBASICFile.TokenizedBASICFile {
	const editor = vscode.window.activeTextEditor;
	formatter.infoFormatter("Convert...", outputChannel);
	if (editor) {
		const document = editor.document;
		const configuration = vscode.workspace.getConfiguration('c64basicv2');
		const outputRelativeDir : string | undefined = configuration.get("convertOutputDir");
		let command : string | undefined = configuration.get("petcat");
		if (command && fs.existsSync(command)) {
			const rootFolder = vscode.workspace.workspaceFolders ? path.normalize(vscode.workspace.workspaceFolders[0].uri.fsPath) : undefined;
			const fileBasename = path.basename(document.fileName);
			const fileExt = path.extname(document.fileName);
			if (utils.isC64basicv2Extension(fileExt)){
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

					formatter.outputFormatter(process.platform, rootFolder, document.fileName, command, petcatArgs, outputChannel);

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
								formatter.errorFormatter(`${fileBasename} conversion error!`, outputChannel);
								formatter.errorFormatter(new TextDecoder().decode(petcat.stderr), outputChannel);
							} else{
								vscode.window.showInformationMessage(`${fileBasename} converted!`);
								formatter.infoFormatter(`${fileBasename} converted!`, outputChannel);
							}
						}
						return {outputFile, outputDir};
					}
				}else{
					let message = "";
					if (outputDir){
						message = `c64basicv2: "${outputDir}" folder doesn't exist!`;
					}else{
						message = `c64basicv2.convertOutputDir: output folder error!`;
					}
					vscode.window.showErrorMessage(message);
					formatter.errorFormatter(message, outputChannel);
				}
			}
		}else{
			const message = `c64basicv2.petcat: configuration error!`;
			vscode.window.showErrorMessage(message);
			formatter.errorFormatter(message, outputChannel);
		}
	}
	return {outputFile:"", outputDir:""};
};
