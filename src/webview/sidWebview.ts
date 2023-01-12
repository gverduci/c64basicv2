import { ExtensionContext, SnippetString, window } from "vscode";
import { Message, WebviewViewBase } from "./WebviewViewBase";

export class SIDWebview extends WebviewViewBase {
    constructor(context: ExtensionContext) {
        super(
            context,
            'c64basicv2.view.sid',
            'sid.html',
            'sid.js',
            'SID Register',
        );
    }

    override onMessageReceived(data: Message) {
        switch (data.type) {
            case 'string':
            {
                window.activeTextEditor?.insertSnippet(new SnippetString(data.value));
                break;
            }
            case 'snippet':
            {
                window.activeTextEditor?.insertSnippet(new SnippetString(data.value).appendPlaceholder("number", 1));
                break;
            }
        }
    }
}
