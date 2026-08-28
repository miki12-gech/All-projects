"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRepository = exports.AdminRepository = void 0;
const db_1 = require("../../config/db");
class AdminRepository {
    async getDashboardStats() {
        const [totalUsers, users] = await Promise.all([
            db_1.db.user.count(),
            db_1.db.user.findMany({
                select: {
                    system_role: true,
                    service_class_id: true,
                    academic_year: true
                }
            })
        ]);
        const byStatusMap = new Map();
        const byClassMap = new Map();
        const byAcademicYearMap = new Map();
        for (const u of users) {
            const status = u.system_role === 'USER' ? 'PENDING' : 'ACTIVE';
            byStatusMap.set(status, (byStatusMap.get(status) || 0) + 1);
            if (u.service_class_id) {
                byClassMap.set(u.service_class_id, (byClassMap.get(u.service_class_id) || 0) + 1);
            }
            if (u.academic_year) {
                byAcademicYearMap.set(u.academic_year, (byAcademicYearMap.get(u.academic_year) || 0) + 1);
            }
        }
        return {
            totalUsers,
            byStatus: Array.from(byStatusMap.entries()).map(([status, count]) => ({
                status,
                _count: { id: count }
            })),
            byClass: Array.from(byClassMap.entries()).map(([classID, count]) => ({
                serviceClassID: classID,
                _count: { id: count }
            })),
            bySex: [],
            byAcademicYear: Array.from(byAcademicYearMap.entries()).map(([year, count]) => ({
                academicYear: year,
                _count: { id: count }
            }))
        };
    }
    async getAllUsers(classId) {
        const whereClause = {};
        if (classId) {
            whereClause.service_class_id = classId;
        }
        const users = await db_1.db.user.findMany({
            where: whereClause,
            select: {
                id: true,
                email: true,
                full_name_three_parts: true,
                system_role: true,
                service_class_id: true,
                phone_number: true,
                created_at: true,
                service_classes: { select: { class_name_amharic: true } }
            },
            orderBy: { created_at: 'desc' },
        });
        return users.map(u => ({
            id: u.id,
            username: u.email,
            fullName: u.full_name_three_parts,
            email: u.email,
            role: u.system_role,
            status: u.system_role === 'USER' ? 'PENDING' : 'ACTIVE',
            serviceClassID: u.service_class_id,
            phoneNumber: u.phone_number,
            createdAt: u.created_at,
            serviceClass: u.service_classes ? { name: u.service_classes.class_name_amharic } : null
        }));
    }
    async findUserById(id) {
        const u = await db_1.db.user.findUnique({ where: { id } });
        if (!u)
            return null;
        return {
            id: u.id,
            username: u.email,
            fullName: u.full_name_three_parts,
            email: u.email,
            role: u.system_role,
            status: u.system_role === 'USER' ? 'PENDING' : 'ACTIVE',
            serviceClassID: u.service_class_id,
            phoneNumber: u.phone_number,
            createdAt: u.created_at
        };
    }
    async updateUser(id, data) {
        const mappedData = {};
        if (data.role !== undefined)
            mappedData.system_role = data.role;
        if (data.serviceClassID !== undefined)
            mappedData.service_class_id = data.serviceClassID;
        if (data.phoneNumber !== undefined)
            mappedData.phone_number = data.phoneNumber;
        if (data.status === 'ACTIVE')
            mappedData.system_role = 'MEMBER';
        if (data.status === 'SUSPENDED')
            mappedData.system_role = 'USER';
        const u = await db_1.db.user.update({
            where: { id },
            data: mappedData
        });
        return {
            id: u.id,
            username: u.email,
            fullName: u.full_name_three_parts,
            email: u.email,
            role: u.system_role,
            status: u.system_role === 'USER' ? 'PENDING' : 'ACTIVE',
            serviceClassID: u.service_class_id,
            phoneNumber: u.phone_number,
            createdAt: u.created_at
        };
    }
    async logActivity(data) {
        try {
            await db_1.db.$executeRawUnsafe(`INSERT INTO audit_logs (user_id, action, entity_type, entity_id, new_state, ip_address) VALUES ($1, $2, $3, $4, $5, $6::inet)`, data.actorID, data.actionType, 'USER', data.targetUserID || null, JSON.stringify({ description: data.description }), data.ipAddress || null);
        }
        catch (err) {
            console.error('Failed to log activity in audit_logs:', err);
        }
    }
    // ─── Sub-Class Management ────────────────────────────────────────
    async getSubClasses(classId) {
        const whereClause = {};
        if (classId) {
            whereClause.parent_class_id = classId;
        }
        return db_1.db.sub_classes.findMany({
            where: whereClause,
            include: {
                users_sub_classes_sub_chair_idTousers: { select: { id: true, full_name_three_parts: true } },
                users_sub_classes_sub_vice_idTousers: { select: { id: true, full_name_three_parts: true } },
                users_sub_classes_sub_secretary_idTousers: { select: { id: true, full_name_three_parts: true } }
            },
            orderBy: { created_at: 'desc' }
        });
    }
    async createSubClass(classId, name, status = 'PENDING_APPROVAL') {
        return db_1.db.sub_classes.create({
            data: {
                parent_class_id: classId,
                sub_class_name: name,
                status: status
            }
        });
    }
    async updateSubClassRoles(subClassId, roles) {
        return db_1.db.sub_classes.update({
            where: { id: subClassId },
            data: { ...roles, status: 'PENDING_APPROVAL' }
        });
    }
    async getPendingSubClassApprovals() {
        return db_1.db.sub_classes.findMany({
            where: { status: 'PENDING_APPROVAL' },
            include: {
                service_classes: { select: { class_name_amharic: true } },
                users_sub_classes_sub_chair_idTousers: { select: { id: true, full_name_three_parts: true } },
                users_sub_classes_sub_vice_idTousers: { select: { id: true, full_name_three_parts: true } },
                users_sub_classes_sub_secretary_idTousers: { select: { id: true, full_name_three_parts: true } }
            },
            orderBy: { created_at: 'desc' }
        });
    }
    async approveSubClass(subClassId) {
        return db_1.db.sub_classes.update({
            where: { id: subClassId },
            data: { status: 'APPROVED' }
        });
    }
    async rejectSubClass(subClassId) {
        return db_1.db.sub_classes.update({
            where: { id: subClassId },
            data: { status: 'REJECTED' }
        });
    }
    // ─── Office (ፅሕፈት ቤት) ─────────────────────────────────────────
    async getOfficeClassId() {
        const cls = await db_1.db.serviceClass.findFirst({ where: { class_name_amharic: 'ፅሕፈት ቤት' } });
        return cls?.id ?? null;
    }
    async getUnassignedClassId() {
        const cls = await db_1.db.serviceClass.findFirst({ where: { class_name_amharic: 'የለኝም' } });
        return cls?.id ?? null;
    }
    async getOfficeData() {
        const [officeClass, unassignedClass] = await Promise.all([
            db_1.db.serviceClass.findFirst({ where: { class_name_amharic: 'ፅሕፈት ቤት' } }),
            db_1.db.serviceClass.findFirst({ where: { class_name_amharic: 'የለኝም' } }),
        ]);
        const [officeUsers, unassignedUsers] = await Promise.all([
            officeClass ? db_1.db.user.findMany({
                where: { service_class_id: officeClass.id },
                select: { id: true, full_name_three_parts: true, email: true, system_role: true },
            }) : [],
            unassignedClass ? db_1.db.user.findMany({
                where: { service_class_id: unassignedClass.id },
                select: { id: true, full_name_three_parts: true, email: true, system_role: true },
            }) : [],
        ]);
        const mapUsers = (list) => list.map(u => ({
            id: u.id,
            fullName: u.full_name_three_parts,
            username: u.email,
            status: u.system_role === 'USER' ? 'PENDING' : 'ACTIVE',
            role: u.system_role
        }));
        return {
            officeMembers: mapUsers(officeUsers),
            unassignedMembers: mapUsers(unassignedUsers)
        };
    }
    async getPendingOfficeRequests() {
        return [];
    }
}
exports.AdminRepository = AdminRepository;
exports.adminRepository = new AdminRepository();
