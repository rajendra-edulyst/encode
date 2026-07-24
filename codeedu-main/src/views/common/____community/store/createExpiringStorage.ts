const EXPIRATION_TIME = 24 * 60 * 60 * 1000;

export function createExpiringStorage(storage: Storage, expirationTime = EXPIRATION_TIME) {
    return {
        getItem: (name: string) => {
            const str = storage.getItem(name);
            if (!str) return null;

            try {
                const { state, timestamp } = JSON.parse(str);
                if (Date.now() - timestamp > expirationTime) {
                    storage.removeItem(name);
                    return null;
                }
                return state;
            } catch {
                return null;
            }
        },

        setItem: (name: string, value: unknown) => {
            const toStore = JSON.stringify({ state: value, timestamp: Date.now() });
            storage.setItem(name, toStore);
        },

        removeItem: (name: string) => {
            storage.removeItem(name);
        },
    };
}
