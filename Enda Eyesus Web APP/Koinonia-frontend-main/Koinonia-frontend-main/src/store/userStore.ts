//src/store/userStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface UserProfile {
    fullName: string;
    username: string;
    sex: string;
    department: string;
    serviceClass: string;
    email: string;
    phone: string;
    academicYear: string;
    bio: string;
    birthDate: string;
    birthPlace: string;
    profileImageUrl: string | null;
}

interface UserStore {
    user: UserProfile | null;
    setUser: (profile: UserProfile) => void;
    updateProfileImage: (url: string) => void;
    logout: () => void;
}

const defaultUser: UserProfile = {
    fullName: "",
    username: "",
    sex: "",
    department: "",
    serviceClass: "",
    email: "",
    phone: "",
    academicYear: "",
    bio: "",
    birthDate: "",
    birthPlace: "",
    profileImageUrl: null,
};

export const useUserStore = create<UserStore>()(
    persist(
        (set) => ({
            user: null,
            setUser: (profile) => set({ user: profile }),
            updateProfileImage: (url) =>
                set((state) => ({
                    user: state.user ? { ...state.user, profileImageUrl: url } : null,
                })),
            logout: () => set({ user: null }),
        }),
        {
            name: "enda-eyesus-user",
        }
    )
);

export { defaultUser };
