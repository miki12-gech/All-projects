export interface Announcement {
    id: string;
    title: string;
    content: string;
    is_public: boolean;
    target_class_id?: string;
    status: string;
    author_id: string;
    published_at?: string;
    submitted_at?: string;
    image_url?: string | string[];
    video_url?: string | string[];
    pdf_url?: string | string[];
    reactions?: Array<{ user_id: string; reaction_type: "LIKE" | "STAR" }>;
    reaction_counts?: { likes: number; stars: number };
    views?: number;
    author?: {
        fullName: string;
        profileImageUrl?: string;
    };
    [key: string]: any;
}
