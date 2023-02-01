import { fail } from '@sveltejs/kit';
import { parseForm } from '../lib/form';
import type { Actions } from './$types';
import { myFormSchema } from './MyForm';

export const actions = {
    async default({ request }) {
        const { result, fields } = parseForm(
            myFormSchema,
            await request.formData(),
        );

        if (!result.success) {
            return fail(400, {
                errors: result.error.format(),
                values: fields,
            });
        }

        console.log(result.data);

        return { success: true };
    },
} satisfies Actions;
