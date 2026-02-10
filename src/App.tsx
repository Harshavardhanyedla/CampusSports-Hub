import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';

// Public Pages
import HomePage from './pages/Public/HomePage';
import TournamentDetail from './pages/Public/TournamentDetail';
import Register from './pages/Public/Register';
import MyRegistrations from './pages/Public/MyRegistrations';

// Admin Pages
import AdminDashboard from './pages/Admin/AdminDashboard';
import CreateTournament from './pages/Admin/CreateTournament';
import EditTournament from './pages/Admin/EditTournament';
import ViewRegistrations from './pages/Admin/ViewRegistrations';

// Components
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/tournament/:id" element={<TournamentDetail />} />
          <Route path="/register/:id" element={<Register />} />
          <Route path="/my-registrations" element={<MyRegistrations />} />

          {/* Admin Routes - No auth protection for now */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/create" element={<CreateTournament />} />
          <Route path="/admin/edit/:id" element={<EditTournament />} />
          <Route path="/admin/registrations/:id" element={<ViewRegistrations />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
