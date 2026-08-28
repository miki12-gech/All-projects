"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.educationService = exports.EducationService = void 0;
const client_1 = require("@prisma/client");
const errors_1 = require("../../utils/errors");
const prisma = new client_1.PrismaClient();
// ✅ GBI Gubae graduation phases – must match the database enum values (lowercased)
const GUBAE_PHASES = ['gubae_abew', 'gubae_hawaryat', 'gubae_ecclesiae'];
const GUBAE_NAMES = {
    gubae_abew: 'Gubae Abew',
    gubae_hawaryat: 'Gubae Hawaryat',
    gubae_ecclesiae: 'Gubae Eclessia',
};
class EducationService {
    // -------------------- BATCHES --------------------
    async listBatches(phase) {
        const where = {};
        if (phase)
            where.course_track = phase;
        return prisma.lms_batches.findMany({
            where,
            orderBy: [{ course_track: 'asc' }, { batch_number: 'desc' }],
            include: { _count: { select: { lms_enrollments: true } } },
        });
    }
    async createBatch(data) {
        return prisma.lms_batches.create({ data });
    }
    // -------------------- SUBJECTS & LESSONS --------------------
    async getSubjectsWithProgress(batchId, userId) {
        const subjects = await prisma.subject.findMany({
            where: { batchId },
            include: {
                lessons: { orderBy: { order: 'asc' } },
                exam: true,
            },
            orderBy: { order: 'asc' },
        });
        if (!userId)
            return subjects;
        const enrollment = await prisma.lms_enrollments.findUnique({
            where: { user_id_batch_id: { user_id: userId, batch_id: batchId } },
        });
        const progressMap = enrollment?.quiz_scores || {};
        return subjects.map(sub => ({
            ...sub,
            userProgress: progressMap[sub.id] || { passed: false, score: null },
        }));
    }
    async createSubject(data) {
        return prisma.subject.create({ data });
    }
    async addInlineExplanation(lessonId, quotedText, explanation) {
        // lessonId can be any string (e.g., "les_abew_1") – no foreign key validation
        return prisma.inlineExplanation.create({
            data: { lessonId, quotedText, explanation },
        });
    }
    async getLessonExplanations(lessonId) {
        return prisma.inlineExplanation.findMany({
            where: { lessonId },
            orderBy: { createdAt: 'asc' },
        });
    }
    async updateExplanation(explanationId, quotedText, explanation) {
        return prisma.inlineExplanation.update({
            where: { id: explanationId },
            data: { quotedText, explanation },
        });
    }
    async deleteExplanation(explanationId) {
        return prisma.inlineExplanation.delete({
            where: { id: explanationId },
        });
    }
    // ✅ Get all members of education class (full roster)
    async getEducationClassMembers() {
        const educationClass = await prisma.serviceClass.findFirst({
            where: { class_name_amharic: 'የትምህርት ክፍል' },
        });
        if (!educationClass)
            throw new errors_1.NotFoundError('Education service class not found');
        const members = await prisma.user.findMany({
            where: {
                service_class_id: educationClass.id,
                system_role: 'MEMBER',
            },
            include: {
                // Use the exact relation names from your schema
                users_users_spiritual_father_idTousers: { select: { full_name_three_parts: true } },
                users_users_spiritual_mother_idTousers: { select: { full_name_three_parts: true } },
                users_users_repentance_father_idTousers: { select: { full_name_three_parts: true } },
                users_users_repentance_deacon_idTousers: { select: { full_name_three_parts: true } },
            },
            orderBy: { full_name_three_parts: 'asc' },
        });
        // Rename the nested objects to simpler property names for the frontend
        return members.map(member => ({
            id: member.id,
            full_name_three_parts: member.full_name_three_parts,
            email: member.email,
            university_id: member.university_id,
            phone_number: member.phone_number,
            academic_year: member.academic_year,
            academic_dept: member.academic_dept,
            dorm_block: member.dorm_block,
            dorm_room: member.dorm_room,
            is_active: member.is_active,
            created_at: member.created_at,
            spiritual_father: member.users_users_spiritual_father_idTousers,
            spiritual_mother: member.users_users_spiritual_mother_idTousers,
            repentance_father: member.users_users_repentance_father_idTousers,
            repentance_deacon: member.users_users_repentance_deacon_idTousers,
        }));
    }
    // ✅ Get enrolled members (for graduation) – all users with enrollments
    async getEnrolledMembers() {
        const members = await prisma.user.findMany({
            where: {
                lms_enrollments: { some: {} },
            },
            include: {
                lms_enrollments: {
                    include: { lms_batches: true },
                },
            },
            orderBy: { full_name_three_parts: 'asc' },
        });
        return members.map(m => ({
            id: m.id,
            fullName: m.full_name_three_parts,
            email: m.email,
            enrollments: m.lms_enrollments.map(e => ({
                phase: e.lms_batches.course_track,
                batchNumber: e.lms_batches.batch_number,
                status: e.status,
                isPassed: e.is_passed || false,
                finalExamScore: e.final_exam_score,
                quizScores: e.quiz_scores,
                graduated: m.graduated_phases?.includes(e.lms_batches.course_track.toLowerCase()) || false,
            })),
        }));
    }
    // ✅ Mark member as graduated (normal or force)
    async markMemberGraduated(memberId, phase) {
        const normalizedPhase = phase.toLowerCase();
        if (!GUBAE_PHASES.includes(normalizedPhase)) {
            throw new errors_1.BadRequestError(`Invalid phase. Must be one of: ${GUBAE_PHASES.join(', ')}`);
        }
        const user = await prisma.user.findUnique({ where: { id: memberId } });
        if (!user)
            throw new errors_1.NotFoundError('Member not found');
        let graduatedPhases = [];
        if (user.graduated_phases) {
            try {
                graduatedPhases = JSON.parse(user.graduated_phases);
            }
            catch {
                graduatedPhases = [];
            }
        }
        if (!graduatedPhases.includes(normalizedPhase)) {
            graduatedPhases.push(normalizedPhase);
        }
        const updated = await prisma.user.update({
            where: { id: memberId },
            data: { graduated_phases: JSON.stringify(graduatedPhases) },
            select: {
                id: true,
                full_name_three_parts: true,
                graduated_phases: true,
            },
        });
        // ✅ Send congratulatory notification to the member
        const phaseDisplay = GUBAE_NAMES[normalizedPhase] || normalizedPhase;
        await prisma.notification.create({
            data: {
                user_id: memberId,
                title: '🎓 Graduation Confirmed',
                message: `Congratulations! You have successfully graduated from ${phaseDisplay}.`,
                target_route: `/dashboard/courses?phase=${normalizedPhase.toUpperCase()}`,
                type: 'graduation',
                related_entity_id: memberId,
            },
        });
        return updated;
    }
    // ✅ Remove graduation status (with notification)
    async removeMemberGraduation(memberId, phase) {
        const normalizedPhase = phase.toLowerCase();
        if (!GUBAE_PHASES.includes(normalizedPhase)) {
            throw new errors_1.BadRequestError(`Invalid phase. Must be one of: ${GUBAE_PHASES.join(', ')}`);
        }
        const user = await prisma.user.findUnique({ where: { id: memberId } });
        if (!user)
            throw new errors_1.NotFoundError('Member not found');
        let graduatedPhases = [];
        if (user.graduated_phases) {
            try {
                graduatedPhases = JSON.parse(user.graduated_phases);
            }
            catch {
                graduatedPhases = [];
            }
        }
        graduatedPhases = graduatedPhases.filter(p => p !== normalizedPhase);
        const updated = await prisma.user.update({
            where: { id: memberId },
            data: { graduated_phases: JSON.stringify(graduatedPhases) },
            select: {
                id: true,
                full_name_three_parts: true,
                graduated_phases: true,
            },
        });
        // ✅ Notify the member that graduation has been revoked
        const phaseDisplay = GUBAE_NAMES[normalizedPhase] || normalizedPhase;
        await prisma.notification.create({
            data: {
                user_id: memberId,
                title: '⚠️ Graduation Revoked',
                message: `Your graduation from ${phaseDisplay} has been revoked by the Education Manager. Please contact them for more information.`,
                target_route: `/dashboard/courses?phase=${normalizedPhase.toUpperCase()}`,
                type: 'graduation',
                related_entity_id: memberId,
            },
        });
        return updated;
    }
    // ✅ Get graduation phase names for display
    getGubaePhases() {
        return GUBAE_PHASES.map(phase => ({
            id: phase,
            name: GUBAE_NAMES[phase],
        }));
    }
    async createLesson(data) {
        return prisma.lesson.create({ data });
    }
    // -------------------- EXAMS --------------------
    async createExam(data) {
        const { subjectId, batchId, title, description, questions, passingScore, isExitExam } = data;
        return prisma.exam.create({
            data: {
                subjectId,
                batchId,
                title,
                description,
                questions,
                passingScore,
                isExitExam,
            },
        });
    }
    async getExam(examId) {
        return prisma.exam.findUnique({ where: { id: examId } });
    }
    async submitExam(examId, userId, answers) {
        const exam = await prisma.exam.findUnique({ where: { id: examId } });
        if (!exam)
            throw new errors_1.NotFoundError('Exam not found');
        let totalPoints = 0;
        let earnedPoints = 0;
        for (const q of exam.questions) {
            totalPoints += q.points;
            if (answers[q.id] === q.correctAnswer)
                earnedPoints += q.points;
        }
        const score = (earnedPoints / totalPoints) * 100;
        const passed = score >= exam.passingScore;
        const enrollment = await prisma.lms_enrollments.findFirst({
            where: { user_id: userId, batch_id: exam.batchId },
        });
        if (!enrollment)
            throw new errors_1.BadRequestError('Not enrolled in this batch');
        const quizScores = enrollment.quiz_scores || {};
        if (exam.subjectId) {
            quizScores[exam.subjectId] = { score, passed, attempts: (quizScores[exam.subjectId]?.attempts || 0) + 1 };
            await prisma.lms_enrollments.update({
                where: { id: enrollment.id },
                data: { quiz_scores: quizScores },
            });
        }
        else {
            await prisma.lms_enrollments.update({
                where: { id: enrollment.id },
                data: { final_exam_score: score, is_passed: passed },
            });
        }
        return { score, passed };
    }
    // -------------------- HELPER: Get all Education Manager IDs --------------------
    async getEducationManagerIds() {
        // First, get the education service class ID
        const educationClass = await prisma.serviceClass.findFirst({
            where: { class_name_amharic: 'የትምህርት ክፍል' },
            select: { id: true },
        });
        if (!educationClass)
            return [];
        const managers = await prisma.user.findMany({
            where: {
                system_role: 'SERVICE_MANAGER',
                service_class_id: educationClass.id,
                is_active: true,
            },
            select: { id: true },
        });
        return managers.map(m => m.id);
    }
    // -------------------- ENROLLMENTS (Member) --------------------
    async getMyEnrollment(userId, phase) {
        const batch = await prisma.lms_batches.findFirst({
            where: { course_track: phase },
            orderBy: { batch_number: 'desc' },
        });
        if (!batch)
            return null;
        return prisma.lms_enrollments.findUnique({
            where: { user_id_batch_id: { user_id: userId, batch_id: batch.id } },
        });
    }
    async requestRegistration(userId, phase, batchId) {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        const graduatedPhases = [];
        if (user?.graduated_phases) {
            try {
                const parsed = JSON.parse(user.graduated_phases);
                if (Array.isArray(parsed)) {
                    graduatedPhases.push(...parsed.map(p => p.toUpperCase()));
                }
            }
            catch {
                // ignore
            }
        }
        const phaseOrder = { GUBAE_ABEW: 0, GUBAE_HAWARYAT: 1, GUBAE_ECCLESIAE: 2 };
        const currentLevel = phaseOrder[phase];
        if (currentLevel === undefined) {
            throw new errors_1.BadRequestError('Invalid phase');
        }
        if (currentLevel > 0) {
            const prevPhase = Object.keys(phaseOrder).find(p => phaseOrder[p] === currentLevel - 1);
            if (prevPhase && !graduatedPhases.includes(prevPhase)) {
                throw new errors_1.BadRequestError(`You must complete ${prevPhase} first.`);
            }
        }
        const existing = await prisma.lms_enrollments.findUnique({
            where: { user_id_batch_id: { user_id: userId, batch_id: batchId } },
        });
        if (existing)
            throw new errors_1.BadRequestError('Already registered or pending.');
        const enrollment = await prisma.lms_enrollments.create({
            data: { user_id: userId, batch_id: batchId, status: 'PENDING' },
        });
        // ✅ Send notifications to all Education Managers
        const managerIds = await this.getEducationManagerIds();
        if (managerIds.length > 0) {
            const phaseLabel = phase.replace('_', ' ');
            await prisma.notification.createMany({
                data: managerIds.map(managerId => ({
                    user_id: managerId,
                    title: '📚 New Course Registration Request',
                    message: `${user?.full_name_three_parts || 'A member'} requested registration for ${phaseLabel}.`,
                    target_route: '/dashboard/education?tab=registrations',
                    type: 'course_registration',
                    related_entity_id: enrollment.id,
                })),
            });
        }
        return enrollment;
    }
    // -------------------- MANAGER ENROLLMENT ACTIONS --------------------
    async getPendingEnrollments() {
        return prisma.lms_enrollments.findMany({
            where: { status: 'PENDING' },
            include: { users: true, lms_batches: true },
        });
    }
    async updateEnrollmentStatus(enrollmentId, status, reason) {
        const enrollment = await prisma.lms_enrollments.findUnique({
            where: { id: enrollmentId },
            include: { users: true, lms_batches: true },
        });
        if (!enrollment)
            throw new errors_1.NotFoundError('Enrollment not found');
        const updated = await prisma.lms_enrollments.update({
            where: { id: enrollmentId },
            data: { status: status },
        });
        // ✅ Send notification to the member
        const memberId = enrollment.user_id;
        const phase = enrollment.lms_batches.course_track;
        const phaseLabel = phase.replace('_', ' ');
        if (status === 'ACTIVE') {
            await prisma.notification.create({
                data: {
                    user_id: memberId,
                    title: '✅ Registration Approved',
                    message: `Your registration for ${phaseLabel} has been approved. You can now access the course.`,
                    target_route: `/dashboard/courses?phase=${phase}`,
                    type: 'course_registration',
                    related_entity_id: enrollmentId,
                },
            });
        }
        else if (status === 'REJECTED') {
            const rejectReason = reason || 'No specific reason provided.';
            await prisma.notification.create({
                data: {
                    user_id: memberId,
                    title: '❌ Registration Denied',
                    message: `Your registration for ${phaseLabel} was rejected. Reason: ${rejectReason}. Please contact the Education Manager.`,
                    target_route: `/dashboard/courses?phase=${phase}`,
                    type: 'course_registration',
                    related_entity_id: enrollmentId,
                },
            });
        }
        return updated;
    }
    async getEnrolledStudents(batchId) {
        return prisma.lms_enrollments.findMany({
            where: { batch_id: batchId, status: 'ACTIVE' },
            include: { users: true },
        });
    }
    // -------------------- RESULTS & GRADUATION --------------------
    async getStudentResults(filters) {
        const where = {};
        if (filters.batchId)
            where.batch_id = filters.batchId;
        if (filters.phase) {
            const batches = await prisma.lms_batches.findMany({ where: { course_track: filters.phase } });
            where.batch_id = { in: batches.map(b => b.id) };
        }
        return prisma.lms_enrollments.findMany({
            where,
            include: { users: true, lms_batches: true },
        });
    }
    async overrideSubjectScore(enrollmentId, subjectId, passed, score) {
        const enrollment = await prisma.lms_enrollments.findUnique({ where: { id: enrollmentId } });
        if (!enrollment)
            throw new errors_1.NotFoundError('Enrollment not found');
        const quizScores = enrollment.quiz_scores || {};
        quizScores[subjectId] = { ...quizScores[subjectId], passed, score, overridden: true };
        return prisma.lms_enrollments.update({
            where: { id: enrollmentId },
            data: { quiz_scores: quizScores },
        });
    }
    async overrideExitScore(enrollmentId, passed, score) {
        return prisma.lms_enrollments.update({
            where: { id: enrollmentId },
            data: { final_exam_score: score, is_passed: passed },
        });
    }
    async graduateMember(enrollmentId) {
        const enrollment = await prisma.lms_enrollments.findUnique({
            where: { id: enrollmentId },
            include: { lms_batches: true, users: true },
        });
        if (!enrollment)
            throw new errors_1.NotFoundError('Enrollment not found');
        if (!enrollment.is_passed)
            throw new errors_1.BadRequestError('Member has not passed exit exam');
        const phase = enrollment.lms_batches.course_track;
        const user = enrollment.users;
        const graduatedPhases = [];
        if (user.graduated_phases) {
            try {
                const parsed = JSON.parse(user.graduated_phases);
                if (Array.isArray(parsed))
                    graduatedPhases.push(...parsed);
            }
            catch { }
        }
        if (!graduatedPhases.includes(phase.toLowerCase())) {
            graduatedPhases.push(phase.toLowerCase());
            await prisma.user.update({
                where: { id: user.id },
                data: { graduated_phases: JSON.stringify(graduatedPhases) },
            });
        }
        return prisma.lms_enrollments.update({
            where: { id: enrollmentId },
            data: { status: 'GRADUATED' },
        });
    }
}
exports.EducationService = EducationService;
exports.educationService = new EducationService();
