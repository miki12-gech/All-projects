import { useNavigate } from 'react-router-dom';
import { Play, CheckCircle, Clock, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

function CourseCard({ id, title, description, image, lessonCount, progress = 0 }) {
  const navigate = useNavigate();

  const getButtonText = () => {
    if (progress === 100) return 'Review Course';
    if (progress > 0) return 'Continue Learning';
    return 'Start Learning';
  };

  const getButtonIcon = () => {
    if (progress === 100) return <CheckCircle size={18} />;
    return <Play size={18} />;
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="card-interactive h-full flex flex-col group"
      onClick={() => navigate(`/course/${id}`)}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden rounded-t-2xl h-48 bg-gradient-to-br from-blue-100 to-purple-100">
        {image ? (
          <motion.img
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen size={48} className="text-blue-400" />
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Progress Badge */}
        {progress > 0 && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg">
            <span className="text-xs font-bold text-blue-600">{progress}% Complete</span>
          </div>
        )}

        {/* Free Badge */}
        <div className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full shadow-lg">
          <span className="text-xs font-bold">Free Course</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-heading font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">
          {description}
        </p>

        {/* Meta Info */}
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <BookOpen size={16} />
            <span>{lessonCount} Lessons</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={16} />
            <span>{lessonCount * 10} mins</span>
          </div>
        </div>

        {/* Progress Bar */}
        {progress > 0 && (
          <div className="mb-4">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
              />
            </div>
          </div>
        )}

        {/* CTA Button */}
        <button className="w-full btn-primary flex items-center justify-center gap-2">
          {getButtonIcon()}
          {getButtonText()}
        </button>
      </div>
    </motion.div>
  );
}

export default CourseCard;