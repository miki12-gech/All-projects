import api from "@/lib/api";
import { ProfileFormData, UpdateProfilePayload } from "./profile.types";

export const getProfile = async (): Promise<ProfileFormData> => {
    const res = await api.get("/auth/me");
    return res.data;
};

export const updateProfile = async (payload: UpdateProfilePayload): Promise<ProfileFormData> => {
    const res = await api.patch("/auth/profile", payload);
    return res.data.data;
};

export const uploadProfileImage = async (file: File): Promise<string> => {
    const fd = new FormData();
    fd.append("image", file);
    const res = await api.post("/upload/image", fd, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data?.imageURL || res.data.url;
};
