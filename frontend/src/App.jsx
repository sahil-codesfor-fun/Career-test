import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ContactForm from './pages/ContactForm';
import Quiz from './pages/Quiz';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import Users from './pages/admin/Users';
import AddTest from './pages/admin/AddTest';
import LiveTests from './pages/admin/LiveTests';
import CounsellingRequests from './pages/admin/CounsellingRequests';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Routes>
          {/* Admin Routes without Navbar */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/*" element={<AdminLayout />}>
            <Route path="users" element={<Users />} />
            <Route path="counselling" element={<CounsellingRequests />} />
            <Route path="add-test" element={<AddTest />} />
            <Route path="live-tests" element={<LiveTests />} />
          </Route>

          {/* Public Routes with Navbar */}
          <Route path="/*" element={
            <>
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/register/:testId" element={<ContactForm />} />
                  <Route path="/quiz/:testId" element={<Quiz />} />
                </Routes>
              </main>
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
