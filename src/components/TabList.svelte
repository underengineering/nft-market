<script lang="ts">
    export let tabs: string[] | readonly string[];
    export let activeTab = tabs[0];
</script>

<ul class="flex w-full justify-around">
    {#each tabs as tab}
        {@const isActive = tab === activeTab}
        <li
            class="flex flex-1 {isActive
                ? 'border-b-2 border-primary-500 text-primary-500'
                : 'hover:text-primary-500'}"
        >
            <button
                class="flex-1 text-lg font-bold"
                on:click={() => (activeTab = tab)}>{tab}</button
            >
        </li>
    {/each}
</ul>
