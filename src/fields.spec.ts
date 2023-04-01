import { expect, test } from 'vitest';
import { asBool, asNum, asStr } from './codecs';
import { fields } from './fields';

test('fields', () => {
    type Data = {
        object?: {
            key: string;
        };
        array: Array<string>;
        arrayNested: Array<{
            string: string;
            date: string;
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

test('fields with codec', () => {
    type Data = {
        object?: {
            key: string;
        };
        isActive: boolean;
        arrayNested: Array<{
            id: number;
        }>;
    };

    const f = fields<Data>();

    expect(asBool(f.isActive), 'nested object').toBe('isActive:boolean');
    expect(asStr(f.object.key), 'nested object').toBe('object.key:string');
    expect(asNum(f.arrayNested(2).id), 'nested array').toBe(
        'arrayNested[2].id:number',
    );
})