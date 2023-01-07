import * as vscode from 'vscode';
import * as autoProofreaderCommand from './automaticProofreader';
import * as convert from './convert';
import * as run from './run';
import * as copySpecialCharacter from './copySpecialCharacter';
import * as preview from './preview';
export function subscription(context: vscode.ExtensionContext, outputChannel: vscode.OutputChannel) {
	// commands subscription
	const commands = [
		{name: "c64basicv2.automaticProofreader", callback: () => autoProofreaderCommand.automaticProofreader(outputChannel)},
		{name: "c64basicv2.convert", callback: () => convert.convert(outputChannel)},
		{name: "c64basicv2.convert-run", callback: () => run.run(convert.convert(outputChannel), outputChannel)},
		{name: "c64basicv2.command.copySpecialCharacter", callback: (info:any) => copySpecialCharacter.copy(info, outputChannel)},
		{name: "c64basicv2.command.copySpecialCharacterChr", callback: (info:any) => copySpecialCharacter.copyChr(info, outputChannel)},
		{name: "c64basicv2.commands.openPreview", callback: (info:any) => preview.openPreview(info, outputChannel, context)},
		{name: "c64basicv2.commands.refreshPreview", callback: (info:any) => preview.refreshPreview(info, outputChannel, context)},
	];

	commands.forEach((command) => {
		let disposable = vscode.commands.registerCommand(command.name, command.callback);
		context.subscriptions.push(disposable);
	});
}