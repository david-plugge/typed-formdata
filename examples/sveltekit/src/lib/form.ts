import { applyAction } from '$app/forms';
import type { SubmitFunction } from '@sveltejs/kit';
import { writable } from 'svelte/store';
import { extractFormData, fields } from 'typed-formdata';
import type { z } from 'zod';

const { set: setSubmitting, subscribe } = writable(false);

export const formSubmitting = { subscribe };

export function handleFormSubmit<T extends z.Schema>(
    schema: T,
): SubmitFunction {
    return ({ cancel, data: formData }) => {
        setSubmitting(true);

        const { data, fields } = extractFormData<z.infer<T>>(formData);

        const result = schema.safeParse(data);

        if (!result.success) {
            cancel();
            applyAction({
                status: 400,
                type: 'failure',
                data: {
                    errors: result.error.format(),
                    values: fields,
                },
            }).then(() => {
                setSubmitting(false);
            });
        }

        return async ({ update }) => {
            await update();
            setSubmitting(false);
        };
    };
}

export function parseForm<T extends z.Schema>(schema: T, formData: FormData) {
    const { data, fields, files } = extractFormData<z.infer<T>>(formData);
    const result: z.SafeParseReturnType<T['_input'], T['_output']> =
        schema.safeParse(data);

    return {
        data,
        fields,
        files,
        result,
    };
}

export function formFields<T extends z.Schema>() {
    return fields<z.infer<T>>();
}
