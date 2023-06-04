import { ExtensionContext, SnippetString, window, Uri, Webview } from "vscode";
import { Message, WebviewViewBase } from "./WebviewViewBase";
import { getUri } from "../utils/getUri";

export class SIDWebview extends WebviewViewBase {
    constructor(context: ExtensionContext) {
        super(
            context,
            'c64basicv2.view.sid',
            'sid',
            'SID',
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
    override async getTemplateHtml(webview: Webview, scriptUri: Uri, stylesUri: Uri, nonce: string): Promise<string> {
        const codiconsUri = getUri(webview, this.context.extensionUri, ['node_modules', '@vscode/codicons', 'dist', 'codicon.css']);
        return /*html*/ `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
            <meta name="theme-color" content="#000000">
            <meta http-equiv="Content-Security-Policy" content="default-src 'none'; font-src ${webview.cspSource}; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}';">
            <link rel="stylesheet" type="text/css" href="${stylesUri}">
            <link rel="stylesheet" type="text/css" href="${codiconsUri}"/>
            <title>${this.title}</title>
          </head>
          <body>
            <noscript>You need to enable JavaScript to run this app.</noscript>
            <div id="root"></div>
            <script defer="defer" nonce="${nonce}" src="${scriptUri}"></script>
          </body>
        </html>
      `;
    }
}
