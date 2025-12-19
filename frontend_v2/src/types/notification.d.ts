declare global {
    interface Notification {
        id: string;
        recipient: User;
        readonly title: string;
        readonly message: string;
        readonly notification_type: "info" | "success" | "warning" | "error";
        readonly category: "billing" | "listing" | "inquiry" | "system";
        readonly action_link: string;
        readonly is_read: boolean;
        readonly created_at: string;
    }
}

export { };
