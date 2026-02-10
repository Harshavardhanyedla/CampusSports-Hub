import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/Public/HomePage';
import TournamentDetail from './pages/Public/TournamentDetail';
import Register from './pages/Public/Register';
import MyRegistrations from './pages/Public/MyRegistrations';
import AdminDashboard from './pages/Admin/AdminDashboard';
import CreateTournament from './pages/Admin/CreateTournament';
import EditTournament from './pages/Admin/EditTournament';
import ViewRegistrations from './pages/Admin/ViewRegistrations';
import ManageLeaderboard from './pages/Admin/ManageLeaderboard';
import PublicLeaderboard from './pages/Public/Leaderboard';
import AdminLogin from './pages/Admin/Login';
import { ModalProvider } from './context/ModalContext';

function App() {
  return (
    <ModalProvider>
      <Router>
        <div className="relative min-h-screen flex flex-col">
          {/* Background Gradients (Global) */}
          <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/5 blur-[100px] transform translate-z-0" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/5 blur-[100px] transform translate-z-0" />
          </div>

          <Navbar />

          <main className="flex-grow pt-20 px-4">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/tournament/:id" element={<TournamentDetail />} />
              <Route path="/register/:id" element={<Register />} />
              <Route path="/my-registrations" element={<MyRegistrations />} />
              <Route path="/leaderboard" element={<PublicLeaderboard />} />

              {/* Admin Login */}
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Protected Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/create" element={
                <ProtectedRoute>
                  <CreateTournament />
                </ProtectedRoute>
              } />
              <Route path="/admin/edit/:id" element={
                <ProtectedRoute>
                  <EditTournament />
                </ProtectedRoute>
              } />
              <Route path="/admin/registrations/:id" element={
                <ProtectedRoute>
                  <ViewRegistrations />
                </ProtectedRoute>
              } />
              <Route path="/admin/leaderboard/:id" element={
                <ProtectedRoute>
                  <ManageLeaderboard />
                </ProtectedRoute>
              } />
            </Routes>
          </main>

          <footer className="mt-20 py-8 border-t border-white/5 backdrop-blur-sm">
            <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
              <p>&copy; {new Date().getFullYear()} CampusSports Hub. Built for Champions.</p>
            </div>
          </footer>
        </div>
      </Router>
    </ModalProvider>
  );
}

export default App;
