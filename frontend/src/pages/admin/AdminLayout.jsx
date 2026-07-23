import React, { useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const isAuth = localStorage.getItem('isAdminAuth');
    if (!isAuth) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuth');
    navigate('/admin');
  };

  const menuItems = [
    { path: '/admin/users', label: 'Users' },
    { path: '/admin/counselling', label: 'Counselling Requests' },
    { path: '/admin/add-test', label: 'Add Test' },
    { path: '/admin/live-tests', label: 'Live Tests' }
  ];

  return (
    <div className="h-screen w-full flex overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-brand-blue text-white shadow-lg flex flex-col">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-brand-orange">Admin Panel</h2>
        </div>
        <nav className="mt-6 flex-1 overflow-y-auto">
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
        <div className="mt-auto p-4 border-t border-blue-900">
          <button 
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition-colors shadow-sm"
          >
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto h-full">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
