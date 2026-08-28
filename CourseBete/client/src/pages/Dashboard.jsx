import { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import CourseCard from '../components/CourseCard';
import { BookOpen, TrendingUp, Award } from 'lucide-react';
import { motion } from 'framer-motion';

function Dashboard() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedName = localStorage.getItem('userName');
        const token = localStorage.getItem('token');

        setUserName(storedName || 'Student');

        if (!token) {
          navigate('/login');
          return;
        }

        const response = await api.get('/courses');
        setCourses(response.data);

      } catch (error) {
        console.error('Error fetching courses:', error);

        if (error.response && error.response.status === 401) {
          localStorage.clear();
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // Calculate stats
  const totalCourses = courses.length;
  const inProgressCount = courses.filter(c => c.progress > 0 && c.progress < 100).length;
  const completedCount = courses.filter(c => c.progress === 100).length;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-20">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-2">
              Welcome back, {userName}! 👋
            </h1>
            <p className="text-blue-100 text-lg">Ready to continue your learning journey?</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-8">
        {/* Stats Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <motion.div variants={itemVariants} className="glass-subtle rounded-2xl p-6 hover-lift">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-4 rounded-xl">
                <BookOpen className="text-blue-600" size={28} />
              </div>
              <div>
                <p className="text-gray-500 text-sm font-semibold">Total Courses</p>
                <p className="text-3xl font-bold text-gray-800">{totalCourses}</p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="glass-subtle rounded-2xl p-6 hover-lift">
            <div className="flex items-center gap-4">
              <div className="bg-orange-100 p-4 rounded-xl">
                <TrendingUp className="text-orange-600" size={28} />
              </div>
              <div>
                <p className="text-gray-500 text-sm font-semibold">In Progress</p>
                <p className="text-3xl font-bold text-gray-800">{inProgressCount}</p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="glass-subtle rounded-2xl p-6 hover-lift">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-4 rounded-xl">
                <Award className="text-green-600" size={28} />
              </div>
              <div>
                <p className="text-gray-500 text-sm font-semibold">Completed</p>
                <p className="text-3xl font-bold text-gray-800">{completedCount}</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Courses Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-heading font-bold text-gray-800">Your Courses</h2>
            <span className="text-gray-500 font-medium">{courses.length} available</span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-md animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6 space-y-4">
                    <div className="skeleton-text w-3/4"></div>
                    <div className="skeleton-text w-full"></div>
                    <div className="skeleton-text w-full"></div>
                    <div className="skeleton-text w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {courses.length > 0 ? (
                courses.map((course, index) => (
                  <motion.div key={course.id} variants={itemVariants}>
                    <CourseCard
                      id={course.id}
                      title={course.title}
                      description={course.description}
                      image={course.thumbnailUrl}
                      lessonCount={course.totalLessons}
                      progress={course.progress}
                    />
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full">
                  <div className="glass-subtle rounded-2xl p-12 text-center">
                    <BookOpen className="mx-auto mb-4 text-gray-400" size={64} />
                    <h3 className="text-xl font-bold text-gray-700 mb-2">No courses available yet</h3>
                    <p className="text-gray-500">Check back later for new courses!</p>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;