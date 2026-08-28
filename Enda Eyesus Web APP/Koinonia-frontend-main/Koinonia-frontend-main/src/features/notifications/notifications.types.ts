export interface NotificationItem {
    id: string;
    title?: string;
    message?: string;
    target_route?: string | null;
    is_read: boolean;
    created_at: string;
}
