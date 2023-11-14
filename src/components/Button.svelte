<script lang="ts">
    import type { HTMLButtonAttributes } from "svelte/elements";

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface $$Props extends HTMLButtonAttributes {}
</script>

<button
    {...$$props}
    class="rounded bg-primary-500 px-2 py-1 transition-colors hover:bg-primary-400 active:bg-primary-600 disabled:bg-primary-200 {$$props.class ||
        ''}"
    on:click><slot /></button
>
