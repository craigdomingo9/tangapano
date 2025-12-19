declare global {
    // This is the shape of the data passed from page.tsx
    interface ServerContext {
        user: User;
        accessToken: string; // Needed for client-side fetching!
        // Add other globals here later:
        // notificationsCount?: number;
        // theme?: 'light' | 'dark';
    }

    interface Location {
        lon: number;
        lat: number;
    }
}

export { };
