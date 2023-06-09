import {
    Webview,
    ExtensionContext,
    WebviewViewProvider,
    CancellationToken,
    WebviewView,
    WebviewViewResolveContext,
} from 'vscode';
import { Disposable, Uri, window } from 'vscode';
import { getUri } from '../utils/getUri';

export type WebviewIds = 'sid' | 'chars';

export interface Message {
    command: string;
    text?: string;
    data?: unknown;
}

export abstract class WebviewViewBase implements WebviewViewProvider, Disposable {
    protected readonly disposables: Disposable[] = [];
    protected _view: WebviewView | undefined;
    protected isReady = false;
    private _disposableView: Disposable | undefined;
    private _disposables: Disposable[] = [];

    constructor(
        protected readonly context: ExtensionContext,
        public readonly id: `c64basicv2.view.${WebviewIds}`,
        private readonly webviewId: WebviewIds,
        title: string,
    ) {
        this._title = title;
        this.disposables.push(window.registerWebviewViewProvider(id, this));
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async resolveWebviewView(webviewView: WebviewView, context: WebviewViewResolveContext<unknown>, token: CancellationToken): Promise<void> {
        this._view = webviewView;
        const localResourceRoots = [
            Uri.joinPath(this.context.extensionUri, "out"), 
            Uri.joinPath(this.context.extensionUri, "webview-ui", this.webviewId, "build"), 
            Uri.joinPath(this.context.extensionUri, "resources"), 
            Uri.joinPath(this.context.extensionUri, "node_modules", "@vscode/codicons", "dist"),
            Uri.joinPath(this.context.extensionUri, "webview-ui", this.webviewId, "node_modules", "@vscode/codicons", "dist")];
            
        webviewView.webview.options = {
            enableCommandUris: true,
            enableScripts: true,
            localResourceRoots
        };
        webviewView.title = this._title;

        this._disposableView = Disposable.from(
            this._view.onDidDispose(this.onViewDisposed, this, this._disposables),
        );

        await this.refresh();
    }

    dispose() {
        this.disposables.forEach(d => void d.dispose());
        this._disposableView?.dispose();
    }

    private _title: string;
    get title(): string {
        return this._view?.title ?? this._title;
    }
    set title(title: string) {
        this._title = title;
        if (this._view) {
            this._view.title = title;
        }
    }

    protected async refresh(force?: boolean): Promise<void> {
        if (this._view) {
            this.isReady = false;
            const html = await this.getHtml(this._view.webview);
            if (force) {
                this._view.webview.html = '';
            }

            if (this._view.webview.html === html) {
                this.isReady = true;
                return;
            }

            this._view.webview.html = html;
            this._setWebviewMessageListener(this._view.webview);
        }
    }

    // async show(options?: { preserveFocus?: boolean }) {}

    abstract onMessageReceived(data: Message): void;

    private onViewDisposed() {
        this.isReady = false;
        this._disposableView?.dispose();
        this._disposableView = undefined;
        this._view = undefined;
        // Dispose of all disposables (i.e. commands) for the current webview panel
        while (this._disposables.length) {
            const disposable = this._disposables.pop();
            if (disposable) {
                disposable.dispose();
            }
        }
    }

    private getNonce() {
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 32; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    /**
   * Sets up an event listener to listen for messages passed from the webview context and
   * executes code based on the message that is recieved.
   *
   * @param webview A reference to the extension webview
   * @param context A reference to the extension context
   */
    private _setWebviewMessageListener(webview: Webview) {
        webview.onDidReceiveMessage(
            (message: Message) => {
                this.onMessageReceived(message);
            },
            undefined,
            this._disposables
        );
    }

    protected sendDataToView(message: Message) {
        if (this._view){
            this._view.webview.postMessage(message);
        }
    }

    protected async getTemplateHtml(webview: Webview, scriptUri: Uri, stylesUri: Uri, nonce: string): Promise<string> {
        return /*html*/ `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
            <meta name="theme-color" content="#000000">
            <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}';">
            <link rel="stylesheet" type="text/css" href="${stylesUri}">
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
    private async getHtml(webview: Webview): Promise<string> {
        const scriptUri = getUri(webview, this.context.extensionUri, [
            'webview-ui',
            this.webviewId,
            "build",
            "static",
            "js",
            "main.js",
        ]);
        const stylesUri = getUri(webview, this.context.extensionUri, [
            'webview-ui',
            this.webviewId,
            "build",
            "static",
            "css",
            "main.css",
        ]);
        const nonce = this.getNonce();
        return this.getTemplateHtml(webview, scriptUri, stylesUri, nonce);
    }
}
