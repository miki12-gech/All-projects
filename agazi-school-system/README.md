# 🎓 Agazi School Management System

A modern, feature-rich school management system built with **NestJS**, **Nuxt.js**, and **PostgreSQL**.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ Features

### 🔐 Authentication & Authorization
- Secure JWT-based authentication
- Role-based access control (Admin, Teacher, Student, Parent)
- Password hashing with bcrypt
- Auto-login persistence

### 👨‍🎓 Student Management
- Add, edit, and delete students
- Grade level assignment (9-12)
- Stream selection (Natural/Social Science for grades 11-12)
- Search and filter functionality
- Student profiles with detailed information

### 📋 Attendance Tracking
- Daily attendance marking
- Status options: Present, Absent, Late
- Real-time statistics
- Grade-wise attendance reports
- Date-specific records

### 📊 Grades Management
- Subject-wise grade entry
- Automatic letter grade calculation (A-F)
- Term/Semester support
- Performance statistics
- Pass/Fail tracking

### 📈 Reports & Analytics
- Attendance reports
- Grade distribution charts
- Performance overview
- Top performers list
- Export functionality (coming soon)

### 🎨 Modern UI/UX
- Glassmorphism design
- Gradient backgrounds
- Smooth animations
- Responsive layout
- Dark mode ready
- Intuitive navigation

## 🛠️ Tech Stack

### Backend
- **NestJS** - Progressive Node.js framework
- **Prisma ORM** - Type-safe database client
- **PostgreSQL** - Robust database
- **JWT** - Secure authentication
- **Bcrypt** - Password hashing

### Frontend
- **Nuxt.js 3** - Vue.js framework
- **TailwindCSS** - Utility-first CSS
- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Type safety

## 📦 Installation

### Prerequisites
- Node.js >= 18
- PostgreSQL >= 14
- npm or yarn

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Setup environment variables
# Copy .env.example to .env and configure your database

# Run Prisma migrations
npx prisma migrate dev

# Seed initial data (optional)
npx prisma db seed

# Start development server
npm run start:dev
```

The backend will be running at `http://localhost:3001`

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be running at `http://localhost:3000`

## 🚀 Quick Start

1. **Start the Backend:**
   ```bash
   cd backend
   npm run start:dev
   ```

2. **Start the Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:3000`

4. **Login with test credentials:**
   ```
   Email: admin@agazi.edu.et
   Password: admin123
   ```
   (Create these credentials first using the API or seed data)

## 📁 Project Structure

```
agazi-school-system/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   └── migrations/        # Database migrations
│   ├── src/
│   │   ├── auth/             # Authentication module
│   │   ├── student/          # Student management
│   │   ├── attendance/       # Attendance tracking
│   │   ├── grade/            # Grades management
│   │   ├── subject/          # Subjects module
│   │   └── prisma/           # Prisma service
│   └── package.json
│
└── frontend/
    ├── pages/
    │   ├── login.vue         # Login page
    │   ├── dashboard.vue     # Main dashboard
    │   ├── students/         # Student management
    │   ├── attendance/       # Attendance pages
    │   ├── grades/           # Grades pages
    │   └── reports/          # Reports & analytics
    ├── components/           # Reusable components
    ├── composables/          # Vue composables
    ├── assets/
    │   └── css/
    │       └── main.css      # Global styles
    └── package.json
```

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Students
- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get student by ID
- `POST /api/students` - Create student
- `PATCH /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

### Attendance
- `GET /api/attendance` - Get attendance records
- `POST /api/attendance` - Mark attendance
- `GET /api/attendance/student/:id` - Get student attendance

### Grades
- `POST /api/grade/mark` - Mark grades
- `GET /api/grade/student/:id` - Get student grades
- `GET /api/grade/class/:grade` - Get class grades

### Subjects
- `GET /api/subjects` - Get all subjects
- `POST /api/subjects` - Create subject

## 🎨 Design Features

### Color Palette
- **Primary**: Blue (#2563eb)
- **Secondary**: Purple (#7c3aed)
- **Accent**: Cyan (#06b6d4)
- **Success**: Green (#10b981)
- **Warning**: Yellow (#f59e0b)
- **Error**: Red (#ef4444)

### Typography
- **Primary Font**: Inter
- **Secondary Font**: Poppins

### Components
- Glassmorphism cards
- Gradient buttons
- Animated inputs
- Statistics cards
- Data tables
- Modal overlays

## 🔒 Security Features

- JWT token authentication
- Password encryption with bcrypt
- Role-based access control
- CORS configuration
- Input validation
- SQL injection prevention (Prisma)

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- 📱 Mobile devices (320px+)
- 📱 Tablets (768px+)
- 💻 Desktops (1024px+)
- 🖥️ Large screens (1440px+)

## 🚧 Future Enhancements

- [ ] Parent portal
- [ ] Teacher dashboard
- [ ] Timetable management
- [ ] Fee management
- [ ] Library system
- [ ] Event calendar
- [ ] Notifications system
- [ ] Mobile app (React Native)
- [ ] PDF report generation
- [ ] Excel export
- [ ] Email notifications
- [ ] SMS integration
- [ ] Biometric attendance

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- **Mikiale Getachew** - *Initial work*

## 🙏 Acknowledgments

- NestJS Team
- Nuxt.js Team
- Prisma Team
- All contributors

## 📞 Support

For support, email support@agazi.edu.et or open an issue in the repository.

---

Made with ❤️ by the Agazi Development Team
