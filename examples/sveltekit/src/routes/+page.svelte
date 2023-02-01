<script lang="ts">
    import type { ActionData } from './$types';
    import { enhance } from '$app/forms';
    import { formFields, handleFormSubmit, formSubmitting } from '$lib/form';
    import Loading from '$lib/LoadingDots.svelte';
    import { myFormSchema } from './MyForm';

    export let form: ActionData;

    const f = formFields<typeof myFormSchema>();
</script>

<form method="post" use:enhance={handleFormSubmit(myFormSchema)}>
    <h1>My Custom Form</h1>

    <div>
        <h2>Settings</h2>

        <label>
            <span>Mode</span>
            <select name={f.settings.mode}>
                <option
                    selected={form?.values?.settings?.mode === 'auto'}
                    value="auto">Auto</option
                >
                <option
                    selected={form?.values?.settings?.mode === 'light'}
                    value="light">Light</option
                >
                <option
                    selected={form?.values?.settings?.mode === 'dark'}
                    value="dark">Dark</option
                >

                <option value="invalid">Invalid option</option>
            </select>
            {#if form?.errors?.settings?.mode?._errors}
                <p class="error">{form.errors.settings.mode._errors[0]}</p>
            {/if}
        </label>
        <label>
            <span>Theme</span>
            <select name={f.settings.theme}>
                <option
                    selected={form?.values?.settings?.theme === 'red'}
                    value="red">Red</option
                >
                <option
                    selected={form?.values?.settings?.theme === 'green'}
                    value="green">Green</option
                >
                <option
                    selected={form?.values?.settings?.theme === 'blue'}
                    value="blue">Blue</option
                >
                <option value="invalid">Invalid option</option>
            </select>
            {#if form?.errors?.settings?.theme?._errors}
                <p class="error">{form.errors.settings.theme._errors[0]}</p>
            {/if}
        </label>
    </div>

    <div>
        <h2>My 2 Favourite Frameworks</h2>
        <label>
            <span>Name</span>
            <input
                type="text"
                name={f.favouriteFrameworks(0).name}
                value={form?.values?.favouriteFrameworks?.[0]?.name ?? ''}
            />
        </label>
        {#if form?.errors?.favouriteFrameworks?.[0]?.name?._errors}
            <p class="error">
                {form.errors.favouriteFrameworks[0].name._errors[0]}
            </p>
        {/if}

        <label>
            <span>Satisfaction</span>
            <input
                type="number"
                name={f.favouriteFrameworks(0).satisfaction}
                value={form?.values?.favouriteFrameworks?.[0]?.satisfaction ??
                    ''}
            />
        </label>
        {#if form?.errors?.favouriteFrameworks?.[0]?.satisfaction?._errors}
            <p class="error">
                {form.errors.favouriteFrameworks[0].satisfaction._errors[0]}
            </p>
        {/if}

        <br />

        <label>
            <span>Name</span>
            <input
                type="text"
                name={f.favouriteFrameworks(1).name}
                value={form?.values?.favouriteFrameworks?.[1]?.name ?? ''}
            />
        </label>
        {#if form?.errors?.favouriteFrameworks?.[1]?.name?._errors}
            <p class="error">
                {form.errors.favouriteFrameworks[1].name._errors[0]}
            </p>
        {/if}

        <label>
            <span>Satisfaction</span>
            <input
                type="number"
                name={f.favouriteFrameworks(1).satisfaction}
                value={form?.values?.favouriteFrameworks?.[1]?.satisfaction ??
                    ''}
            />
        </label>
        {#if form?.errors?.favouriteFrameworks?.[1]?.satisfaction?._errors}
            <p class="error">
                {form.errors.favouriteFrameworks[1].satisfaction._errors[0]}
            </p>
        {/if}
    </div>

    <div>
        <h2>User</h2>
        <label>
            <span>Firstname</span>
            <input
                type="text"
                name={f.user.firstname}
                value={form?.values?.user?.firstname ?? ''}
            />

            {#if form?.errors?.user?.firstname?._errors}
                <p class="error">{form.errors.user.firstname._errors[0]}</p>
            {/if}
        </label>
        <label>
            <span>Lastname</span>
            <input
                type="text"
                name={f.user.lastname}
                value={form?.values?.user?.lastname ?? ''}
            />
            {#if form?.errors?.user?.lastname?._errors}
                <p class="error">{form.errors.user.lastname._errors[0]}</p>
            {/if}
        </label>
        <label>
            <span>Profile image</span>
            <input type="file" name={f.user.image} accept="image/*" />
            {#if form?.errors?.user?.image?._errors}
                <p class="error">{form.errors.user.image._errors[0]}</p>
            {/if}
        </label>
    </div>

    <button type="submit" disabled={$formSubmitting}>
        {#if $formSubmitting}
            <Loading />
        {:else}
            Submit
        {/if}
    </button>
</form>

<style>
    :global(body) {
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',
            Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue',
            sans-serif;
    }

    form {
        display: flex;
        flex-direction: column;
        gap: 1em;
        margin: 0 auto;
        max-width: 65ch;
    }
    div,
    label {
        display: flex;
        flex-direction: column;
        gap: 0.5em;
    }

    input {
        padding: 0.5em 1em;
    }

    button {
        padding: 0.5em 1em;
        display: flex;
        justify-content: center;
    }
    .error {
        color: tomato;
        font-weight: 600;
        font-size: 0.9rem;
    }
</style>
