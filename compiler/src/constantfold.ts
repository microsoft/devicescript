import * as ts from "typescript"
import { SyntaxKind as SK } from "typescript"

export interface Folded {
    val: any
}

function unaryOpConst(tok: SK, aa: Folded): Folded {
    if (!aa) return null
    const a = aa.val
    switch (tok) {
        case SK.PlusToken:
            return { val: +a }
        case SK.MinusToken:
            return { val: -a }
        case SK.TildeToken:
            return { val: ~a }
        case SK.ExclamationToken:
            return { val: !a }
        default:
            return null
    }
}

function binaryOpConst(tok: SK, aa: Folded, bb: Folded): Folded {
    if (!aa || !bb) return null
    const a = aa.val
    const b = bb.val
    switch (tok) {
        case SK.PlusToken:
            return { val: a + b }
        case SK.MinusToken:
            return { val: a - b }
        case SK.SlashToken:
            return { val: a / b }
        case SK.PercentToken:
            return { val: a % b }
        case SK.AsteriskToken:
            return { val: a * b }
        case SK.AsteriskAsteriskToken:
            return { val: a ** b }
        case SK.AmpersandToken:
            return { val: a & b }
        case SK.BarToken:
            return { val: a | b }
        case SK.CaretToken:
            return { val: a ^ b }
        case SK.LessThanLessThanToken:
            return { val: a << b }
        case SK.GreaterThanGreaterThanToken:
            return { val: a >> b }
        case SK.GreaterThanGreaterThanGreaterThanToken:
            return { val: a >>> b }
        case SK.LessThanEqualsToken:
            return { val: a <= b }
        case SK.LessThanToken:
            return { val: a < b }
        case SK.GreaterThanEqualsToken:
            return { val: a >= b }
        case SK.GreaterThanToken:
            return { val: a > b }
        case SK.EqualsEqualsToken:
            return { val: a == b }
        case SK.EqualsEqualsEqualsToken:
            return { val: a === b }
        case SK.ExclamationEqualsEqualsToken:
            return { val: a !== b }
        case SK.ExclamationEqualsToken:
            return { val: a != b }
        case SK.BarBarToken:
            return { val: a || b }
        case SK.AmpersandAmpersandToken:
            return { val: a && b }
        default:
            return null
    }
}

export function constantFold(
    fallback: (e: ts.Expression) => Folded,
    e0: ts.Expression
): Folded {
    return constantFoldMem(e0)

    function constantFoldMem(expr: ts.Expression): Folded {
        if (!expr) return null
        const ee = expr as ts.Expression & { __ds_folded: Folded }
        if (ee.__ds_folded === undefined) {
            ee.__ds_folded = null // make sure we don't come back here recursively
            const res = constantFoldCore(expr)
            ee.__ds_folded = res
        }
        return ee.__ds_folded
    }

    function constantFoldCore(expr: ts.Expression): Folded {
        if (!expr) return null
        if (isTemplateOrStringLiteral(expr)) {
            return { val: expr.text }
        } else if (ts.isPrefixUnaryExpression(expr)) {
            const inner = constantFoldMem(expr.operand)
            return unaryOpConst(expr.operator, inner)
        } else if (ts.isBinaryExpression(expr)) {
            const left = constantFoldMem(expr.left)
            if (!left) return null
            const right = constantFoldMem(expr.right)
            if (!right) return null
            return binaryOpConst(expr.operatorToken.kind, left, right)
        } else if (ts.isNumericLiteral(expr)) {
            const v = parseFloat(expr.text)
            if (isNaN(v)) return null
            return { val: v }
        } else if (ts.isAsExpression(expr)) {
            return constantFoldMem(expr.expression)
        }
        switch (expr.kind) {
            case SK.NullKeyword:
                return { val: null }
            case SK.TrueKeyword:
                return { val: true }
            case SK.FalseKeyword:
                return { val: false }
            case SK.UndefinedKeyword:
                return { val: undefined }
            default:
                return fallback(expr)
        }
    }
}

export function isTemplateOrStringLiteral(
    node: ts.Node
): node is ts.LiteralLikeNode {
    switch (node.kind) {
        case SK.JsxText:
        case SK.TemplateHead:
        case SK.TemplateMiddle:
        case SK.TemplateTail:
        case SK.StringLiteral:
        case SK.NoSubstitutionTemplateLiteral:
            return true
        default:
            return false
    }
}
