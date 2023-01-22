import { expect, test } from 'vitest';
import { set } from './set';

test('basic key value', () => {
    const obj = {};
    set(obj, 'key', 'value');

    expect(obj).toEqual({ key: 'value' });
});

test('multiple key value', () => {
    const obj = {};
    set(obj, 'key1', 'value');
    set(obj, 'key2', 'value');

    expect(obj).toEqual({ key1: 'value', key2: 'value' });
});

test('overwrite', () => {
    const obj = {};
    set(obj, 'key', 'value1');
    set(obj, 'key', 'value2');

    expect(obj).toEqual({ key: 'value2' });
});

test('nested', () => {
    const obj = {};
    set(obj, 'key.nested', 'value');

    expect(obj).toEqual({ key: { nested: 'value' } });
});

test('nested multiple layers', () => {
    const obj = {};
    set(obj, 'a.b.c.d', 'value');
    set(obj, 'a.e.f', 'value');

    expect(obj).toEqual({
        a: {
            b: { c: { d: 'value' } },
            e: { f: 'value' },
        },
    });
});

test('simple array', () => {
    const obj = {};
    set(obj, 'array[]', 1);
    set(obj, 'array[]', 2);

    expect(obj).toEqual({
        array: [1, 2],
    });
});

test('array indexed', () => {
    const obj = {};
    set(obj, 'array[1]', 1);
    set(obj, 'array[3]', 3);

    expect(obj).toEqual({
        array: [undefined, 1, undefined, 3],
    });
});

test('array with objects', () => {
    const obj = {};
    set(obj, 'array[0].value', 1);
    set(obj, 'array[1].value', 3);

    expect(obj).toEqual({
        array: [{ value: 1 }, { value: 3 }],
    });
});
