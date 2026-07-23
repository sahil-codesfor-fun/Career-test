import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Quiz = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    setActiveSection(Math.floor(currentIndex / 20));
  }, [currentIndex]);

  useEffect(() => {
    // In a real app, fetch questions from backend for this testId
    // For now, mock questions if API fails
    axios.get(`http://localhost:3000/api/assessments/tests/${testId}/questions`)
      .then(res => {
        setQuestions(res.data);
        setLoading(false);
      })
      .catch(() => {
        setQuestions([
          { id: 1, text: 'Are you interested in how machines work?', options: [{ text: 'Yes', weight: 5 }, { text: 'No', weight: 0 }] },
          { id: 2, text: 'Do you enjoy solving mathematical problems?', options: [{ text: 'Yes', weight: 5 }, { text: 'No', weight: 0 }] },
          { id: 3, text: 'Are you good at analyzing financial data?', options: [{ text: 'Yes', weight: 5 }, { text: 'No', weight: 0 }] },
        ]);
        setLoading(false);
      });
  }, [testId]);

  const handleOptionSelect = (questionId, option) => {
    setAnswers({ ...answers, [questionId]: option });
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const studentInfo = JSON.parse(localStorage.getItem('studentInfo') || '{}');
    
    try {
      const response = await axios.post('http://localhost:3000/api/assessments/submit', {
        student: studentInfo,
        testId: parseInt(testId),
        answers: answers
      }, {
        responseType: 'blob' // Crucial for PDF download
      });

      // Create a blob URL and trigger download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${studentInfo.name || 'Student'}_Result.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);

      alert('Assessment submitted successfully! Your results PDF is downloading.');
      navigate('/');
    } catch (error) {
      console.error('Error submitting assessment:', error);
      alert('Error submitting assessment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-[calc(100vh-80px)]">Loading questions...</div>;
  }

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 flex justify-center py-12 px-4">
      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl">
        {/* Main Quiz Area */}
        <div className="w-full lg:w-3/4 bg-white rounded-xl shadow-lg p-8 h-fit">
          <div className="mb-8">
            <div className="flex justify-between text-sm font-medium text-gray-500 mb-2">
              <span>Question {currentIndex + 1} of {questions.length}</span>
              <span>{Math.round(progress)}% Completed</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-brand-orange h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
            </div>
          </div>

          <h3 className="text-2xl font-semibold text-gray-800 mb-6">{currentQuestion?.text}</h3>
          
          <div className="space-y-4 mb-8">
            {currentQuestion?.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleOptionSelect(currentQuestion.id, option)}
                className={`w-full text-left px-6 py-4 rounded-lg border-2 transition-all ${
                  answers[currentQuestion.id]?.text === option.text
                    ? 'border-brand-orange bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {option.text}
              </button>
            ))}
          </div>

          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-100">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className={`px-6 py-2 rounded font-medium transition-colors ${
                currentIndex === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Previous
            </button>
            
            <div className="flex gap-4">
              {/* Submit Early Button for testing */}
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="text-sm px-4 py-2 text-brand-blue border border-brand-blue hover:bg-blue-50 rounded transition-colors"
                title="Submit test early without answering all questions"
              >
                Submit Early
              </button>

              {currentIndex === questions.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  disabled={submitting || !answers[currentQuestion.id]}
                  className={`px-8 py-2 rounded font-bold transition-colors ${
                    submitting || !answers[currentQuestion.id] ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-brand-orange hover:bg-brand-orange/90 text-white shadow-md hover:shadow-lg'
                  }`}
                >
                  {submitting ? 'Generating...' : 'Submit'}
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  disabled={!answers[currentQuestion.id]}
                  className={`px-8 py-2 rounded font-medium transition-colors ${
                    !answers[currentQuestion.id] ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-brand-blue hover:bg-brand-blue/90 text-white'
                  }`}
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Question Palette Sidebar */}
        <div className="w-full lg:w-1/4 bg-white rounded-xl shadow-lg p-6 h-fit">
          <h4 className="font-bold text-gray-800 mb-4 border-b pb-2">Questions Palette</h4>
          
          {/* Section Tabs Navbar */}
          {questions.length > 20 && (
            <div className="flex gap-2 overflow-x-auto mb-4 pb-2 custom-scrollbar">
              {Array.from({ length: Math.ceil(questions.length / 20) }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSection(idx)}
                  className={`px-3 py-1.5 rounded font-medium text-xs whitespace-nowrap transition-colors ${
                    activeSection === idx 
                      ? 'bg-brand-blue text-white shadow-sm' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Section {idx + 1}
                </button>
              ))}
            </div>
          )}

          <div className="flex flex-col gap-6">
            {(() => {
              const start = activeSection * 20;
              const sectionQuestions = questions.slice(start, start + 20);
              
              return (
                <div>
                  <div className="grid grid-cols-5 sm:grid-cols-8 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                    {sectionQuestions.map((q, localIdx) => {
                      const idx = start + localIdx;
                      const isAnswered = !!answers[q.id];
                      const isCurrent = idx === currentIndex;
                      
                      return (
                        <button
                          key={q.id}
                          onClick={() => setCurrentIndex(idx)}
                          className={`w-full aspect-square flex items-center justify-center rounded-lg font-medium text-sm transition-all shadow-sm ${
                            isCurrent 
                              ? 'bg-brand-blue text-white ring-2 ring-blue-200 ring-offset-1 scale-105' 
                              : isAnswered 
                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                : 'bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100 hover:border-gray-300'
                          }`}
                          title={isAnswered ? "Answered" : "Unanswered"}
                        >
                          {idx + 1}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
          </div>
          
          <div className="mt-6 pt-4 border-t flex flex-col gap-2 text-sm text-gray-600">
             <div className="flex items-center gap-2">
               <div className="w-4 h-4 rounded bg-green-100"></div>
               <span>Answered</span>
             </div>
             <div className="flex items-center gap-2">
               <div className="w-4 h-4 rounded bg-gray-50 border border-gray-200"></div>
               <span>Unanswered</span>
             </div>
             <div className="flex items-center gap-2">
               <div className="w-4 h-4 rounded bg-brand-blue"></div>
               <span>Current</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
