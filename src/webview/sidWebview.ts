import { ExtensionContext, SnippetString, window } from "vscode";
import { Message, WebviewViewBase } from "./WebviewViewBase";

export class SIDWebview extends WebviewViewBase {
    constructor(context: ExtensionContext) {
        super(
            context,
            'c64basicv2.view.sid',
            'sid',
            'SID Register',
        );
    }

    override onMessageReceived(data: Message) {
        switch (data.command) {
            case 'text':
            {
                window.activeTextEditor?.insertSnippet(new SnippetString(data.text));
                break;
            }
            case 'snippet':
            {
                window.activeTextEditor?.insertSnippet(new SnippetString(data.text).appendPlaceholder("number", 1));
                break;
            }
        }
    }
}
