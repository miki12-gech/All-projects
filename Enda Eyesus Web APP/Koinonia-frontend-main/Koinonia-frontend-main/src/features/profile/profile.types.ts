export interface ProfileFormData {
    full_name_three_parts?: string;
    email?: string;
    phone_number?: string;
    academic_dept?: string;
    academic_year?: number | string;
    dorm_block?: string;
    dorm_room?: string;
    sex?: "MALE" | "FEMALE";
    clerical_rank?: "NONE" | "DEACON" | "PRIEST" | "LECTOR" | "OTHER";
    bio?: string;
    profile_image_url?: string;
    system_role?: string;
}

export interface UpdateProfilePayload {
    phone_number?: string;
    academic_dept?: string;
    academic_year?: number | string;
    dorm_block?: string;
    dorm_room?: string;
    sex?: string;
    clerical_rank?: string;
    bio?: string;
    profile_image_url?: string;
}
