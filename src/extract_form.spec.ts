import { expect, test } from 'vitest';
import { extractFormData } from './extract_form';

test('extractFormData', () => {
    const formdata = new FormData();

    formdata.set('field', 'value');
    formdata.set('file', new Blob(['file']));
    formdata.set('object.array[1]', '1');
    formdata.set('array[]', 'a');
    formdata.append('array[]', new Blob(['b']));

    const { data, fields, files } = extractFormData(formdata);
    console.log(data);

    expect(data.field).toBe('value');
    expect(data.file).toBeInstanceOf(Blob);
    expect(data.object.array[0]).toBe(undefined);
    expect(data.object.array[1]).toBe('1');
    expect(data.array[0]).toBe('a');
    expect(data.array[1]).toBeInstanceOf(Blob);

    expect(fields.field).toBe('value');
    expect(fields.file).toBe(undefined);
    expect(fields.object.array[0]).toBe(undefined);
    expect(fields.object.array[1]).toBe('1');
    expect(fields.array[0]).toBe('a');
    expect(fields.array[1]).toBe(undefined);

    expect(files.field).toBe(undefined);
    expect(files.file).toBeInstanceOf(Blob);
    expect(files.object).toBe(undefined);
    expect(files.array[0]).toBeInstanceOf(Blob);
});
