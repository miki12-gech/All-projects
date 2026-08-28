import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api'; 
import { Plus, Trash, Save, ArrowLeft } from 'lucide-react';

function AddLesson() {
  const { courseId } = useParams(); 
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [lesson, setLesson] = useState({
    title: '',
    videoUrl: '',
    contentText: '',
    order: 1
  });

  const [questions, setQuestions] = useState([
    { questionText: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '' }
  ]);

  const handleLessonChange = (e) => setLesson({ ...lesson, [e.target.name]: e.target.value });

  const addQuestion = () => {
    setQuestions([...questions, { questionText: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '' }]);
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      
      await api.post(`/courses/${courseId}/lessons`, {
        ...lesson,
        questions 
      });

      alert("Lesson & Quiz Added!");
      navigate('/admin'); 

    } catch (error) {
      console.error(error);
      alert("Failed to save lesson.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-4xl">
        
        <div className="flex items-center gap-4 mb-6 border-b pb-4">
            <button onClick={() => navigate('/admin')}><ArrowLeft /></button>
            <h1 className="text-2xl font-bold">Add Lesson & Quiz</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div className="space-y-4 bg-blue-50 p-6 rounded-lg">
            <h3 className="font-bold text-blue-800">1. Lesson Details</h3>
            <input type="text" name="title" placeholder="Lesson Title" onChange={handleLessonChange} className="w-full p-3 border rounded" required />
            <input type="text" name="videoUrl" placeholder="YouTube Video URL" onChange={handleLessonChange} className="w-full p-3 border rounded" />
            <textarea name="contentText" placeholder="Lesson Text Content" onChange={handleLessonChange} className="w-full p-3 border rounded h-24"></textarea>
            <input type="number" name="order" placeholder="Order (e.g., 1)" onChange={handleLessonChange} className="w-full p-3 border rounded" required />
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="font-bold text-gray-800">2. Quiz Builder</h3>
                <button type="button" onClick={addQuestion} className="text-blue-600 font-bold flex gap-1 items-center hover:underline">
                    <Plus size={18}/> Add Question
                </button>
            </div>

            {questions.map((q, qIndex) => (
                <div key={qIndex} className="border p-4 rounded-lg bg-gray-50 relative">
                    <div className="mb-2">
                        <label className="text-sm font-bold">Question {qIndex + 1}</label>
                        <input 
                            value={q.questionText}
                            onChange={(e) => handleQuestionChange(qIndex, 'questionText', e.target.value)}
                            placeholder="Type question here..." 
                            className="w-full p-2 border rounded mt-1"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-2">
                        {q.options.map((opt, oIndex) => (
                            <input 
                                key={oIndex}
                                value={opt}
                                onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                placeholder={`Option ${oIndex + 1}`}
                                className={`p-2 border rounded ${q.correctAnswer === oIndex ? 'border-green-500 bg-green-50' : ''}`}
                                required
                            />
                        ))}
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="text-xs font-bold text-gray-500">Correct Answer (Index 0-3)</label>
                            <select 
                                value={q.correctAnswer}
                                onChange={(e) => handleQuestionChange(qIndex, 'correctAnswer', parseInt(e.target.value))}
                                className="w-full p-2 border rounded"
                            >
                                <option value={0}>Option 1</option>
                                <option value={1}>Option 2</option>
                                <option value={2}>Option 3</option>
                                <option value={3}>Option 4</option>
                            </select>
                        </div>
                        <div className="flex-[2]">
                            <label className="text-xs font-bold text-gray-500">Explanation</label>
                            <input 
                                value={q.explanation}
                                onChange={(e) => handleQuestionChange(qIndex, 'explanation', e.target.value)}
                                placeholder="Why is this correct?" 
                                className="w-full p-2 border rounded"
                            />
                        </div>
                    </div>
                </div>
            ))}
          </div>

          <button type="submit" disabled={loading} className="w-full py-4 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 flex justify-center items-center gap-2">
            <Save /> {loading ? "Saving..." : "Save Lesson & Quiz"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddLesson;