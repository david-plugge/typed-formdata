# typed-formdata

![npm](https://img.shields.io/npm/v/typed-formdata)
![GitHub top language](https://img.shields.io/github/languages/top/david-plugge/typed-formdata)
![GitHub Workflow Status (with branch)](https://img.shields.io/github/actions/workflow/status/david-plugge/typed-formdata/main.yaml?branch=main)

Have you ever tried setting up forms for modern frameworks that support nested objects and arrays?

It´s not fun.

This package helps you with that.

## Installation

```bash
# npm
npm i typed-formdata

# pnpm
pnpm i typed-formdata

# yarn
yarn add typed-formdata
```

## Usage

First up, define your form data:

```ts
type MyForm = {
    settings: {
        mode: 'auto' | 'light' | 'dark';
        theme: 'red' | 'green' | 'blue';
    };
    favouriteFrameworks: Array<{
        name: string;
        satisfaction: number;
    }>;
    user: {
        firstname?: string;
        lastname?: string;
        image?: Blob;
    };
};
```

### Fields

Use the `fields` helper to create your input names:

```ts
<script lang="ts">
    import { fields } from 'typed-formdata';

    const f = fields<MyForm>();
</script>

<form>
    <h2>Settings</h2>

    <label>
        <span>Mode</span>
        <select name="{f.settings.mode}">
            <options>auto</options>
            <options>light</options>
            <options>dark</options>
        </select>
    </label>
    <label>
        <span>Theme</span>
        <select name="{f.settings.theme}">
            <options>red</options>
            <options>green</options>
            <options>blue</options>
        </select>
    </label>


    <h2>3 favourite Frameworks</h2>

    <input type="text" name="{f.favouriteFrameworks[0].name}"/>
    <input type="number" name="{f.favouriteFrameworks[0].satisfaction}"/>

    <input type="text" name="{f.favouriteFrameworks[1].name}"/>
    <input type="number" name="{f.favouriteFrameworks[1].satisfaction}"/>

    <h2>User</h2>

    <input type="text" name="{f.user.firstname}"/>
    <input type="text" name="{f.user.lastname}"/>
</form>
```

`fields()` returns a proxy that will create a string.

Some examples:

For nested objects simply chain the keys:

```ts
fields<MyForm>().user.firstname;
> 'user.firstname'
```

For arrays you have to call the function:

```ts
fields<MyForm>().favouriteFrameworks();
> 'favouriteFrameworks[]'
```

**Note:**
Only use primite values inside arrays if you don´t provide an index!

_Bad:_

```ts
fields<MyForm>().favouriteFrameworks().key;
> 'favouriteFrameworks[].key'
```

_Good:_

```ts
fields<MyForm>().favouriteFrameworks(1).key;
> 'favouriteFrameworks[1].key'
```

Simply pass in the index:

```ts
fields<MyForm>().favouriteFrameworks(2);
> 'favouriteFrameworks[2]'
```

It´s also possible to create objects in arrays

```ts
fields<MyForm>().favouriteFrameworks(2).satisfaction;
> 'favouriteFrameworks[2].satisfaction'
```

### extractFormData

`extractFormData` pulls out the data from a `FormData` object where `fields` are typed as string and `files` are typed as Blob:

**Note:**
Browsers send empty inputs as an empty string or file. `extractFormData` omits the values.

```ts
import { extractFormData } from 'typed-formdata';

export async function handlePost(request: Request) {
    const formData = await request.formData();

    const {
        data, // files and fields
        fields, // fields only
        files, // files only
    } = extractFormData<MyForm>(formData);

    // data:
    type Data = {
        settings?: {
            mode?: string;
            theme?: string;
        };
        favouriteFrameworks?: Array<{
            name?: string;
            satisfaction?: string;
        }>;
        user: {
            firstname?: string;
            lastname?: string;
            image?: Blob;
        };
    };

    // fields:
    type Fields = {
        settings?: {
            mode?: string;
            theme?: string;
        };
        favouriteFrameworks?: Array<{
            name?: string;
            satisfaction?: string;
        }>;
        user: {
            firstname?: string;
            lastname?: string;
        };
    };

    // files:
    type Files = {
        user: {
            image?: Blob;
        };
    };

    /**
     * You can validate the data using your library of choice
     *
     * https://zod.dev/
     * https://github.com/jquense/yup
     * https://github.com/ianstormtaylor/superstruct
     */
}
```

## License

[MIT](https://github.com/david-plugge/typed-formdata/blob/main/LICENSE)
