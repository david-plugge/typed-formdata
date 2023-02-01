import { expect, test } from 'vitest';
import { fields } from './fields';

test('fields', () => {
    type Data = {
        object?: {
            key: string;
        };
        array: Array<string>;
        arrayNested: Array<{
            string: string;
            date: Date;
        }>;
    };

    const f = fields<Data>();

    expect(f.object.key.toString(), 'nested object').toBe('object.key');
    expect(f.array().toString(), 'array').toBe('array[]');
    expect(f.array(2).toString(), 'array indexed').toBe('array[2]');
    expect(f.arrayNested(2).date.toString(), 'nested array').toBe(
        'arrayNested[2].date',
    );
});
