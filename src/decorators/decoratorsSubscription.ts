import {
    window,
    workspace,
    ExtensionContext
} from 'vscode';
import * as autoProofreaderDecorator from './automaticProofreader';
import * as specialCharacterDecorator from './specialCharacterDecorator';
import { isTextEditor } from '../utils';

export class DecoratorsSubscription {
    private timeout: ReturnType<typeof setTimeout> | undefined;

    public onReady(context: ExtensionContext): void {
        this.triggerUpdateDecorations(false, context);
    }

    public onActiveTextEditorChanged(context: ExtensionContext): void {
        this.triggerUpdateDecorations(true, context);
    }

    private triggerUpdateDecorations(throttle: boolean, context: ExtensionContext) {
        if (window.activeTextEditor !== null && !isTextEditor(window.activeTextEditor)) { return; }
        if (
            workspace.getConfiguration('c64basicv2').get('showInlineAutomaticProofreader') ||
            workspace.getConfiguration('c64basicv2').get('showCtrlCharacterInfo')
        ) {
            if (this.timeout) {
                clearTimeout(this.timeout);
                this.timeout = undefined;
            }
            if (throttle) {
                this.timeout = setTimeout(() => {
                    if (workspace.getConfiguration('c64basicv2').get('showInlineAutomaticProofreader')) {
                        autoProofreaderDecorator.updateDecorations(window.activeTextEditor);
                    }
                    if (workspace.getConfiguration('c64basicv2').get('showCtrlCharacterInfo')) {
                        specialCharacterDecorator.updateDecorations(window.activeTextEditor, context);
                    }
                }, 500);
            } else {
                if (workspace.getConfiguration('c64basicv2').get('showInlineAutomaticProofreader')) {
                    autoProofreaderDecorator.updateDecorations(window.activeTextEditor);
                }
                if (workspace.getConfiguration('c64basicv2').get('showCtrlCharacterInfo')) {
                    specialCharacterDecorator.updateDecorations(window.activeTextEditor, context);
                }
            }
        }
    }
}

export const decorators = new DecoratorsSubscription();