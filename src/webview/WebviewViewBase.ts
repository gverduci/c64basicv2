import { TextDecoder } from 'util';
import {
	Webview,
	ExtensionContext,
	WebviewViewProvider,
	CancellationToken,
	WebviewView,
	WebviewViewResolveContext,
} from 'vscode';
import { Disposable, Uri, window, workspace } from 'vscode';

export type WebviewIds = 'sid' | 'aaa' | 'bbb' | 'ccc';

export interface Message {
	type: string;
	value: string;
}

export abstract class WebviewViewBase implements WebviewViewProvider, Disposable {
	protected readonly disposables: Disposable[] = [];
	protected _view: WebviewView | undefined;
	protected isReady: boolean = false;
	private _disposableView: Disposable | undefined;

	constructor(
		protected readonly context: ExtensionContext,
		public readonly id: `c64basicv2.view.${WebviewIds}`,
		private readonly fileName: string,
		private readonly scriptUri: string,
		title: string,
	) {
		this._title = title;
		this.disposables.push(window.registerWebviewViewProvider(id, this));
	}
	async resolveWebviewView(webviewView: WebviewView, context: WebviewViewResolveContext<unknown>, token: CancellationToken): Promise<void> {
		this._view = webviewView;
		webviewView.webview.options = {
			enableCommandUris: true,
			enableScripts: true,
		};
		webviewView.title = this._title;

		this._disposableView = Disposable.from(
			this._view.onDidDispose(this.onViewDisposed, this),
			this._view.webview.onDidReceiveMessage(data => this.onMessageReceived(data)
			)
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
		}
	}

	async show(options?: { preserveFocus?: boolean }) {
		;
	}
	
	abstract onMessageReceived(data: Message): void;
	
	private onViewDisposed() {
		this.isReady = false;
		this._disposableView?.dispose();
		this._disposableView = undefined;
		this._view = undefined;
	}

	private getNonce() {
		let text = '';
		const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		for (let i = 0; i < 32; i++) {
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		}
		return text;
	}

	private async getHtml(webview: Webview): Promise<string> {
		const webRootUri = Uri.joinPath(this.context.extensionUri, 'resources', 'webviews');
		const uri = Uri.joinPath(webRootUri, this.fileName);
		const scriptUri = Uri.joinPath(webRootUri, this.scriptUri);
		const content = new TextDecoder('utf8').decode(await workspace.fs.readFile(uri));
		const html = content.replace(
			/\$\{(nonce|scriptUri|webRootUri)\}/g,
			(_substring: string, token: string) => {
				switch (token) {
					case 'nonce':
						return this.getNonce();
					case 'scriptUri':
						return webview.asWebviewUri(scriptUri).toString();
					case 'webRootUri':
						return webview.asWebviewUri(webRootUri).toString();
					default:
						return '';
				}
			},
		);

		return html;
	}
}
