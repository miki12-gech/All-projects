//src/store/authStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import { Role, Status, AcademicYear, Sex, ClericalRank } from '@/lib/types';

export interface AuthUser {
    id: string;
    username: string;
    fullName: string;
    email: string;
    sex?: Sex;
    clericalRank?: ClericalRank;
    department?: string;
    serviceClassID?: string | null;
    classLeaderOf?: string | null;
    academicYear?: AcademicYear | null;
    dormBlock?: string;
    dormRoom?: string;
    role: Role;
    status?: Status;
    profileImage?: string | null;
    bio?: string | null;
    birthDate?: string | null;
    birthPlace?: string | null;
    phoneNumber?: string;
    // UI convenience
    serviceClassName?: string;
    // New schema fields
    full_name_three_parts?: string;
    system_role?: string;
    service_class_id?: string | null;
}

interface AuthStore {
    user: AuthUser | null;
    token: string | null;
    setAuth: (user: AuthUser, token: string) => void;
    updateUser: (partial: Partial<AuthUser>) => void;
    logout: () => void;
}

// Cookie-based storage so the token is synchronously available on every
// page load AND readable by the Next.js middleware (which can't touch localStorage).
const COOKIE_NAME = 'enda-eyesus-auth';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

const cookieStorage: StateStorage = {
    getItem(name: string): string | null {
        if (typeof document === 'undefined') return null;
        const match = document.cookie.match(
            new RegExp('(?:^|;\\s*)' + encodeURIComponent(name) + '=([^;]*)')
        );
        return match ? decodeURIComponent(match[1]) : null;
    },
    setItem(name: string, value: string): void {
        if (typeof document === 'undefined') return;
        document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)};max-age=${COOKIE_MAX_AGE};path=/;SameSite=Lax`;
    },
    removeItem(name: string): void {
        if (typeof document === 'undefined') return;
        document.cookie = `${encodeURIComponent(name)}=;max-age=0;path=/`;
    },
};

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            setAuth: (user, token) => set({ user, token }),
            updateUser: (partial) =>
                set((state) => ({
                    user: state.user ? { ...state.user, ...partial } : null,
                })),
            logout: () => set({ user: null, token: null }),
        }),
        {
            name: COOKIE_NAME,
            storage: createJSONStorage(() => cookieStorage),
        }
    )
);
