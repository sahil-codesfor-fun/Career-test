import React, { useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    if (!isAdmin) {
      navigate('/adminportal');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate('/adminportal');
  };

  const menuItems = [
    { path: '/adminportal/users', label: 'Users' },
    { path: '/adminportal/add-test', label: 'Add Test' },
    { path: '/adminportal/live-tests', label: 'Live Tests' }
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-brand-blue text-white shadow-lg">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-brand-orange">Admin Panel</h2>
        </div>
        <nav className="mt-6">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block px-6 py-3 transition-colors ${
                location.pathname === item.path
                  ? 'bg-blue-900 border-l-4 border-brand-orange'
                  : 'hover:bg-blue-800'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 w-64 p-4 border-t border-blue-900">
          <button 
            onClick={handleLogout}
            className="w-full text-left px-2 py-2 text-gray-300 hover:text-white transition-colors"
          >
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
