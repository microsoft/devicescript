import { ObjectType, OBJECT_TYPE, Op } from "./bytecode"
import { opType } from "./format"

export enum ValueKind {
    ANY = ObjectType.ANY,
    NUMBER = ObjectType.NUMBER,
    BUFFER = ObjectType.BUFFER,
    MAP = ObjectType.MAP,
    ARRAY = ObjectType.ARRAY,
    NULL = ObjectType.NULL,
    FIBER = ObjectType.FIBER,
    BOOL = ObjectType.BOOL,
    ROLE = ObjectType.ROLE,
    VOID = ObjectType.VOID,

    ERROR = 0x100,
    JD_EVENT,
    JD_REG,
    JD_VALUE_SEQ,
    JD_COMMAND,
    JD_CLIENT_COMMAND,
}

export class ValueType {
    constructor(
        public kind: ValueKind,
        public roleSpec?: jdspec.ServiceSpec,
        public packetSpec?: jdspec.PacketInfo
    ) {}

    get isRole() {
        return this.kind == ValueKind.ROLE
    }

    equals(other: ValueType) {
        if (!other) return false
        return (
            this.kind == other.kind &&
            this.roleSpec == other.roleSpec &&
            this.packetSpec == other.packetSpec
        )
    }

    toString() {
        let r = valueKindToString(this.kind)
        if (this.roleSpec) r += " " + this.roleSpec.camelName
        if (this.packetSpec) r += "." + this.packetSpec.name
        return r
    }

    static infer(op: Op) {
        const k = opType(op)
        return (
            ValueType.all_static.find(
                t => t.kind == (k as number as ValueKind)
            ) ?? ValueType.ANY
        )
    }

    static ROLE(spec: jdspec.ServiceSpec) {
        return new ValueType(ValueKind.ROLE, spec)
    }

    static ANY = new ValueType(ValueKind.ANY)
    static NUMBER = new ValueType(ValueKind.NUMBER)
    static BUFFER = new ValueType(ValueKind.BUFFER)
    static MAP = new ValueType(ValueKind.MAP)
    static ARRAY = new ValueType(ValueKind.ARRAY)
    static NULL = new ValueType(ValueKind.NULL)
    static FIBER = new ValueType(ValueKind.FIBER)
    static BOOL = new ValueType(ValueKind.BOOL)
    static VOID = new ValueType(ValueKind.VOID)
    static ERROR = new ValueType(ValueKind.ERROR)
    static all_static = [
        ValueType.ANY,
        ValueType.NUMBER,
        ValueType.BUFFER,
        ValueType.MAP,
        ValueType.ARRAY,
        ValueType.NULL,
        ValueType.FIBER,
        ValueType.BOOL,
        ValueType.VOID,
        ValueType.ERROR,
    ]
}

export const valueTypes = [
    "(error node)",
    "Jacdac event",
    "Jacdac register",
    "multi-field value",
    "Jacdac command",
    "Jacdac client command",
]

export function valueKindToString(vk: ValueKind) {
    return OBJECT_TYPE[vk] || valueTypes[vk - 0x100] || "ValueType " + vk
}
