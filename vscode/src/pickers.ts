import type { DeviceConfig } from "@devicescript/interop"
import * as vscode from "vscode"
import { Utils } from "vscode-uri"
import { openDocUri } from "./commands"

export type TaggedQuickPickItem<T> = vscode.QuickPickItem & { data?: T }

export async function showConfirmBox(title: string): Promise<boolean> {
    const confirm = await vscode.window.showQuickPick(["yes", "no"], {
        title,
    })
    return confirm === "yes"
}

export async function showQuickPickBoard(
    title: string,
    boards: DeviceConfig[]
) {
    const res = await vscode.window.showQuickPick(
        <TaggedQuickPickItem<{ board?: DeviceConfig }>[]>[
            {
                label: "Help me choose...",
                detail: "Identify your board or find where to get one.",
            },
            ...boards.map(board => ({
                data: { board },
                label: board.devName,
                description: board.id,
                detail: board.$description,
            })),
        ],
        {
            title,
            canPickMany: false,
            matchOnDetail: true,
            matchOnDescription: true,
        }
    )
    if (!res) return // user escaped

    if (!res.data?.board) {
        openDocUri("devices")
        return undefined
    }

    return res.data.board
}
