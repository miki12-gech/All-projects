import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import { PlayCircle, FileText, CheckCircle, XCircle, Trophy, AlertCircle } from 'lucide-react';

function CoursePlayer() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [loading, setLoading] = useState(true);


  const [isQuizMode, setIsQuizMode] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);

  //
  useEffect(() => {
    const fetchCourse = async () => {
      try {

        const response = await api.get(`/courses/${id}`);

        setCourse(response.data);
        if (response.data.lessons.length > 0) {
          setActiveLesson(response.data.lessons[0]);
        }
      } catch (error) {
        console.error("Error loading course:", error);
        if (error.response && error.response.status === 401) {
          alert("Please login to view this course.");
          window.location.href = '/login';
        }
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);


  const changeLesson = (lesson) => {
    setActiveLesson(lesson);
    setIsQuizMode(false);
    setQuizResult(null);
    setUserAnswers({});
  };


  const handleStartQuiz = async () => {
    try {
      // --- THE FIX ---
      const res = await api.get(`/quiz/${activeLesson.id}`);

      if (res.data.length === 0) {
        alert("No questions found for this lesson yet.");
        return;
      }
      setQuizQuestions(res.data);
      setIsQuizMode(true);
      setQuizResult(null);
      setUserAnswers({});
    } catch (err) {
      console.error(err);
      alert("Error loading quiz.");
    }
  };


  const handleSelectOption = (questionId, optionIndex) => {
    if (userAnswers[questionId] !== undefined) return;
    setUserAnswers({ ...userAnswers, [questionId]: optionIndex });
  };


  const handleSubmitQuiz = async () => {
    try {
      // --- THE FIX ---
      const res = await api.post('/quiz/submit', {
        lessonId: activeLesson.id,
        userAnswers
      });
      setQuizResult(res.data);
    } catch (err) {
      alert("Failed to submit quiz.");
    }
  };


  const getOptionClass = (question, optionIndex) => {
    const userAnswer = userAnswers[question.id];

    if (userAnswer === undefined) {
      return "bg-white hover:bg-gray-50 border-gray-200 text-gray-700";
    }

    if (optionIndex === question.correctAnswer) {
      return "bg-green-100 border-green-500 text-green-800 font-bold shadow-sm";
    }

    if (userAnswer === optionIndex && optionIndex !== question.correctAnswer) {
      return "bg-red-100 border-red-500 text-red-800 font-medium";
    }

    return "bg-gray-50 text-gray-400 border-gray-100 opacity-60";
  };

  if (loading) return <div className="text-center py-20 font-bold text-gray-500">Loading Class...</div>;
  if (!course) return <div className="text-center py-20 text-red-500">Course not found.</div>;

  return (
    <div className="flex flex-col lg:flex-row min-h-screen lg:h-[calc(100vh-80px)] lg:overflow-hidden bg-gray-100">

      {/* --- LEFT SIDE: STAGE --- */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center bg-gray-900">
        <div className="w-full max-w-4xl">

          {!isQuizMode ? (
            /* --- VIDEO MODE --- */
            <>
              <div className="aspect-video bg-black rounded-xl shadow-2xl flex items-center justify-center mb-6 overflow-hidden relative border border-gray-700">
                {activeLesson?.videoUrl ? (
                  <iframe
                    src={activeLesson.videoUrl.replace('watch?v=', 'embed/')}
                    className="w-full h-full"
                    title="Lesson Video"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <div className="text-gray-500 flex flex-col items-center">
                    <PlayCircle size={64} className="mb-4 text-gray-600" />
                    <p>No Video Available</p>
                  </div>
                )}
              </div>

              <div className="bg-white p-8 rounded-xl shadow-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">{activeLesson?.title}</h1>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                      {activeLesson?.contentText || "No reading material for this lesson."}
                    </p>
                  </div>

                  <button
                    onClick={handleStartQuiz}
                    className="bg-purple-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-purple-700 flex items-center gap-2 shadow-lg transition-transform hover:scale-105"
                  >
                    <Trophy size={20} />
                    Take Quiz
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* --- QUIZ MODE --- */
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-3xl mx-auto animate-fade-in">

              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-2xl font-bold text-gray-800">Quiz: {activeLesson.title}</h2>
                <button onClick={() => setIsQuizMode(false)} className="text-gray-400 hover:text-red-500 font-medium">
                  Exit Quiz
                </button>
              </div>

              {quizResult ? (
                /* RESULT SCREEN */
                <div className="text-center py-10">
                  {quizResult.passed ? (
                    <CheckCircle size={80} className="text-green-500 mx-auto mb-4" />
                  ) : (
                    <XCircle size={80} className="text-red-500 mx-auto mb-4" />
                  )}
                  <h3 className={`text-3xl font-bold mb-2 ${quizResult.passed ? 'text-green-600' : 'text-red-600'}`}>
                    {quizResult.message}
                  </h3>
                  <p className="text-gray-600 text-lg">
                    You scored <span className="font-bold">{quizResult.score}</span> out of <span className="font-bold">{quizResult.total}</span>
                  </p>
                  <button
                    onClick={() => setIsQuizMode(false)}
                    className="mt-8 bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700"
                  >
                    Back to Lesson
                  </button>
                </div>
              ) : (
                /* QUESTIONS LIST */
                <div className="space-y-10">
                  {quizQuestions.map((q, qIndex) => (
                    <div key={q.id} className="p-6 rounded-xl border border-gray-100 bg-gray-50">
                      <h3 className="font-bold text-xl mb-4 text-gray-800">
                        <span className="text-blue-600 mr-2">{qIndex + 1}.</span>
                        {q.questionText}
                      </h3>

                      <div className="grid grid-cols-1 gap-3">
                        {q.options.map((opt, optIndex) => (
                          <button
                            key={optIndex}
                            onClick={() => handleSelectOption(q.id, optIndex)}
                            disabled={userAnswers[q.id] !== undefined}
                            className={`w-full text-left p-4 rounded-lg border transition-all duration-300 flex items-center justify-between
                                                ${getOptionClass(q, optIndex)}
                                            `}
                          >
                            <span className="text-lg">{opt}</span>
                            {userAnswers[q.id] !== undefined && optIndex === q.correctAnswer && (
                              <CheckCircle size={22} className="text-green-600" />
                            )}
                            {userAnswers[q.id] === optIndex && optIndex !== q.correctAnswer && (
                              <XCircle size={22} className="text-red-600" />
                            )}
                          </button>
                        ))}
                      </div>

                      {userAnswers[q.id] !== undefined && (
                        <div className={`mt-4 p-4 rounded-lg border-l-4 animate-fade-in ${userAnswers[q.id] === q.correctAnswer
                            ? "bg-green-50 border-green-500 text-green-900"
                            : "bg-red-50 border-red-500 text-red-900"
                          }`}>
                          <div className="flex items-start gap-3">
                            <AlertCircle size={20} className="mt-1 flex-shrink-0" />
                            <div>
                              <p className="font-bold mb-1">
                                {userAnswers[q.id] === q.correctAnswer ? "Correct!" : "Incorrect Answer"}
                              </p>
                              <p className="text-sm opacity-90">
                                {q.explanation || "No additional explanation provided."}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  <div className="pt-4 border-t">
                    <button
                      onClick={handleSubmitQuiz}
                      disabled={Object.keys(userAnswers).length !== quizQuestions.length}
                      className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all
                                    ${Object.keys(userAnswers).length === quizQuestions.length
                          ? "bg-green-600 text-white hover:bg-green-700 hover:scale-[1.02]"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"}
                                `}
                    >
                      {Object.keys(userAnswers).length === quizQuestions.length
                        ? "Finish & Save Result"
                        : `Answer all questions to finish (${Object.keys(userAnswers).length}/${quizQuestions.length})`}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* --- RIGHT SIDE: PLAYLIST --- */}
      <div className="w-full lg:w-96 bg-white border-l border-gray-200 h-full overflow-y-auto">
        <div className="p-5 border-b sticky top-0 bg-white z-10 shadow-sm">
          <h2 className="font-bold text-lg text-gray-800">Course Content</h2>
          <p className="text-sm text-gray-500">{course.lessons.length} Lessons</p>
        </div>

        <div className="divide-y divide-gray-100">
          {course.lessons.map((lesson, index) => (
            <button
              key={lesson.id}
              onClick={() => changeLesson(lesson)}
              className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors text-left
                        ${activeLesson?.id === lesson.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''}
                    `}
            >
              <div className="mt-1 text-gray-400">
                {activeLesson?.id === lesson.id ? <PlayCircle size={20} className="text-blue-600" /> : <FileText size={20} />}
              </div>
              <div>
                <h4 className={`text-sm font-medium ${activeLesson?.id === lesson.id ? 'text-blue-800' : 'text-gray-700'}`}>
                  {index + 1}. {lesson.title}
                </h4>
                <span className="text-xs text-gray-400">Video + Quiz</span>
              </div>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}

export default CoursePlayer;