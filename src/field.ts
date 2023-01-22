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

type _Field<T> = {
    [K in keyof T]: T[K] extends unknown[]
        ? (
              index?: number,
          ) => T[K][number] extends FormDataEntryValue
              ? FieldName
              : _Field<T[K][number]>
        : T[K] extends FormDataEntryValue
        ? FieldName
        : _Field<T[K]>;
};

type Field<T> = _Field<ReplaceValue<T, FormDataEntryValue>>;

export function field<T>(): Field<T> {
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
