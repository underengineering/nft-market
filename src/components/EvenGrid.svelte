<script lang="ts">
    export let columnSize: string;
</script>

<ul
    id="grid"
    class="grid w-full justify-evenly gap-2"
    style="--column-size: {columnSize}"
>
    <slot />
</ul>

<style lang="postcss">
    #grid {
        grid-template-columns: repeat(auto-fill, var(--column-size));
        grid-gap: 1rem;
    }
</style>
