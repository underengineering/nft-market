<script lang="ts">
    import type { TNotificationType } from "$lib/notifications";
    import MaterialSymbolsClose from "~icons/material-symbols/close";
    import { fly } from "svelte/transition";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher<{ close: undefined }>();

    export let type: TNotificationType;
    export let title: string;
    export let message: string;
</script>

<div
    class="bg-notification-{type} border-notification-{type}-accent flex w-full flex-col rounded border-l-2 p-2"
    transition:fly={{ x: "100%" }}
>
    <div class="flex justify-between">
        <span class="text-xl">{title}</span>
        <button on:click={() => dispatch("close")}
            ><MaterialSymbolsClose /></button
        >
    </div>
    <div class="h-[1px] w-full rounded-full bg-primary-950"></div>
    <p class="break-words">{message}</p>
</div>
