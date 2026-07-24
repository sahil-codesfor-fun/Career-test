import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Cpu, TrendingUp, Activity, BookOpen, Compass, Award, PencilRuler, Rocket, BarChart2, Users, Target, Briefcase, GraduationCap, ClipboardList, Brain, Zap, Crosshair, Map as MapIcon } from 'lucide-react';
import { LoaderThree } from '../components/ui/loader';
const Home = () => {
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [counsellingForm, setCounsellingForm] = useState({ name: '', email: '', mobile: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleCounsellingSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post('http://localhost:3000/api/counselling', counsellingForm);
      setIsSubmitted(true);
      setCounsellingForm({ name: '', email: '', mobile: '' });
    } catch (error) {
      console.error('Failed to submit counselling request', error);
      alert('Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    // Reset submission state after drawer animation
    setTimeout(() => setIsSubmitted(false), 300);
  };

  useEffect(() => {
    // Artificial minimum delay so the beautiful loader is actually visible
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 800);

    axios.get('http://localhost:3000/api/assessments/tests')
      .then(res => setTests(res.data))
      .catch(err => console.error('Failed to fetch tests', err));

    return () => clearTimeout(timer);
  }, []);

  const handleStartTest = (testId) => {
    navigate(`/register/${testId}`);
  };

  const getTest = (keywords) => {
    return tests.find(t => keywords.some(kw => t.title.toLowerCase().includes(kw.toLowerCase())));
  };

  const engineeringTest = getTest(['engineering']);
  const medicalTest = getTest(['medical', 'life science']);
  const humanitiesTest = getTest(['humanities']);
  const commerceTest = getTest(['commerce']);
  const class1112Test = getTest(['10+1', '11th', '12th', '10+2']);
  const diplomaTest = getTest(['diploma']);
  const class110Test = getTest(['1st - 10th', '1-10', '1 to 10']);

  if (isPageLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <LoaderThree className="scale-150 mb-4" />
        <p className="text-gray-400 font-medium animate-pulse">Loading amazing things...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left Content */}
          <div className="w-full lg:w-1/2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50 text-brand-orange font-medium text-sm mb-6 border border-orange-100">
              <span className="text-brand-orange"> </span> AI-Powered Career Assessment
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-[1.1] mb-6 tracking-tight">
              Discover Your <br /> Perfect <span className="text-brand-orange">Career Path</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-lg leading-relaxed">
              Get personalized career recommendations based on your personality, aptitude, interests, and skills.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="bg-brand-orange hover:bg-brand-orange/90 text-white font-semibold py-3.5 px-8 rounded-full text-center transition-colors shadow-lg shadow-red-200"
              >
                Get a free career counselling expert
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
              <div className="flex flex-col gap-2 p-5 rounded-2xl bg-white shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 hover:shadow-[0_4px_20px_rgb(0,0,0,0.08)] transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-brand-orange mb-2">
                  <Users className="w-6 h-6" />
                </div>
                <span className="text-3xl font-bold text-gray-900 tracking-tight">25K+</span>
                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Students Guided</span>
              </div>
              <div className="flex flex-col gap-2 p-5 rounded-2xl bg-white shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 hover:shadow-[0_4px_20px_rgb(0,0,0,0.08)] transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 mb-2">
                  <Target className="w-6 h-6" />
                </div>
                <span className="text-3xl font-bold text-gray-900 tracking-tight">98%</span>
                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Accuracy Rate</span>
              </div>
              <div className="flex flex-col gap-2 p-5 rounded-2xl bg-white shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 hover:shadow-[0_4px_20px_rgb(0,0,0,0.08)] transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-2">
                  <Briefcase className="w-6 h-6" />
                </div>
                <span className="text-3xl font-bold text-gray-900 tracking-tight">50+</span>
                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Career Domains</span>
              </div>
              <div className="flex flex-col gap-2 p-5 rounded-2xl bg-white shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 hover:shadow-[0_4px_20px_rgb(0,0,0,0.08)] transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-2">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <span className="text-3xl font-bold text-gray-900 tracking-tight">15K+</span>
                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Success Stories</span>
              </div>
            </div>
          </div>

          {/* Right Image/Graphic */}
          <div className="w-full lg:w-1/2 relative hidden md:block">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-orange-100 to-red-50 rounded-full blur-[80px] -z-10"></div>

            {/* Floating Badge 1 */}
            <div className="absolute -top-4 right-8 z-10" style={{ animation: 'float 3.5s ease-in-out infinite' }}>
              <div className="w-16 h-16 bg-white/70 backdrop-blur-xl border border-white/60 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex items-center justify-center transform rotate-6 hover:rotate-0 transition-transform duration-300">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl flex items-center justify-center">
                  <Rocket className="w-5 h-5 text-brand-orange" />
                </div>
              </div>
            </div>

            {/* Floating Badge 2 */}
            <div className="absolute bottom-16 -left-8 z-10" style={{ animation: 'float 4s ease-in-out infinite', animationDelay: '1s' }}>
              <div className="w-16 h-16 bg-white/70 backdrop-blur-xl border border-white/60 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex items-center justify-center transform -rotate-6 hover:rotate-0 transition-transform duration-300">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                  <BarChart2 className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Main Image */}
            <div className="rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] ring-1 ring-black/5 relative group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="Students"
                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out relative z-0"
              />
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div id="how-it-works" className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">How It Works</h2>
            <p className="text-gray-500">Simple steps to a better career</p>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative gap-8 md:gap-0 mt-8">
            {/* Desktop connecting line */}
            <div className="hidden md:block absolute top-10 left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-purple-100 via-orange-100 to-teal-100 -z-10"></div>

            {[
              { icon: ClipboardList, color: 'bg-purple-50 text-purple-600', title: 'Choose Level', desc: 'Select your education level' },
              { icon: Brain, color: 'bg-green-50 text-green-600', title: 'Take Assessment', desc: 'Complete AI-powered assessment' },
              { icon: Zap, color: 'bg-orange-50 text-orange-600', title: 'Get Analysis', desc: 'AI analyzes your strengths' },
              { icon: Crosshair, color: 'bg-blue-50 text-blue-600', title: 'Discover Careers', desc: 'Get personalized career recommendations' },
              { icon: MapIcon, color: 'bg-teal-50 text-teal-600', title: 'Plan Your Future', desc: 'Follow roadmap to achieve your goals' }
            ].map((step, idx) => {
              const IconComponent = step.icon;
              return (
                <div key={idx} className="flex flex-col items-center text-center w-full md:w-1/5 relative z-10 group">
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] ring-4 ring-white group-hover:-translate-y-2 transition-transform duration-300">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${step.color}`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-500 px-2 leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Assessments Section */}
      <div id="assessments" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">

        {/* Class 12 Section */}
        <div className="mb-24">
          <h2 className="text-4xl font-serif text-gray-900 mb-4">Class 12 Students</h2>
          <p className="text-gray-500 mb-12">
            Discover the right career path based on your interests, skills, and personality. Get personalized stream and course recommendations to plan your future confidently.
          </p>

          <div className="flex flex-col lg:flex-row gap-12">
            {/* Left Image */}
            <div className="w-full lg:w-1/3">
              <div className="rounded-2xl overflow-hidden shadow-lg h-full min-h-[400px] relative bg-orange-50">
                <img
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Class 12 Students"
                  className="w-full h-full object-cover"
                />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-orange-100 rounded-full opacity-50"></div>
              </div>
            </div>

            {/* Right Grid */}
            <div className="w-full lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
              {/* Engineering */}
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-orange-100 text-brand-orange shadow-sm flex-shrink-0">
                  <Cpu className="w-6 h-6" />
                </div>
                <div className="flex flex-col items-start">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{engineeringTest?.title || 'Engineering'}</h3>
                  <p className="text-gray-500 text-sm mb-4 min-h-[40px]">
                    {engineeringTest ? (engineeringTest.description || "Take this assessment to discover your strengths and the best career paths for you.") : "This test is not added yet, please come back later."}
                  </p>
                  {engineeringTest ? (
                    <button
                      onClick={() => handleStartTest(engineeringTest.id)}
                      className="bg-brand-orange hover:bg-brand-orange/90 text-white border-none font-medium py-1.5 px-6 shadow-sm transition-colors rounded"
                    >
                      Start Test
                    </button>
                  ) : (
                    <button
                      disabled
                      className="bg-gray-200 text-gray-500 cursor-not-allowed border-none font-medium py-1.5 px-6 shadow-sm rounded"
                    >
                      Coming Soon
                    </button>
                  )}
                </div>
              </div>

              {/* Medical & Life Sciences */}
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-red-100 text-red-600 shadow-sm flex-shrink-0">
                  <Activity className="w-6 h-6" />
                </div>
                <div className="flex flex-col items-start">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{medicalTest?.title || 'Medical & Life Sciences'}</h3>
                  <p className="text-gray-500 text-sm mb-4 min-h-[40px]">
                    {medicalTest ? (medicalTest.description || "Take this assessment to discover your strengths and the best career paths for you.") : "This test is not added yet, please come back later."}
                  </p>
                  {medicalTest ? (
                    <button
                      onClick={() => handleStartTest(medicalTest.id)}
                      className="bg-brand-orange hover:bg-brand-orange/90 text-white border-none font-medium py-1.5 px-6 shadow-sm transition-colors rounded"
                    >
                      Start Test
                    </button>
                  ) : (
                    <button
                      disabled
                      className="bg-gray-200 text-gray-500 cursor-not-allowed border-none font-medium py-1.5 px-6 shadow-sm rounded"
                    >
                      Coming Soon
                    </button>
                  )}
                </div>
              </div>

              {/* Humanities */}
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-purple-100 text-purple-600 shadow-sm flex-shrink-0">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div className="flex flex-col items-start">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{humanitiesTest?.title || 'Humanities'}</h3>
                  <p className="text-gray-500 text-sm mb-4 min-h-[40px]">
                    {humanitiesTest ? (humanitiesTest.description || "Take this assessment to discover your strengths and the best career paths for you.") : "This test is not added yet, please come back later."}
                  </p>
                  {humanitiesTest ? (
                    <button
                      onClick={() => handleStartTest(humanitiesTest.id)}
                      className="bg-brand-orange hover:bg-brand-orange/90 text-white border-none font-medium py-1.5 px-6 shadow-sm transition-colors rounded"
                    >
                      Start Test
                    </button>
                  ) : (
                    <button
                      disabled
                      className="bg-gray-200 text-gray-500 cursor-not-allowed border-none font-medium py-1.5 px-6 shadow-sm rounded"
                    >
                      Coming Soon
                    </button>
                  )}
                </div>
              </div>

              {/* Commerce */}
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-blue-100 text-brand-blue shadow-sm flex-shrink-0">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div className="flex flex-col items-start">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{commerceTest?.title || 'Commerce'}</h3>
                  <p className="text-gray-500 text-sm mb-4 min-h-[40px]">
                    {commerceTest ? (commerceTest.description || "Take this assessment to discover your strengths and the best career paths for you.") : "This test is not added yet, please come back later."}
                  </p>
                  {commerceTest ? (
                    <button
                      onClick={() => handleStartTest(commerceTest.id)}
                      className="bg-brand-orange hover:bg-brand-orange/90 text-white border-none font-medium py-1.5 px-6 shadow-sm transition-colors rounded"
                    >
                      Start Test
                    </button>
                  ) : (
                    <button
                      disabled
                      className="bg-gray-200 text-gray-500 cursor-not-allowed border-none font-medium py-1.5 px-6 shadow-sm rounded"
                    >
                      Coming Soon
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-gray-200 mb-16" />

        {/* Class 10 & Below Section */}
        <div className="flex flex-col md:flex-row gap-12">

          {/* Class 10 Students */}
          <div className="flex-1 md:border-r border-gray-300 md:pr-12">
            <h2 className="text-4xl font-serif text-gray-900 mb-4">Class 10 Students</h2>
            <p className="text-gray-500 mb-12">
              Explore diverse streams beyond the usual choices based on your aptitude and interests. Get clear guidance to select the best-fit path for your future success.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {/* 11th-12th */}
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 shadow-sm flex-shrink-0">
                  <Compass className="w-6 h-6" />
                </div>
                <div className="flex flex-col items-start">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{class1112Test?.title || '10+1 / 10+2'}</h3>
                  <p className="text-gray-500 text-sm mb-4 min-h-[40px]">
                    {class1112Test ? (class1112Test.description || "Take this assessment to discover your strengths and the best career paths for you.") : "This test is not added yet, please come back later."}
                  </p>
                  {class1112Test ? (
                    <button
                      onClick={() => handleStartTest(class1112Test.id)}
                      className="bg-brand-orange hover:bg-brand-orange/90 text-white border-none font-medium py-1.5 px-6 shadow-sm transition-colors rounded"
                    >
                      Start Test
                    </button>
                  ) : (
                    <button
                      disabled
                      className="bg-gray-200 text-gray-500 cursor-not-allowed border-none font-medium py-1.5 px-6 shadow-sm rounded"
                    >
                      Coming Soon
                    </button>
                  )}
                </div>
              </div>

              {/* Diploma Courses */}
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-amber-100 text-amber-600 shadow-sm flex-shrink-0">
                  <Award className="w-6 h-6" />
                </div>
                <div className="flex flex-col items-start">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{diplomaTest?.title || 'Diploma Courses'}</h3>
                  <p className="text-gray-500 text-sm mb-4 min-h-[40px]">
                    {diplomaTest ? (diplomaTest.description || "Take this assessment to discover your strengths and the best career paths for you.") : "This test is not added yet, please come back later."}
                  </p>
                  {diplomaTest ? (
                    <button
                      onClick={() => handleStartTest(diplomaTest.id)}
                      className="bg-brand-orange hover:bg-brand-orange/90 text-white border-none font-medium py-1.5 px-6 shadow-sm transition-colors rounded"
                    >
                      Start Test
                    </button>
                  ) : (
                    <button
                      disabled
                      className="bg-gray-200 text-gray-500 cursor-not-allowed border-none font-medium py-1.5 px-6 shadow-sm rounded"
                    >
                      Coming Soon
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Below Class 10 Students */}
          <div className="flex-1 md:pl-4">
            <h2 className="text-4xl font-serif text-gray-900 mb-4">Below Class 10 students</h2>
            <p className="text-gray-500 mb-12">
              Understand your strengths and interests early to build a strong foundation. Discover hobbies, skills, and career areas that excite and inspire you.
            </p>

            <div className="grid grid-cols-1 gap-8">
              {/* Class 1st - 10th */}
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 shadow-sm flex-shrink-0">
                  <PencilRuler className="w-6 h-6" />
                </div>
                <div className="flex flex-col items-start">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{class110Test?.title || 'Class 1st - 10th'}</h3>
                  <p className="text-gray-500 text-sm mb-4 min-h-[40px]">
                    {class110Test ? (class110Test.description || "Take this assessment to discover your strengths and the best career paths for you.") : "This test is not added yet, please come back later."}
                  </p>
                  {class110Test ? (
                    <button
                      onClick={() => handleStartTest(class110Test.id)}
                      className="bg-brand-orange hover:bg-brand-orange/90 text-white border-none font-medium py-1.5 px-6 shadow-sm transition-colors rounded"
                    >
                      Start Test
                    </button>
                  ) : (
                    <button
                      disabled
                      className="bg-gray-200 text-gray-500 cursor-not-allowed border-none font-medium py-1.5 px-6 shadow-sm rounded"
                    >
                      Coming Soon
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Drawer Overlay */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-[60] transition-opacity backdrop-blur-sm"
          onClick={closeDrawer}
        />
      )}

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[600px] bg-transparent z-[70] transform transition-transform duration-300 ease-in-out ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'} flex items-center justify-center overflow-y-auto`}>
        <button onClick={closeDrawer} className="absolute top-6 right-6 text-white hover:text-gray-300 text-4xl font-bold z-[80]">&times;</button>

        <div className="w-full px-4 flex justify-center py-8 relative">
          <div className="w-[520px] h-[520px] flex-shrink-0 rounded-full bg-brand-orange flex flex-col justify-center items-center px-12 text-center shadow-[0_0_40px_rgba(227,56,39,0.4)]">
            {isSubmitted ? (
              <div className="flex flex-col items-center justify-center space-y-4 animate-fade-in-up">
                <svg className="success-checkmark mb-2 shadow-lg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                  <circle className="success-checkmark__circle" cx="26" cy="26" r="25" fill="none" />
                  <path className="success-checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                </svg>
                <h2 className="text-[34px] font-extrabold text-white text-center leading-tight tracking-tight">Thank You!</h2>
                <p className="text-white font-semibold text-lg text-center opacity-90 px-4">
                  Our counsellor will connect with you soon.
                </p>
              </div>
            ) : (
              <>
                <h2 className="text-[34px] font-extrabold text-white mb-1 leading-tight tracking-tight mt-4">Get FREE Expert<br />Counselling</h2>
                <p className="text-white font-semibold mb-5 text-base">Book your session now !</p>

                <form className="w-full max-w-[320px] space-y-2.5 mx-auto" onSubmit={handleCounsellingSubmit}>
                  <input type="text" placeholder="Name" value={counsellingForm.name} onChange={(e) => setCounsellingForm({ ...counsellingForm, name: e.target.value })} className="w-full px-4 py-2.5 rounded text-gray-900 bg-white border-0 outline-none focus:ring-2 focus:ring-blue-900 text-sm" required />
                  <input type="email" placeholder="Enter Email" value={counsellingForm.email} onChange={(e) => setCounsellingForm({ ...counsellingForm, email: e.target.value })} className="w-full px-4 py-2.5 rounded text-gray-900 bg-white border-0 outline-none focus:ring-2 focus:ring-blue-900 text-sm" required />

                  <div className="flex">
                    <span className="bg-gray-100 text-gray-700 px-3 py-2.5 rounded-l border-r border-gray-200 font-medium text-sm">+91</span>
                    <input type="tel" placeholder="Mobile Number" value={counsellingForm.mobile} onChange={(e) => setCounsellingForm({ ...counsellingForm, mobile: e.target.value })} className="w-full px-4 py-2.5 rounded-r text-gray-900 bg-white border-0 outline-none focus:ring-2 focus:ring-blue-900 text-sm" required />
                  </div>

                  <div className="flex items-start text-left mt-2.5 mb-3">
                    <input type="checkbox" id="authorize" className="mt-0.5 mr-2 rounded border-gray-300 w-3 h-3 flex-shrink-0" required />
                    <label htmlFor="authorize" className="text-white text-[10.5px] leading-tight opacity-90">
                      I authorize Geeta University to contact me with updates and notifications via Email, SMS, WhatsApp & Call. Overrides DND/NDNC.
                    </label>
                  </div>

                  <button type="submit" disabled={isSubmitting} className={`w-full font-bold py-3 px-4 rounded transition-colors shadow-lg text-sm mb-4 ${isSubmitting ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-brand-blue hover:bg-brand-blue/90 text-white'}`}>
                    {isSubmitting ? 'Submitting...' : 'I want to hear!'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
