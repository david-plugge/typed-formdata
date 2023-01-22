export function set(obj: any, path: string, value: unknown) {
    const segments = parsePath(path);

    for (let i = 0; i < segments.length; i++) {
        const { key, type } = segments[i];
        const next = segments[i + 1];

        if (!next) {
            if (type === 'index' && key === -1) {
                if (typeof value !== 'undefined') {
                    obj.push(value);
                }
            } else {
                obj[key] = value;
            }
            // if (Array.isArray(obj[key])) {
            //     obj[key] = Array.from(obj[key]);
            // }
            return;
        }

        if (!obj[key]) {
            obj[key] = next.type === 'index' ? [] : {};
        }
        // else if (next.type === 'index') {
        //     obj[key] = Array.from(obj[key]);
        // }

        obj = obj[key];
    }
}

type ParsedSegment =
    | { type: 'key'; key: string }
    | { type: 'index'; key: number };
function parsePath(str: string) {
    const parsed: ParsedSegment[] = [];

    let key = '';
    let isIndex = false;
    for (let i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) === 46 /* . */) {
            if (key !== '') {
                parsed.push({
                    type: 'key',
                    key,
                });
                key = '';
            }
            continue;
        }
        if (str.charCodeAt(i) === 91 /* [ */) {
            if (key !== '') {
                parsed.push({
                    type: 'key',
                    key,
                });
                key = '';
            }
            isIndex = true;
            continue;
        }
        if (str.charCodeAt(i) === 93 /* ] */) {
            parsed.push({
                type: 'index',
                key: key ? parseInt(key) : -1,
            });
            key = '';
            isIndex = false;
            continue;
        }
        key += str[i];
    }
    if (key !== '') {
        parsed.push({
            type: 'key',
            key,
        });
    }

    return parsed;
}
