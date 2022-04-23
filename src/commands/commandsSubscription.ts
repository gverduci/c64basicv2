import * as vscode from 'vscode';
import * as autoProofreaderCommand from './automaticProofreader';
import * as convert from './convert';
import * as run from './run';
export function subscription(context: vscode.ExtensionContext) {

	// commands subscription
	const commands = [
		{name: "c64basicv2.automaticProofreader", callback: () => autoProofreaderCommand.automaticProofreader()},
		{name: "c64basicv2.convert", callback: () => convert.convert()},
		{name: "c64basicv2.convert-run", callback: () => run.run(convert.convert())}
	];

	commands.forEach((command) => {
		let disposable = vscode.commands.registerCommand(command.name, command.callback);
		context.subscriptions.push(disposable);
	});
}