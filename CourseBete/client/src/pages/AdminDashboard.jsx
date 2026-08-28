import { useState, useEffect } from 'react';
import api from '../api';
import { PlusCircle, Book, Users, Trash2, Plus, Edit, LogOut, Eye, X, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('courses');
    const [courses, setCourses] = useState([]);
    const [students, setStudents] = useState([]);
    const [stats, setStats] = useState({ totalStudents: 0, totalCourses: 0 });
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showCreateAdmin, setShowCreateAdmin] = useState(false);
    const [newAdminData, setNewAdminData] = useState({ fullName: '', email: '', password: '' });

    const navigate = useNavigate();

    // Get user role from localStorage
    const userRole = localStorage.getItem('userRole');
    const isSuperAdmin = userRole === 'superadmin';

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const coursesRes = await api.get('/courses');
                setCourses(coursesRes.data);

                const studentsRes = await api.get('/students');
                setStudents(studentsRes.data);

                setStats({
                    totalStudents: studentsRes.data.length,
                    totalCourses: coursesRes.data.length
                });

            } catch (error) {
                console.error("Error loading admin data", error);
                if (error.response?.status === 401) navigate('/login');
            }
        };
        fetchAdminData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const handleDeleteCourse = async (id) => {
        if (!window.confirm("Are you sure? This will delete all lessons and quizzes inside it.")) return;

        try {
            await api.delete(`/courses/${id}`);
            setCourses(courses.filter(c => c.id !== id));
            setStats(prev => ({ ...prev, totalCourses: prev.totalCourses - 1 }));
        } catch (err) {
            alert("Failed to delete course");
        }
    };

    const handleDeleteStudent = async (id) => {
        if (!window.confirm("Are you sure you want to remove this student?")) return;

        try {
            await api.delete(`/users/${id}`);
            setStudents(students.filter(s => s.id !== id));
            setStats(prev => ({ ...prev, totalStudents: prev.totalStudents - 1 }));
        } catch (err) {
            alert("Failed to delete student");
        }
    };

    const handleToggleRole = async (student) => {
        if (!window.confirm(`Make ${student.fullName} an Admin?`)) return;

        try {
            await api.put(`/users/${student.id}/role`);
            alert("User promoted to Admin successfully!");
            setStudents(students.filter(s => s.id !== student.id));
            setStats(prev => ({ ...prev, totalStudents: prev.totalStudents - 1 }));
        } catch (err) {
            alert("Failed to update role");
        }
    };

    const handleCreateAdmin = async (e) => {
        e.preventDefault();
        try {
            await api.post('/create-admin', newAdminData);
            alert('Admin user created successfully!');
            setShowCreateAdmin(false);
            setNewAdminData({ fullName: '', email: '', password: '' });
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to create admin');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8 relative">

            {selectedStudent && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in">
                        <div className="bg-blue-600 p-6 flex justify-between items-center text-white">
                            <div>
                                <h2 className="text-xl font-bold">{selectedStudent.fullName}</h2>
                                <p className="text-blue-100 text-sm">{selectedStudent.email}</p>
                            </div>
                            <button onClick={() => setSelectedStudent(null)} className="hover:bg-blue-700 p-2 rounded-full">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 max-h-[60vh] overflow-y-auto">
                            <h3 className="font-bold text-gray-700 mb-4 text-lg border-b pb-2">Quiz History</h3>

                            {selectedStudent.quizResults.length > 0 ? (
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                                        <tr>
                                            <th className="p-3">Course</th>
                                            <th className="p-3">Lesson</th>
                                            <th className="p-3">Score</th>
                                            <th className="p-3">Result</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {selectedStudent.quizResults.map((result, idx) => (
                                            <tr key={idx} className="border-b">
                                                <td className="p-3 font-medium">{result.lesson.course.title}</td>
                                                <td className="p-3 text-gray-600">{result.lesson.title}</td>
                                                <td className="p-3 font-bold">{Math.round(result.score)}%</td>
                                                <td className="p-3">
                                                    {result.passed ? (
                                                        <span className="text-green-700 bg-green-100 px-2 py-1 rounded text-xs font-bold">Passed</span>
                                                    ) : (
                                                        <span className="text-red-700 bg-red-100 px-2 py-1 rounded text-xs font-bold">Failed</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="text-gray-500 italic text-center py-4">No quizzes taken yet.</p>
                            )}
                        </div>
                        <div className="p-4 bg-gray-50 text-right">
                            <button onClick={() => setSelectedStudent(null)} className="px-6 py-2 bg-gray-300 rounded hover:bg-gray-400 font-bold text-gray-700">Close</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
                        {isSuperAdmin && (
                            <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                SUPERADMIN
                            </span>
                        )}
                        {!isSuperAdmin && (
                            <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                                ADMIN
                            </span>
                        )}
                    </div>
                    <p className="text-gray-500">Manage CourseBete Content</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <button
                        onClick={handleLogout}
                        className="bg-white text-gray-600 px-4 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-200 font-bold shadow-sm"
                    >
                        <LogOut size={20} /> Sign Out
                    </button>
                    {isSuperAdmin && (
                        <button
                            onClick={() => setShowCreateAdmin(true)}
                            className="bg-purple-600 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-purple-700 font-bold shadow-lg"
                        >
                            <Shield size={20} /> Create Admin
                        </button>
                    )}
                    <button
                        onClick={() => navigate('/admin/create-course')}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 font-bold shadow-lg"
                    >
                        <PlusCircle size={20} /> Create New Course
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500 flex items-center gap-4">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-full"><Book size={24} /></div>
                    <div>
                        <p className="text-gray-500 text-sm">Total Courses</p>
                        <h3 className="text-2xl font-bold">{courses.length}</h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500 flex items-center gap-4">
                    <div className="p-3 bg-green-100 text-green-600 rounded-full"><Users size={24} /></div>
                    <div>
                        <p className="text-gray-500 text-sm">Active Students</p>
                        <h3 className="text-2xl font-bold">{students.length}</h3>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden min-h-[400px]">
                <div className="flex border-b">
                    <button
                        className={`flex-1 p-4 font-bold text-center ${activeTab === 'courses' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
                        onClick={() => setActiveTab('courses')}
                    >
                        Manage Courses
                    </button>
                    <button
                        className={`flex-1 p-4 font-bold text-center ${activeTab === 'students' ? 'bg-green-50 text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:bg-gray-50'}`}
                        onClick={() => setActiveTab('students')}
                    >
                        Manage Students
                    </button>
                </div>

                {activeTab === 'courses' && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[600px]">
                            <thead>
                                <tr className="bg-gray-50 text-gray-500 text-sm uppercase">
                                    <th className="p-4">Title</th>
                                    <th className="p-4">Lessons</th>
                                    <th className="p-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {courses.map((course) => (
                                    <tr key={course.id} className="border-b hover:bg-gray-50">
                                        <td className="p-4 font-bold text-gray-800">{course.title}</td>
                                        <td className="p-4 text-blue-600 font-medium">{course.lessonCount} Lessons</td>
                                        <td className="p-4 flex gap-2 justify-center">
                                            <button
                                                onClick={() => navigate(`/admin/course/${course.id}/add-lesson`)}
                                                className="text-blue-600 bg-blue-50 p-2 rounded hover:bg-blue-100"
                                                title="Add Lesson"
                                            >
                                                <Plus size={18} />
                                            </button>
                                            <button
                                                onClick={() => navigate(`/admin/edit-course/${course.id}`)}
                                                className="text-yellow-600 bg-yellow-50 p-2 rounded hover:bg-yellow-100"
                                                title="Edit Course"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            {isSuperAdmin && (
                                                <button
                                                    onClick={() => handleDeleteCourse(course.id)}
                                                    className="text-red-600 bg-red-50 p-2 rounded hover:bg-red-100"
                                                    title="Delete Course (Superadmin Only)"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'students' && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[600px]">
                            <thead>
                                <tr className="bg-gray-50 text-gray-500 text-sm uppercase">
                                    <th className="p-4">Name / Email</th>
                                    <th className="p-4">Quizzes Taken</th>
                                    <th className="p-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.length > 0 ? (
                                    students.map((student) => (
                                        <tr key={student.id} className="border-b hover:bg-gray-50">
                                            <td className="p-4">
                                                <p className="font-bold text-gray-800">{student.fullName}</p>
                                                <p className="text-xs text-gray-500">{student.email}</p>
                                            </td>
                                            <td className="p-4">
                                                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm font-bold">
                                                    {student.quizResults.length} Tests
                                                </span>
                                            </td>
                                            <td className="p-4 flex gap-3 justify-center">
                                                <button
                                                    onClick={() => setSelectedStudent(student)}
                                                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-bold text-sm bg-blue-50 px-3 py-1 rounded"
                                                >
                                                    <Eye size={16} /> View
                                                </button>

                                                {isSuperAdmin && (
                                                    <button
                                                        onClick={() => handleToggleRole(student)}
                                                        className="flex items-center gap-1 text-purple-600 hover:text-purple-800 font-bold text-sm bg-purple-50 px-3 py-1 rounded"
                                                        title="Promote to Admin (Superadmin Only)"
                                                    >
                                                        <Shield size={16} /> Admin
                                                    </button>
                                                )}

                                                {isSuperAdmin && (
                                                    <button
                                                        onClick={() => handleDeleteStudent(student.id)}
                                                        className="flex items-center gap-1 text-red-500 hover:text-red-700 font-bold text-sm bg-red-50 px-3 py-1 rounded"
                                                        title="Delete User (Superadmin Only)"
                                                    >
                                                        <Trash2 size={16} /> Delete
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="3" className="p-10 text-center text-gray-500">No students registered yet.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Create Admin Modal (Superadmin Only) */}
            {showCreateAdmin && isSuperAdmin && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Create Admin User</h2>
                            <button onClick={() => setShowCreateAdmin(false)} className="text-gray-500 hover:text-gray-700">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleCreateAdmin} className="space-y-4">
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2 text-sm">Full Name</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none"
                                    value={newAdminData.fullName}
                                    onChange={(e) => setNewAdminData({ ...newAdminData, fullName: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2 text-sm">Email</label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none"
                                    value={newAdminData.email}
                                    onChange={(e) => setNewAdminData({ ...newAdminData, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2 text-sm">Password</label>
                                <input
                                    type="password"
                                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none"
                                    value={newAdminData.password}
                                    onChange={(e) => setNewAdminData({ ...newAdminData, password: e.target.value })}
                                    required
                                    minLength={6}
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateAdmin(false)}
                                    className="flex-1 px-4 py-3 bg-gray-200 rounded-lg hover:bg-gray-300 font-bold text-gray-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-bold shadow-lg"
                                >
                                    Create Admin
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}

export default AdminDashboard;