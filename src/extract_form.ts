import { Codec, defaultCodecsBySuffix, mapCodecsBySuffix } from './codecs';
import { set } from './set';

type GetFormData<T> = T extends Record<string, unknown>
    ? {
          [K in keyof T]?: GetFormData<T[K]>;
      }
    : T extends Array<infer K>
    ? Array<GetFormData<K>>
    : T extends Blob
    ? Blob
    : string;

type GetFormFields<T> = T extends Record<string, unknown>
    ? {
          [K in keyof T as T[K] extends Blob | Blob[]
              ? never
              : K]?: GetFormFields<T[K]>;
      }
    : T extends Array<infer K>
    ? Array<GetFormFields<K>>
    : string;

type GetFormFiles<T> = T extends Record<string, unknown>
    ? {
          [K in keyof T as T[K] extends Blob | Blob[]
              ? K
              : never]?: GetFormFiles<T[K]>;
      }
    : T extends Array<infer K>
    ? Array<GetFormFiles<K>>
    : string;

type ExtractFormData<T> = {
    data: T extends Record<string, unknown> ? GetFormData<T> : any;
    fields: T extends Record<string, unknown> ? GetFormFields<T> : any;
    files: T extends Record<string, unknown> ? GetFormFiles<T> : any;
};

export function extractFormData<T = any>(
    formData: FormData,
    codecs?: Codec<any>[]
): ExtractFormData<T> {
    const codecsMapping = codecs
        ? {
            ...defaultCodecsBySuffix,
            ...mapCodecsBySuffix(codecs)
        }
        : defaultCodecsBySuffix

    const data: any = {};
    const fields: any = {};
    const files: any = {};

    for (const [entryKey, value] of formData.entries()) {
        const isFile = value instanceof Blob;
        const isField = typeof value === 'string';
        let val: any
        const [key, codecSuffix] = entryKey.split(':')

        if (
            // empty file
            (isFile && value.size === 0) ||
            // empty string
            (isField && value === '')
        ) {
            val = undefined;
        } else if (codecSuffix) {
            const codec = codecsMapping[codecSuffix] as Codec<any>
            if (!codec) {
                throw new Error(`No codec found for suffix: ${codecSuffix}`)
            }
            val = codec.decodeValue(value)
        } else {
            val = value
        }

        set(data, key, val);
        if (isField) set(fields, key, val);
        if (isFile) set(files, key, val);
    }
    fillHoles(data);
    fillHoles(fields);
    fillHoles(files);

    return {
        data,
        fields,
        files,
    };
}

function fillHoles(obj: any) {
    if (Array.isArray(obj)) {
        for (let i = 0; i < obj.length; i++) {
            if (i in obj) {
                fillHoles(obj[i]);
            } else {
                obj[i] = undefined;
            }
        }
        return;
    }

    if (typeof obj === 'object') {
        for (const key in obj) {
            fillHoles(obj[key]);
        }
    }
}
