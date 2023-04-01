import { FieldName } from "./fields";

export abstract class BaseCodec<T> {
    constructor(public suffix: string) {
        this.encodeName = this.encodeName.bind(this)
    }
    encodeName(fieldName: FieldName<T>) {
        return fieldName.toString() + ':' + this.suffix;
    }
    abstract decodeValue(value: FormDataEntryValue): T;
}

export interface Codec<T> extends BaseCodec<T> { }

export class StrCodec extends BaseCodec<string> {
    constructor() {
        super('string')
    }
    decodeValue(value: FormDataEntryValue) {
        if (typeof value === 'string') {
            return value;
        }
        throw new Error(`Expected value to be string but found ${value}`);
    }
}

export const strCodec = new StrCodec()
export const asStr = strCodec.encodeName

export class NumCodec extends BaseCodec<number> {
    constructor() {
        super('number')
    }
    decodeValue(value: FormDataEntryValue) {
        if (typeof value === 'string') {
            return Number(value)
        }
        throw new Error(`Expected value to be string but found ${value}`);
    }
}

export const numCodec = new NumCodec()
export const asNum = numCodec.encodeName

export class BoolCodec extends BaseCodec<boolean> {
    constructor() {
        super('boolean')
    }
    decodeValue(value: FormDataEntryValue) {
        return value === 'true' || value === 'on'
    }
}

export const boolCodec = new BoolCodec()
export const asBool = boolCodec.encodeName

export const mapCodecsBySuffix = (codecs: Codec<unknown>[]) =>
    Object.fromEntries(codecs.map(it => [it.suffix, it]))

export const defaultCodecsBySuffix = mapCodecsBySuffix([
    strCodec,
    numCodec,
    boolCodec
])