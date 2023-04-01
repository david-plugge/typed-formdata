type ReplaceValue<T> = T extends Record<string, unknown>
    ? {
          [K in keyof T]: ReplaceValue<T[K]>;
      }
    : T extends Array<infer A>
    ? Array<ReplaceValue<A>>
    : T extends FieldName<infer V>
    ? FieldName<V>
    : FieldName<T>;

const fieldTypeBrand: unique symbol = Symbol();

export interface FieldName<T> {
    [Symbol.toPrimitive]: () => string;
    [fieldTypeBrand]: T
    toString(): string;
    valueOf(): string;
};

export type Field<T> = {
    [K in keyof T]: T[K] extends unknown[]
        ? T[K][number] extends FormDataEntryValue
            ? (index?: number) => FieldName<T[K][number]>
            : T[K][number] extends FieldName<infer V>
            ? (index?: number) => FieldName<V>
            : (index: number) => Field<T[K][number]>
        : T[K] extends FormDataEntryValue
        ? FieldName<T[K]>
        : T[K] extends FieldName<infer V>
        ? FieldName<V>
        : Field<T[K]>;
};

type DeepRequired<T> = T extends Array<infer U>
    ? Array<DeepRequired<U>>
    : T extends object
    ? {
          [P in keyof T]-?: DeepRequired<T[P]>;
      }
    : Exclude<T, undefined | null>;

type Fields<T> = Field<ReplaceValue<DeepRequired<T>>>;

export function fields<T>(): Fields<T> {
    return new Proxy(
        {},
        {
            get(_target, p: string) {
                return _field([p]);
            },
        },
    ) as any;

    function _field(_parts: string[]): any {
        const parts = [..._parts];
        return new Proxy(() => {}, {
            apply(_target, _thisArg, argArray) {
                if (typeof argArray[0] === 'number') {
                    parts[parts.length - 1] += `[${argArray[0]}]`;
                } else {
                    parts[parts.length - 1] += `[]`;
                }
                return _field(parts);
            },
            get(_target, p) {
                if (
                    p === Symbol.toPrimitive ||
                    p === 'toString' ||
                    p === 'valueOf'
                ) {
                    return () => parts.join('.');
                }
                if (p === '$name') {
                    return parts.join('.');
                }

                if (typeof p === 'string') {
                    parts.push(p);
                }
                return _field(parts);
            },
        });
    }
}
