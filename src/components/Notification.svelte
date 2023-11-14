<script lang="ts">
    import type { TNotificationType } from "$lib/notifications";
    import { fly } from "svelte/transition";

    export let type: TNotificationType;
    export let title: string;
    export let message: string;
</script>

<div
    class="bg-notification-{type} border-notification-{type}-accent flex w-full flex-col rounded border-l-2 p-2"
    transition:fly={{ x: "100%" }}
>
    <span class="text-xl">{title}</span>
    <div class="h-[1px] w-full rounded-full bg-primary-950"></div>
    <p>{message}</p>
</div>
