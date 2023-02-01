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
): ExtractFormData<T> {
    const data: any = {};
    const fields: any = {};
    const files: any = {};

    for (const [key, value] of formData.entries()) {
        const isFile = value instanceof Blob;
        const isField = typeof value === 'string';
        let val: FormDataEntryValue | undefined = value;

        if (
            // empty file
            (isFile && value.size === 0) ||
            // empty string
            (isField && value === '')
        ) {
            val = undefined;
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
