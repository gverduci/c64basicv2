import * as vscode from 'vscode';
import { spawnSync } from 'child_process';
import * as path from 'path';
import * as TokenizedBASICFile from "./tokenizedBASICFile";

export function convert () : TokenizedBASICFile.TokenizedBASICFile {
	const editor = vscode.window.activeTextEditor;
	if (editor) {
		const document = editor.document;
		const configuration = vscode.workspace.getConfiguration('c64basicv2');
		const showDiagnostics : boolean | undefined = configuration.get("showDiagnostics");
		const outputRelativeDir : string | undefined = configuration.get("convertOutputDir");
		const petcatCommand : string | undefined = configuration.get("petcat");
		const rootFolder = vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders[0].uri.path : undefined;
		const fileBasename = path.basename(document.fileName);
		const outputDir = `.${path.sep}${outputRelativeDir}${path.sep}`;
		const outputFile = `${outputDir}${fileBasename}`;
		const petcatOptions = [
			"-w2", 
			"-o",
			outputFile,
			"--",
			document.fileName
		];
		
		if (showDiagnostics) {
			const output = vscode.window.createOutputChannel('c64basicv2 convert');
            output.show(true);
            output.appendLine("");
            output.appendLine("**** COMMODORE 64 BASIC V2 ****");
            output.appendLine("c64basicv2 diagnostics");
            output.appendLine("");
            output.appendLine(`Platform      : ${process.platform}`);
            output.appendLine(`Current Dir   : ${rootFolder}`);
            output.appendLine(`petcat        : ${petcatCommand}`);
            output.appendLine(`petcat Options:`);
            output.appendLine("");
            for (var i = 0; i < petcatOptions.length; i++) {
                output.appendLine(`  ${petcatOptions[i]}`);
            }
            output.appendLine("");
            output.appendLine("");
		}

		if (petcatCommand){
			let petcat = spawnSync(petcatCommand, petcatOptions,{cwd: rootFolder});

			if (petcat){
				let errorCode = petcat.status;
				if (errorCode && errorCode > 0) {
					console.log(petcat.stderr.toString());
				} else{
					vscode.window.showInformationMessage(`${fileBasename} converted!`);
				}
			}
			return {outputFile, outputDir};
	    }
	}
	return {outputFile:"", outputDir:""};
};
