export class StorageManager {
    storage: browser.storage.StorageArea;

    constructor(type: string) {
        this.setStorageType(type);
    }

    setStorageType(type: string) {
        switch (type) {
            case "local":
                this.storage = browser.storage.local;
                break;
            case "sync":
                this.storage = browser.storage.sync;
                break;
            default:
                throw new Error("Invalid storage type");
        }
    }

    async get(key: string, defaultValue: any) {
        const value = await this.storage.get(key);
        if (value[key] === undefined) {
            this.set(key, defaultValue);
            return defaultValue;
        }
        return value[key];
    }

    async set(key: string, value: any) {
        await this.storage.set({ [key]: value });
    }

    async remove(key: string) {
        await this.storage.remove(key);
    }    
}