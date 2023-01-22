import { expect, test } from 'vitest';
import { field } from './field';

test('field', () => {
    type Data = {
        object: {
            key: string;
        };
        array: Array<{
            string: string;
            date: Date;
        }>;
    };

    const f = field<Data>();

    expect(f.object.key.toString(), 'nested object').toBe('object.key');
    expect(f.array().string.toString(), 'array push').toBe('array[].string');
    expect(f.array(2).date.toString(), 'array indexed').toBe('array[2].date');
});
