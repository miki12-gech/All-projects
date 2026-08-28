import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { getProfile, updateProfile, uploadProfileImage } from "./profile.service";
import { ProfileFormData } from "./profile.types";

export const useProfile = () => {
    const { updateUser, logout } = useAuthStore();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<ProfileFormData>({});
    const [originalData, setOriginalData] = useState<ProfileFormData>({});
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getProfile();
                setFormData(data);
                setOriginalData(data);
                updateUser({
                    fullName: data.full_name_three_parts,
                    email: data.email,
                    phoneNumber: data.phone_number,
                    department: data.academic_dept,
                    academicYear: data.academic_year,
                    dormBlock: data.dorm_block,
                    dormRoom: data.dorm_room,
                    sex: data.sex,
                    bio: data.bio,
                    profileImage: data.profile_image_url,
                });
            } catch (err) {
                console.error("Failed to load profile", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [updateUser]);

    const handleChange = (field: keyof ProfileFormData, value: string | number | undefined) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleImageUpload = async (file: File) => {
        try {
            setUploading(true);
            const imageUrl = await uploadProfileImage(file);
            handleChange("profile_image_url", imageUrl);
            return imageUrl;
        } catch (err) {
            console.error("Image upload failed", err);
            return null;
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const data = await updateProfile({
                phone_number: formData.phone_number,
                academic_dept: formData.academic_dept,
                academic_year: formData.academic_year,
                dorm_block: formData.dorm_block,
                dorm_room: formData.dorm_room,
                sex: formData.sex,
                clerical_rank: formData.clerical_rank,
                bio: formData.bio,
                profile_image_url: formData.profile_image_url,
            });
            setFormData(data);
            setOriginalData(data);
            setIsEditing(false);
            updateUser({
                phoneNumber: data.phone_number,
                department: data.academic_dept,
                academicYear: data.academic_year,
                dormBlock: data.dorm_block,
                dormRoom: data.dorm_room,
                sex: data.sex,
                bio: data.bio,
                profileImage: data.profile_image_url,
            });
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            alert(error.response?.data?.message || "Update failed");
        } finally {
            setSaving(false);
        }
    };

    const cancelEdit = () => {
        setFormData({ ...originalData });
        setIsEditing(false);
    };

    const handleLogout = () => {
        logout();
        window.location.href = "/login";
    };

    return {
        loading,
        saving,
        isEditing,
        setIsEditing,
        formData,
        handleChange,
        handleImageUpload,
        handleSave,
        cancelEdit,
        uploading,
        handleLogout,
    };
};
