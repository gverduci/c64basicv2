import {
	window,
	workspace,
} from 'vscode';
import * as autoProofreaderDecorator from './automaticProofreader';
import { isTextEditor } from '../utils';

export class DecoratorsSubscription {
    private timeout: ReturnType<typeof setTimeout> | undefined;
    private showInlineAutomaticProofreader: boolean | undefined;
    constructor() {
        this.showInlineAutomaticProofreader = workspace.getConfiguration('c64basicv2').get('showInlineAutomaticProofreader');
	}

    public onReady(): void {
		this.triggerUpdateDecorations(false);
	}

    public onActiveTextEditorChanged(): void {
		this.triggerUpdateDecorations(true);
	}

    private triggerUpdateDecorations(throttle: boolean) {
        if (window.activeTextEditor !== null && !isTextEditor(window.activeTextEditor)) { return; };
		if (this.showInlineAutomaticProofreader) {
			if (this.timeout) {
				clearTimeout(this.timeout);
				this.timeout = undefined;
			}
			if (throttle) {
				this.timeout = setTimeout(() => autoProofreaderDecorator.updateDecorations(window.activeTextEditor), 500);
			} else {
				autoProofreaderDecorator.updateDecorations(window.activeTextEditor);
			}
		}
	}
}

export const decorators = new DecoratorsSubscription();