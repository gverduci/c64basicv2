import * as vscode from 'vscode';
import { SpecialCharacter } from './SpecialCharacter';
import { SpecialCharactersModel } from './SpecialCharactersModel';
import * as path from 'path';

export class SpecialCharacters implements vscode.TreeDataProvider<SpecialCharacter> {

    private _onDidChangeTreeData: vscode.EventEmitter<any> = new vscode.EventEmitter<any>();
    readonly onDidChangeTreeData: vscode.Event<any> = this._onDidChangeTreeData.event;

    constructor(context: vscode.ExtensionContext) {
        this.extensionpath = context.extensionPath || "";
    }

    private extensionpath: string;

    private model: SpecialCharactersModel | undefined;

    refresh(): void {
        this._onDidChangeTreeData.fire(null);
    }

    public getTreeItem(item: SpecialCharacter): vscode.TreeItem {
        let label = `${item.id} - ${item.symbolic}`;
        if (item.synonyms.length > 0){
            label = `${label} (${item.synonyms.join(', ')})`;
        }
        return {
            id:`${item.id}`,
            label,
            collapsibleState: vscode.TreeItemCollapsibleState.None, // item.isGroup ? TreeItemCollapsibleState.Collapsed : TreeItemCollapsibleState.None,
            contextValue: this.getViewItem(item),
            description: item.description,
            iconPath: {
                light: this.getIcon('light', item),
                dark: this.getIcon('dark', item)
            }
        };
    }

    private getViewItem(item: SpecialCharacter): string {
        let type = 'Item'; // Group
        return type;
    }

    private getIcon(shade: string, item: SpecialCharacter) {
        const name = `uni${item.unicode.charCodeAt(0).toString(16).toUpperCase()}.svg`;
        const icon = path.join(this.extensionpath, 'resources', 'chars', name);
        console.log(icon);
        return icon;
    }

    public getChildren(item?: SpecialCharacter): undefined | SpecialCharacter[] | Thenable<SpecialCharacter[]> {
        if (!item) {
            if (!this.model) {
                this.model = new SpecialCharactersModel();
            }

            return this.model.roots;
        }

        return this.model?.getChildren(item);
    }
}
