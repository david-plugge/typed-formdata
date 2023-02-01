import { z } from 'zod';

export const myFormSchema = z.object({
    settings: z.object({
        mode: z.enum(['auto', 'light', 'dark']),
        theme: z.enum(['red', 'green', 'blue']),
    }),
    favouriteFrameworks: z
        .array(
            z.object({
                name: z.string(),
                satisfaction: z.coerce.number(),
            }),
        )
        .length(2),
    user: z.object({
        firstname: z.string(),
        lastname: z.string(),
        image: z.instanceof(Blob).optional(),
    }),
});

export type MyFormSchema = z.infer<typeof myFormSchema>;
