import { useState, useEffect } from 'react';
import api from '../api'; 
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';

function EditCourse() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    thumbnailUrl: ''
  });

  
  useEffect(() => {
    const fetchCourse = async () => {
        try {
            
            const res = await api.get(`/courses/${id}`);
            
            setFormData({
                title: res.data.title,
                description: res.data.description || '',
                thumbnailUrl: res.data.thumbnailUrl || ''
            });
            setLoading(false);
        } catch (error) {
            alert("Error loading course data");
            navigate('/admin');
        }
    };
    fetchCourse();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      
      await api.put(`/courses/${id}`, formData);

      alert("Course Updated Successfully!");
      navigate('/admin'); 

    } catch (error) {
      console.error(error);
      alert("Failed to update course.");
    }
  };

  if (loading) return <div className="p-20 text-center font-bold text-gray-500">Loading course data...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl h-fit">
        
        <div className="flex items-center gap-4 mb-6 border-b pb-4">
            <button onClick={() => navigate('/admin')} className="text-gray-500 hover:text-blue-600">
                <ArrowLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Edit Course</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-bold mb-2">Course Title</label>
            <input 
              type="text" 
              name="title" 
              value={formData.title}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2">Description</label>
            <textarea 
              name="description" 
              value={formData.description}
              rows="4"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2">Thumbnail Image URL</label>
            <input 
              type="text" 
              name="thumbnailUrl" 
              value={formData.thumbnailUrl}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
            />
          </div>

          <button 
            type="submit" 
            className="w-full py-3 rounded-lg font-bold text-white flex justify-center items-center gap-2 bg-yellow-600 hover:bg-yellow-700 shadow-md"
          >
            <Save size={20} />
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditCourse;