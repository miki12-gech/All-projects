//src/lib/authHelper.ts
import { User as GeneratedUser } from '@/api/generated/api';
import { AuthUser } from '@/store/authStore';

export function mapGeneratedUserToAuthUser(u: GeneratedUser): AuthUser {
    // Map system_role to legacy Role
    let role: AuthUser['role'] = 'USER';
    const sysRole = u.system_role || 'USER';
    if (['SECRETARIAT_CHAIRMAN', 'SECRETARIAT_VICE', 'SECRETARIAT_SECRETARY', 'SERVICE_MANAGER'].includes(sysRole)) {
        role = 'SUPER_ADMIN';
    } else if (sysRole === 'TEACHER') {
        role = 'CLASS_LEADER';
    } else if (sysRole === 'MEMBER') {
        role = 'MEMBER';
    } else {
        role = 'USER';
    }

    return {
        id: u.id || '',
        username: u.email || '', // fallback to email
        fullName: u.full_name_three_parts || '',
        email: u.email || '',
        role: role,
        system_role: sysRole,
        full_name_three_parts: u.full_name_three_parts,
        service_class_id: u.service_class_id,
        serviceClassID: u.service_class_id,
        serviceClassName: (u as any).service_classes?.class_name_amharic || undefined,
        profileImage: u.profile_image_url || null,
        bio: u.bio || null,
        status: 'ACTIVE',
    };
}
