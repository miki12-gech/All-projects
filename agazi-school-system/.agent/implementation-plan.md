# Agazi School System - Comprehensive Enhancement Plan

## Overview
This implementation plan addresses 8 major enhancement areas to make the system production-ready with proper role-based access control, complete functionality, better UX, and security.

---

## 1. Authentication & Security Enhancement

### 1.1 User Registration & Password Management
**Current Issue:** Students can change email/name which breaks security
**Solution:**
- Admin registers students with all details (name, email, phone, family info)
- Admin provides initial credentials (email + default password)
- Students can ONLY change their password (not email or name)
- Implement password reset functionality (admin-initiated)

**Database Changes Needed:**
- Add phone number field (10 digits, starting with 0)
- Add family detail fields (father name, mother name, guardian phone, etc.)
- Add password reset token/timestamp fields

**Backend Implementation:**
- Update Student model in schema.prisma
- Create change-password endpoint (students only)
- Create admin-reset-password endpoint (admin only)
- Add validation for phone number format

**Frontend Implementation:**
- Profile page for students (view-only for name/email, editable password)
- Admin student management with full CRUD operations
- Password change modal/page

---

## 2. Complete Functional Features (Remove "Coming Soon")

### 2.1 Student Management (CRUD)
**Implement:**
- ✅ Create Student (Admin only) - with all details
- ✅ Read Students (with filtering by grade, section)
- ✅ Update Student (Admin only - full details, Student - password only)
- ✅ Delete Student (Admin only)

### 2.2 Notifications System
**Implement:**
- Notification model in database
- Real-time notifications for:
  - New announcements
  - Grade submissions
  - Attendance alerts
  - System notifications
- Notification bell with dropdown
- Mark as read functionality

### 2.3 Dark Mode Toggle
**Implement:**
- Add dark mode toggle in navigation
- Use CSS variables for theming
- Persist preference in localStorage
- Update all components to support dark mode

---

## 3. Color Scheme Update

**Current:** Purple-based theme
**New:** School-appropriate Yellow/Gold and White theme

**Implementation:**
- Update CSS color variables
- Primary: Yellow/Gold (#F59E0B, #FCD34D)
- Secondary: White (#FFFFFF, #F9FAFB)
- Accent: Deep Blue (#1E3A8A) for contrast
- Success: Green
- Error: Red
- Update all gradient combinations
- Ensure text contrast for accessibility

---

## 4. Class Section Management & Attendance Filtering

### 4.1 Section Assignment System
**Requirements:**
- Admin defines class capacity (e.g., 40 students per section)
- Auto-assign sections (A, B, C, D...) based on registration order
- Manual section reassignment option

**Database Changes:**
- Add `section` field to Student model (enum: A-Z)
- Add `classCapacity` setting (system-wide or grade-specific)

**Implementation:**
- Backend: Auto-assignment logic during student registration
- Backend: Section management endpoints
- Frontend: Section selector in attendance/grades
- Frontend: Student list grouped by section

### 4.2 Enhanced Attendance Filtering
**Requirements:**
- When Grade 11 is selected → show only Grade 11 students
- Further filter by section (11A, 11B, 11C, etc.)

**Implementation:**
- Update attendance API to filter by grade + section
- Frontend: Cascading dropdowns (Grade → Section)
- Display format: "Grade 11 - Section A"

---

## 5. Role-Based Attendance Access

### 5.1 Teacher Attendance
**Requirements:**
- Teachers can mark attendance for their assigned classes
- View attendance history for their classes

**Database Changes:**
- Add Teacher model
- Link Teachers to Subjects and Sections
- Add `teacherId` to Attendance records

**Implementation:**
- Teacher assignment interface (admin)
- Teacher-specific attendance view
- Attendance history reporting

### 5.2 Admin Attendance
**Requirements:**
- Full access to all attendance records
- View/edit any grade/section
- Generate attendance reports

---

## 6. Grading System Enhancement

### 6.1 Comprehensive Grade Component System
**Requirements:**
- Final Exam: 50%
- Mid Exam: 30%
- Quiz: 10%
- Class Activity: 10%
- Total: 100%

**Database Changes:**
```prisma
model Grade {
  finalExam     Float  // out of 50
  midExam       Float  // out of 30
  quiz          Float  // out of 10
  classActivity Float  // out of 10
  totalScore    Float  // calculated
  letterGrade   String // calculated
  ...
}
```

### 6.2 Letter Grade Calculation
**Grading Scale:**
- A+: ≥90
- A: 85-89
- A-: 80-84
- B+: 75-79
- B: 70-74
- B-: 65-69
- C+: 60-64
- C: 55-59
- C-: 50-54
- D: 45-49
- F: <45

**Pass/Fail:**
- Pass: ≥50
- Fail: <50

**Implementation:**
- Grade calculation service (backend)
- Grade entry form for teachers (per subject, per student)
- Automatic letter grade assignment
- Grade report generation

### 6.3 Teacher Grade Entry
**Requirements:**
- Teachers enter grades for their assigned subject
- Per student, per subject basis
- Validation for each component range
- Section-based filtering

**Frontend:**
- Grade entry table (spreadsheet-like)
- Section selector
- Subject selector (based on teacher assignment)
- Save/Submit functionality

---

## 7. Grade/Section Filtering (Emphasis)

**Critical Requirement:** When selecting Grade 11:
- Show ONLY Grade 11 students
- Further filter by sections (A, B, C, etc.)
- Apply to ALL modules: Attendance, Grades, Reports, Student List

**Implementation Checklist:**
- ✅ Attendance page: Grade + Section filters
- ✅ Grade entry page: Grade + Section filters
- ✅ Student list page: Grade + Section filters
- ✅ Reports page: Grade + Section filters
- ✅ Backend APIs updated with proper filtering
- ✅ Context saved (last selected grade/section)

---

## 8. Role-Based Access Control (RBAC)

### 8.1 Student Role
**Can Access:**
- Dashboard (own stats only)
- View own grades/report card
- Change own password
- View announcements
- View own attendance record

**Cannot Access:**
- Student list
- Other students' data
- Admin functions
- Teacher functions

### 8.2 Teacher Role
**Can Access:**
- Dashboard (own classes stats)
- Mark attendance (assigned classes only)
- Enter grades (assigned subjects only)
- View student list (assigned classes only)
- Change own password
- Post announcements (optional)

**Cannot Access:**
- Other teachers' classes
- Admin-only features (user management, system settings)
- Delete students

### 8.3 Admin Role
**Full Access:**
- All student data (CRUD)
- All teacher data (CRUD)
- System settings
- All attendance records
- All grade records
- All reports
- User management
- Assign teachers to classes

### 8.4 Security Implementation
**Backend:**
- JWT-based authentication
- Role guards on all routes
- Ownership validation (students can only access own data)
- Audit logging

**Frontend:**
- Route guards based on role
- Conditional UI rendering
- API requests include auth tokens
- Automatic redirect on unauthorized access

**Registration Security:**
- Admin-only registration endpoint
- Student accounts created by admin
- Initial password: system-generated or default
- Force password change on first login (optional enhancement)

---

## Implementation Priority

### Phase 1: Critical Security & Database (Week 1)
1. Update database schema (sections, phone, family details, teacher model)
2. Run migrations
3. Implement authentication enhancements
4. Implement RBAC middleware

### Phase 2: Core Functionality (Week 2)
5. Complete student CRUD operations
6. Implement section auto-assignment
7. Update attendance with section filtering
8. Implement teacher role functionality

### Phase 3: Grading System (Week 3)
9. Implement comprehensive grading system
10. Build grade entry interface for teachers
11. Implement grade calculation logic
12. Generate report cards

### Phase 4: UX & Polish (Week 4)
13. Update color scheme to yellow/white
14. Implement dark mode toggle
15. Build notifications system
16. Add proper error handling and validation
17. Testing and bug fixes

---

## Testing Checklist

- [ ] Admin can register students with all details
- [ ] Students can ONLY change password
- [ ] Grade filtering shows correct students
- [ ] Section filtering works correctly
- [ ] Teachers can only access assigned classes
- [ ] Students cannot see other students' data
- [ ] Grading calculation is accurate
- [ ] Letter grades assigned correctly
- [ ] Pass/Fail determination works
- [ ] Dark mode toggle works
- [ ] Color scheme applied throughout
- [ ] Notifications display correctly
- [ ] All APIs have proper auth guards
- [ ] Phone validation works (10 digits, starts with 0)

---

## Files to Modify/Create

### Backend
- `prisma/schema.prisma` - Add fields
- `src/student/student.service.ts` - Enhanced CRUD
- `src/student/student.controller.ts` - New endpoints
- `src/student/dto/*.dto.ts` - Updated DTOs
- `src/auth/auth.service.ts` - Password change
- `src/teacher/` - New module
- `src/grade/grade.service.ts` - Calculation logic
- `src/grade/grade.controller.ts` - Teacher endpoints
- `src/notification/` - New module
- `src/common/guards/role.guard.ts` - RBAC
- `src/common/decorators/roles.decorator.ts` - RBAC

### Frontend
- `assets/css/theme.css` - New color scheme
- `composables/useDarkMode.ts` - Dark mode logic
- `pages/students/index.vue` - Full CRUD
- `pages/attendance/index.vue` - Section filtering
- `pages/grades/index.vue` - Teacher grade entry
- `components/SectionSelector.vue` - Reusable component
- `components/NotificationBell.vue` - Notifications
- `components/DarkModeToggle.vue` - Theme switcher
- `pages/profile.vue` - Password change
- `middleware/auth.ts` - Role-based routing
- `middleware/role.ts` - Permission checks

---

## Notes
- This is a production-ready system
- Security is paramount
- All changes must be tested
- Database migrations must be reversible
- Keep code clean and documented
- Follow SOLID principles
- Maintain consistent code style
