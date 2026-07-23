import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavClick = (id) => {
    if (id === 'home') {
      if (location.pathname !== '/') {
        navigate('/');
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="bg-white sticky top-0 z-50 shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-12 bg-brand-blue text-white font-bold text-2xl rounded-b-xl rounded-t-sm shadow-md">
                G
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black text-brand-orange leading-tight tracking-tight">
                  GEETA UNIVERSITY
                </span>
                <span className="text-[10px] text-gray-500 font-semibold tracking-widest uppercase">
                  Assessment Portal
                </span>
              </div>
            </Link>
          </div>
          
          <div className="hidden md:flex space-x-8 items-center">
            <button onClick={() => handleNavClick('home')} className="text-gray-900 font-medium hover:text-brand-orange transition-colors">Home</button>
            <button onClick={() => handleNavClick('about')} className="text-gray-600 font-medium hover:text-brand-orange transition-colors">About</button>
            <button onClick={() => handleNavClick('how-it-works')} className="text-gray-600 font-medium hover:text-brand-orange transition-colors">How It Works</button>
            <button onClick={() => handleNavClick('careers')} className="text-gray-600 font-medium hover:text-brand-orange transition-colors">Careers</button>
            <button onClick={() => handleNavClick('testimonials')} className="text-gray-600 font-medium hover:text-brand-orange transition-colors">Testimonials</button>
            <button onClick={() => handleNavClick('contact')} className="text-gray-600 font-medium hover:text-brand-orange transition-colors">Contact</button>
          </div>

          <div className="hidden md:flex items-center">
            <button 
              onClick={() => handleNavClick('assessments')} 
              className="bg-brand-orange hover:bg-brand-orange/90 text-white font-semibold py-2.5 px-6 rounded-full transition-colors shadow-md hover:shadow-lg"
            >
              Start Assessment
            </button>
          </div>
          
          <div className="md:hidden flex items-center">
             <button className="text-gray-600 hover:text-gray-900 focus:outline-none">
               <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
               </svg>
             </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
