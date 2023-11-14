import { writable } from "svelte/store";

export interface ILocalStorage {
    selectedAddress?: string;
}

function loadData() {
    const data = localStorage.getItem("storage");
    if (data === null) {
        return {} as ILocalStorage;
    }

    return JSON.parse(data) as ILocalStorage;
}

function saveData(data: ILocalStorage) {
    const jsonData = JSON.stringify(data);
    localStorage.setItem("storage", jsonData);
}

const storage = writable(loadData());
storage.subscribe((newValue) => saveData(newValue));

export default storage;
