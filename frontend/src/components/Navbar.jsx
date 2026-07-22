import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-3">
              {/* Dummy Logo Placeholder styled like Geeta University */}
              <div className="flex items-center justify-center w-12 h-14 bg-brand-blue text-white font-bold rounded-b-xl rounded-t-sm shadow-md">
                G
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black text-brand-orange leading-tight tracking-tight">
                  UNIVERSITY
                </span>
                <span className="text-[10px] text-gray-500 font-semibold tracking-widest uppercase">
                  Assessment Portal
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
