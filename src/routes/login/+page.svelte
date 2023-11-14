<script lang="ts">
    import { goto } from "$app/navigation";
    import Button from "$components/Button.svelte";
    import notifications from "$lib/notifications";
    import { requestAccounts } from "$lib/web3";
    import LogosMetamaskIcon from "~icons/logos/metamask-icon";

    let loggingIn = false;
    async function onClick() {
        loggingIn = true;

        try {
            await requestAccounts();
            goto("/");
        } catch (err) {
            const message = (err as Error).message ?? "Unknown error";
            notifications.add("error", "Failed to log in", message);
        } finally {
            loggingIn = false;
        }
    }
</script>

<div class="flex h-full justify-center">
    <div class="flex flex-col justify-center">
        <div
            class="flex flex-col gap-2 rounded bg-background-secondary px-32 py-20"
        >
            <h1 class="text-center text-xl font-bold">Login</h1>
            <Button
                class="flex items-center gap-2"
                disabled={loggingIn}
                on:click={onClick}
            >
                Login with <LogosMetamaskIcon /></Button
            >
        </div>
    </div>
</div>
