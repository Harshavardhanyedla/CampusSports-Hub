import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/Public/HomePage';
import TournamentDetail from './pages/Public/TournamentDetail';
import Register from './pages/Public/Register';
import MyRegistrations from './pages/Public/MyRegistrations';
import AdminDashboard from './pages/Admin/AdminDashboard';
import CreateTournament from './pages/Admin/CreateTournament';
import EditTournament from './pages/Admin/EditTournament';
import ViewRegistrations from './pages/Admin/ViewRegistrations';

function App() {
  return (
    <Router>
      <div className="relative min-h-screen flex flex-col">
        {/* Background Gradients (Global) */}
        <div className="fixed inset-0 z-[-1] pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 blur-[120px]" />
        </div>

        <Navbar />

        <main className="flex-grow pt-20 px-4">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/tournament/:id" element={<TournamentDetail />} />
            <Route path="/register/:id" element={<Register />} />
            <Route path="/my-registrations" element={<MyRegistrations />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/create" element={<CreateTournament />} />
            <Route path="/admin/edit/:id" element={<EditTournament />} />
            <Route path="/admin/registrations/:id" element={<ViewRegistrations />} />
          </Routes>
        </main>

        <footer className="mt-20 py-8 border-t border-white/5 backdrop-blur-sm">
          <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} CampusSports Hub. Built for Champions.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
