<script lang="ts">
    import { goto } from "$app/navigation";
    import notifications from "$lib/notifications";
    import { web3 } from "$lib/web3";
    import "../app.css";
    import Notification from "$components/Notification.svelte";
    import { guardWeb3 } from "$lib/utils";

    async function isAuthorized() {
        const accounts = await guardWeb3(() => web3.eth.getAccounts());
        return accounts.length > 0;
    }

    const authorized = isAuthorized().then((authorized) => {
        if (!authorized && location.pathname !== "/login") {
            // Redirect to /login if unauthorized
            return goto("/login");
        } else if (authorized && location.pathname === "/login") {
            // Redirect to / if authorized and in /login
            return goto("/");
        }

        return new Promise((res) => res(authorized));
    });
</script>

<div class="fixed right-0 top-0 flex w-full max-w-xs flex-col gap-1 px-4 pt-2">
    {#each $notifications as notification (notification.id)}
        <Notification
            type={notification.type}
            title={notification.title}
            message={notification.message}
            on:close={() => notifications.remove(notification.id)}
        />
    {/each}
</div>

{#await authorized then}
    <slot />
{/await}
