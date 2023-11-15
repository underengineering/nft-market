import { writable } from "svelte/store";

export type TNotificationType = "info" | "success" | "error";
export interface INotification {
    id: number;
    type: TNotificationType;
    title: string;
    message: string;
}

const notificationLifeTimes: Record<TNotificationType, number> = {
    info: 3000,
    success: 3000,
    error: 8000,
};

interface INotificationInternal extends INotification {
    timeoutId: number;
}

const notifications = writable<INotificationInternal[]>([]);
export default {
    subscribe: notifications.subscribe,
    add(type: TNotificationType, title: string, message: string) {
        notifications.update((value) => {
            const id = value.length > 0 ? value[0].id + 1 : 0;
            const lifeTime = notificationLifeTimes[type];
            const timeoutId = window.setTimeout(
                () => this.remove(id),
                lifeTime
            );

            value.unshift({ id, type, title, message, timeoutId });
            return value;
        });
    },
    remove(id: number) {
        notifications.update((notifications) => {
            const idx = notifications.findIndex(
                (notification) => notification.id === id
            );
            if (idx === -1) return notifications;

            clearTimeout(notifications[idx].timeoutId);
            notifications.splice(idx, 1);
            return notifications;
        });
    },
};
