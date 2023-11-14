import { writable } from "svelte/store";

export type TNotificationType = "info" | "success" | "error";
export interface INotification {
    id: number;
    type: TNotificationType;
    title: string;
    message: string;
}

const notificationLifeTimes: Record<TNotificationType, number> = {
    info: 2000,
    success: 2000,
    error: 4000,
};

const notifications = writable<INotification[]>([]);
export default {
    subscribe: notifications.subscribe,
    add(type: TNotificationType, title: string, message: string) {
        notifications.update((value) => {
            const id = value.length > 0 ? value[0].id + 1 : 0;
            const lifeTime = notificationLifeTimes[type];
            setTimeout(() => this.remove(id), lifeTime);

            value.unshift({ id, type, title, message });
            return value;
        });
    },
    remove(id: number) {
        notifications.update((notifications) => {
            return notifications.filter(
                (notification) => notification.id !== id
            );
        });
    },
};
