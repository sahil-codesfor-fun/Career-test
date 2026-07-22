import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);

  useEffect(() => {
    // In a real app, fetch tests from backend. For now, using mock tests if backend is down.
    axios.get('http://localhost:3000/api/assessments/tests')
      .then(res => setTests(res.data))
      .catch(err => console.error('Failed to fetch tests', err));
  }, []);

  const handleStartTest = (testId) => {
    navigate(`/register/${testId}`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top Banner Alert */}
      <div className="bg-[#f0c341] text-center py-2 font-medium text-gray-900 text-sm">
        Limited Seats Remaining! Admissions for 2026 Are Closing Soon. Apply Today.
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-serif text-gray-900 mb-4">Assessment Tests</h1>
          <p className="text-gray-500 text-lg max-w-3xl">
            Discover the right career path based on your interests, skills, and personality. Get personalized stream and course recommendations to plan your future confidently.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          {/* Left Side - Image Placeholder (Matching the girls studying in screenshot) */}
          <div className="w-full lg:w-1/3 hidden md:block">
            <div className="rounded-2xl overflow-hidden shadow-lg h-[500px] relative bg-orange-50">
              <img 
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Students studying" 
                className="w-full h-full object-cover"
              />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-orange-100 rounded-full opacity-50"></div>
            </div>
          </div>

          {/* Right Side - Test Grid */}
          <div className="w-full lg:w-2/3">
            {tests.length === 0 ? (
              <div className="text-center py-20 bg-gray-50 rounded-xl border border-gray-200">
                <h3 className="text-2xl font-medium text-gray-700">No Assessment Tests Available</h3>
                <p className="text-gray-500 mt-2">Please check back later or contact the administration.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {tests.slice(0, 4).map((test) => (
                    <div key={test.id} className="flex gap-4">
                      <div className="mt-1">
                        <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-gray-50 text-brand-blue text-2xl font-bold">
                           📚
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{test.title}</h3>
                        <p className="text-gray-500 text-sm mb-4 min-h-[40px]">
                          {test.description || 'Take this assessment to find out your true potential and recommended career path in this domain.'}
                        </p>
                        <button 
                          onClick={() => handleStartTest(test.id)}
                          className="bg-[#f0c341] hover:bg-[#e0b230] text-gray-900 font-medium py-2 px-6 rounded transition-colors"
                        >
                          Start Test
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {tests.length > 4 && (
                  <div className="mt-12 pt-8 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {tests.slice(4).map((test) => (
                      <div key={test.id} className="flex gap-4">
                        <div className="mt-1">
                          <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-gray-50 text-brand-blue text-2xl font-bold">
                             🎓
                          </div>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800 mb-2">{test.title}</h3>
                          <p className="text-gray-500 text-sm mb-4 min-h-[40px]">
                            {test.description || 'Take this assessment to find out your true potential.'}
                          </p>
                          <button 
                            onClick={() => handleStartTest(test.id)}
                            className="bg-[#f0c341] hover:bg-[#e0b230] text-gray-900 font-medium py-2 px-6 rounded transition-colors"
                          >
                            Start Test
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
