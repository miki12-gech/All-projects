import { Link } from 'react-router-dom';
import { BookOpen, Users, Award, ArrowRight, PlayCircle } from 'lucide-react';
import { motion } from 'framer-motion';

import heroImage from '../assets/image1.png';

function Home() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="bg-gray-50 overflow-hidden">

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white min-h-[90vh] flex items-center">

        {/* Abstract Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] animate-pulse"></div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          ></motion.div>
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          ></motion.div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">

            {/* Text Content */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="md:w-1/2 text-center md:text-left"
            >
              <motion.div variants={fadeInUp} className="inline-block px-4 py-1.5 mb-6 rounded-full bg-blue-800/50 border border-blue-400/30 text-blue-200 text-sm font-semibold backdrop-blur-sm">
                ✨ Premier Theological Education
              </motion.div>
              <motion.h1 variants={fadeInUp} className="text-6xl md:text-7xl font-heading font-extrabold mb-6 leading-tight tracking-tight">
                Master the Wisdom of <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-blue-100">The Ancient Church</span>
              </motion.h1>
              <motion.p variants={fadeInUp} className="text-lg md:text-xl text-blue-100 mb-10 leading-relaxed font-light max-w-xl mx-auto md:mx-0">
                Access premium courses on Geez, Bible History, and Theology. Track your progress, take quizzes, and grow in faith with our comprehensive curriculum.
              </motion.p>
              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-5 justify-center md:justify-start">
                <Link to="/register" className="group bg-white text-blue-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-50 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] flex items-center justify-center gap-2">
                  Start Learning
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/about" className="px-8 py-4 rounded-full font-bold text-lg border border-white/30 hover:bg-white/10 transition-all backdrop-blur-sm">
                  Learn More
                </Link>
              </motion.div>
            </motion.div>

            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="md:w-1/2 flex justify-center perspective-1000"
            >
              <motion.div
                whileHover={{ rotateY: 5, rotateX: 5 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600 rounded-2xl blur-2xl opacity-40 transform translate-y-4"></div>
                <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-sm border border-white/20 shadow-2xl relative z-10">
                  <img
                    src={heroImage}
                    alt="Senbet Tmhrt Education"
                    className="rounded-xl w-full max-w-md object-cover shadow-lg"
                  />
                </div>

                {/* Floating Badge */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1, duration: 0.5 }}
                  className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl flex items-center gap-3 z-20"
                >
                  <div className="bg-green-100 p-2 rounded-full text-green-600">
                    <Users size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase">Community</p>
                    <p className="text-gray-800 font-bold">1000+ Students</p>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10">
          <svg className="relative block w-[calc(100%+1.3px)] h-[60px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-gray-50"></path>
          </svg>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-32 bg-gray-50 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="text-blue-600 font-bold tracking-wider uppercase text-sm bg-blue-50 px-3 py-1 rounded-full">Why Choose Us</span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mt-4 mb-6">Experience a New Way to Learn</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto font-light leading-relaxed">We provide a structured and interactive way to learn, combining tradition with modern technology.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<BookOpen size={28} />}
              color="blue"
              title="Structured Curriculum"
              description="Courses are designed by experts, taking you from beginner to advanced levels step-by-step."
              delay={0}
            />
            <FeatureCard
              icon={<PlayCircle size={28} />}
              color="purple"
              title="Video Lessons"
              description="Watch high-quality video lectures and read supplementary materials at your own pace."
              delay={0.2}
            />
            <FeatureCard
              icon={<Award size={28} />}
              color="green"
              title="Earn Certificates"
              description="Complete quizzes and pass assessments to track your growth and earn recognition."
              delay={0.4}
            />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-slate-900 py-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-heading font-bold text-white mb-8"
          >
            Ready to start your journey?
          </motion.h2>
          <p className="text-slate-300 text-xl mb-10 font-light max-w-2xl mx-auto">Join our community today and begin learning immediately. It's free, easy, and spiritually rewarding.</p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/register" className="inline-block bg-blue-600 text-white px-12 py-5 rounded-full font-bold text-xl hover:bg-blue-500 transition-all shadow-xl hover:shadow-2xl shadow-blue-900/50">
              Create Free Account
            </Link>
          </motion.div>
        </div>
      </div>

    </div>
  );
}

function FeatureCard({ icon, color, title, description, delay }) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white",
    purple: "bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white",
    green: "bg-green-50 text-green-600 group-hover:bg-green-600 group-hover:text-white"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="group bg-white p-10 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-gray-50 rounded-bl-full -mr-4 -mt-4 transition-all group-hover:scale-150 group-hover:bg-opacity-50"></div>

      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300 ${colorClasses[color]} shadow-sm`}>
        {icon}
      </div>

      <h3 className="text-2xl font-bold mb-4 text-gray-900">{title}</h3>
      <p className="text-gray-500 leading-relaxed group-hover:text-gray-600 transition-colors">{description}</p>
    </motion.div>
  );
}

export default Home;