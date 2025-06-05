import { ExtensionContext, SnippetString, window, Uri, Webview, Range } from "vscode";
import { Message, WebviewViewBase } from "./WebviewViewBase";
import { getUri } from "../utils/getUri";

export class VICWebview extends WebviewViewBase {
  constructor(context: ExtensionContext) {
    super(context, "c64basicv2.view.vic", "vic", "VIC");
  }

  override onMessageReceived(data: Message) {
    switch (data.command) {
      case "text": {
        window.activeTextEditor?.insertSnippet(new SnippetString(data.text));
        break;
      }
      case "snippet": {
        window.activeTextEditor?.insertSnippet(
          new SnippetString(data.text).appendPlaceholder("number", 1),
        );
        break;
      }
      case 'getSelection':
      {
          const editor = window.activeTextEditor;
          const selection = editor?.selection;
          if (selection && !selection.isEmpty) {
            const selectionRange = new Range(selection.start.line, selection.start.character, selection.end.line, selection.end.character);
            const highlighted = editor.document.getText(selectionRange);
            this.sendDataToView({ command: 'getSelectionResponse', data: highlighted });
        } else {
          this.sendDataToView({ command: 'getSelectionResponse', data: "" });
        }
          break;
      }
    }
  }
  override async getTemplateHtml(
    webview: Webview,
    scriptUri: Uri,
    stylesUri: Uri,
    nonce: string,
  ): Promise<string> {
    const codiconsUri = getUri(webview, this.context.extensionUri, [
      "webview-ui",
      "vic",
      "node_modules",
      "@vscode/codicons",
      "dist",
      "codicon.css",
    ]);
    const codiconsFontUri = getUri(webview, this.context.extensionUri, [
      "webview-ui",
      "vic",
      "node_modules",
      "@vscode/codicons",
      "dist",
      "codicon.ttf",
    ]);
    return /*html*/ `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
            <meta name="theme-color" content="#000000">
            <meta http-equiv="Content-Security-Policy" content="default-src 'none'; font-src ${webview.cspSource}; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}';">
            <link rel="stylesheet" type="text/css" href="${stylesUri}">
            <title>${this.title}</title>
            <style>
              @font-face {
                font-family: 'codicon';
                src: URL('${codiconsFontUri}') format('truetype');
                }
            </style>
            <link rel="stylesheet" type="text/css" href="${codiconsUri}"/>
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
