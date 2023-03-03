import * as vscode from "vscode"
import { Utils } from "vscode-uri"

export type TaggedQuickPickItem<T> = vscode.QuickPickItem & { data?: T }
