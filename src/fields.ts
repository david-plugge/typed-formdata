type ReplaceValue<T, V> = T extends Record<string, unknown>
    ? {
          [K in keyof T]: ReplaceValue<T[K], V>;
      }
    : T extends Array<infer A>
    ? Array<ReplaceValue<A, V>>
    : V;

type FieldName = string & {
    [Symbol.toPrimitive]: () => string;
    toString(): string;
    valueOf(): string;
};

type Field<T> = {
    [K in keyof T]: T[K] extends unknown[]
        ? T[K][number] extends FormDataEntryValue
            ? (index?: number) => FieldName
            : (index: number) => Field<T[K][number]>
        : T[K] extends FormDataEntryValue
        ? FieldName
        : Field<T[K]>;
};

type DeepRequired<T> = T extends Record<string, unknown>
    ? {
          [K in keyof T]-?: DeepRequired<T[K]>;
      }
    : T;

type Fields<T> = Field<ReplaceValue<DeepRequired<T>, FormDataEntryValue>>;

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
