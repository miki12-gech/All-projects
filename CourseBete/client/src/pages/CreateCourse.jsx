import { useState } from 'react';
import api from '../api'; 
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';

function CreateCourse() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    thumbnailUrl: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
     
      await api.post('/courses', formData);

      alert("Course Created Successfully!");
      navigate('/admin'); 

    } catch (error) {
      console.error(error);
      alert("Failed to create course.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl h-fit">
        
        <div className="flex items-center gap-4 mb-6 border-b pb-4">
            <button onClick={() => navigate('/admin')} className="text-gray-500 hover:text-blue-600">
                <ArrowLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Create New Course</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label className="block text-gray-700 font-bold mb-2">Course Title</label>
            <input 
              type="text" 
              name="title" 
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. History of Ethiopian Church"
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2">Description</label>
            <textarea 
              name="description" 
              rows="4"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="What will students learn in this course?"
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2">Thumbnail Image URL</label>
            <input 
              type="text" 
              name="thumbnailUrl" 
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/image.jpg"
              onChange={handleChange}
            />
            <p className="text-sm text-gray-400 mt-1">Leave blank for default image</p>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-3 rounded-lg font-bold text-white flex justify-center items-center gap-2
                ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}
            `}
          >
            <Save size={20} />
            {loading ? "Saving..." : "Publish Course"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default CreateCourse;