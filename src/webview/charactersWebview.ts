import { ExtensionContext, SnippetString, Uri, Webview, window } from "vscode";
import { Message, WebviewViewBase } from "./WebviewViewBase";
import { getUri } from "../utils/getUri";
import { controlCharsObjects } from "../helpers/controlCharsHelper";

export class CharactersWebview extends WebviewViewBase {
    constructor(context: ExtensionContext) {
        super(
            context,
            'c64basicv2.view.chars',
            'chars',
            'Characters',
        );
    }

    override async getTemplateHtml(webview: Webview, scriptUri: Uri, stylesUri: Uri, nonce: string): Promise<string> {
        const fontSrc = getUri(webview, this.context.extensionUri, ['resources', 'fonts', 'PetMe64.ttf']);
        return /*html*/ `
		<!DOCTYPE html>
		<html lang="en">
		  <head>
			<meta charset="utf-8">
			<meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
			<meta name="theme-color" content="#000000">
			<meta http-equiv="Content-Security-Policy" content="default-src ${webview.cspSource}; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}';">
			<link rel="stylesheet" type="text/css" href="${stylesUri}">
			<title>Characters</title>
            <style>
				@font-face {
					font-family: 'PetMe64';
					src: URL('${fontSrc}') format('truetype');
			  	}
			</style>
		  </head>
		  <body>
			<noscript>You need to enable JavaScript to run this app.</noscript>
			<div id="root"></div>
			<script defer="defer" nonce="${nonce}" src="${scriptUri}"></script>
		  </body>
		</html>
	  `;
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
            case 'getChars':
                {
                    const chars = controlCharsObjects();
                    this.sendDataToView({ command: 'getCharsResponse', data: chars });
                    break;
                }

        }
    }
}
