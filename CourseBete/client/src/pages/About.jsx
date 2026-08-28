import { Heart, Users, Target, Award, TrendingUp, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

function About() {
  const values = [
    {
      icon: <Target size={28} />,
      title: 'Our Mission',
      description: 'To preserve and teach ancient church wisdom through modern, accessible online education.',
      color: 'blue'
    },
    {
      icon: <Heart size={28} />,
      title: 'Our Values',
      description: 'Faith, knowledge, and community are at the heart of everything we do.',
      color: 'red'
    },
    {
      icon: <Users size={28} />,
      title: 'Our Community',
      description: 'Join thousands of learners exploring Ethiopian Orthodox traditions together.',
      color: 'green'
    }
  ];

  const stats = [
    { icon: <BookOpen size={32} />, value: '50+', label: 'Courses' },
    { icon: <Users size={32} />, value: '10K+', label: 'Students' },
    { icon: <Award size={32} />, value: '95%', label: 'Success Rate' },
    { icon: <TrendingUp size={32} />, value: '4.8/5', label: 'Rating' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-heading font-bold mb-6">About CourseBete</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Empowering learners worldwide with quality education and accessible courses
            </p>
          </motion.div>
        </div>
      </div>

      {/* Story Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="glass-subtle rounded-3xl p-8 md:p-12 mb-16"
        >
          <h2 className="text-3xl font-heading font-bold text-gray-800 mb-6">Our Story</h2>
          <p className="text-gray-700 text-lg leading-relaxed mb-4">
            CourseBete was founded with a simple yet powerful vision: to make quality education accessible to everyone, everywhere.
            We believe that learning should know no boundaries, and that knowledge should be shared freely with those who seek it.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed">
            Today, we serve thousands of students worldwide, offering courses that combine traditional wisdom with modern learning methodologies.
            Our platform continues to grow, driven by our commitment to excellence and our passion for education.
          </p>
        </motion.div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-heading font-bold text-gray-800 mb-8 text-center">What Drives Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-subtle rounded-2xl p-6 hover-lift text-center"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-${value.color}-100 text-${value.color}-600 mb-4`}>
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Impact Stats */}
        <div className="glass rounded-3xl p-8 md:p-12">
          <h2 className="text-3xl font-heading font-bold text-gray-800 mb-8 text-center">Our Impact</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-blue-600 mb-3 flex justify-center">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</div>
                <div className="text-gray-600 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;