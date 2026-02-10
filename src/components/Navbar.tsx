import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const isAdminPath = location.pathname.startsWith('/admin');
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isAdminAuth, setIsAdminAuth] = useState(false);

    // Check auth status
    useEffect(() => {
        const authStatus = localStorage.getItem('isAdminAuthenticated') === 'true';
        setIsAdminAuth(authStatus);
    }, [location]);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location]);

    const handleLogout = () => {
        localStorage.removeItem('isAdminAuthenticated');
        setIsAdminAuth(false);
        navigate('/');
    };

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass py-3 border-b-0 shadow-lg' : 'bg-transparent py-5'
                }`}
        >
            <div className="container-custom flex items-center justify-between">
                {/* Logo Area */}
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="relative w-10 h-10 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg group-hover:shadow-indigo-500/50 transition-all duration-300 transform group-hover:scale-110">
                        <svg
                            className="w-6 h-6 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <span className="text-xl font-bold text-white tracking-tight">
                        Campus<span className="text-indigo-400">Sports</span>
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
                    {isAdminPath && isAdminAuth ? (
                        <>
                            <NavLink to="/admin">Dashboard</NavLink>
                            <NavLink to="/admin/create">Create Tournament</NavLink>
                            <Link to="/" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                                Public View
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="text-sm font-semibold text-red-400 hover:text-red-300 transition-colors"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <NavLink to="/">Tournaments</NavLink>
                            <NavLink to="/my-registrations">My Registrations</NavLink>
                            <Link
                                to={isAdminAuth ? "/admin" : "/admin/login"}
                                className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-semibold backdrop-blur-md transition-all border border-white/10 hover:border-white/20"
                            >
                                {isAdminAuth ? "Admin Dashboard" : "Admin Panel"}
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="md:hidden p-2 text-gray-300 hover:text-white transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {mobileMenuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <div
                className={`md:hidden fixed inset-0 bg-gray-900/95 backdrop-blur-xl z-40 transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
                style={{ top: '0', paddingTop: '80px' }}
            >
                <div className="flex flex-col items-center gap-8 p-8">
                    {isAdminPath && isAdminAuth ? (
                        <>
                            <MobileNavLink to="/admin" onClick={() => setMobileMenuOpen(false)}>Dashboard</MobileNavLink>
                            <MobileNavLink to="/admin/create" onClick={() => setMobileMenuOpen(false)}>Create Tournament</MobileNavLink>
                            <MobileNavLink to="/" onClick={() => setMobileMenuOpen(false)}>Public View</MobileNavLink>
                            <button
                                onClick={handleLogout}
                                className="text-2xl font-semibold text-red-400"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <MobileNavLink to="/" onClick={() => setMobileMenuOpen(false)}>Tournaments</MobileNavLink>
                            <MobileNavLink to="/my-registrations" onClick={() => setMobileMenuOpen(false)}>My Registrations</MobileNavLink>
                            <Link
                                to={isAdminAuth ? "/admin" : "/admin/login"}
                                className="w-full text-center px-6 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg shadow-lg"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {isAdminAuth ? "Admin Dashboard" : "Admin Panel"}
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

// Helper Components
const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
    <Link
        to={to}
        className="relative text-sm font-medium text-gray-300 hover:text-white transition-colors py-2 group"
    >
        {children}
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-500 transition-all duration-300 group-hover:w-full" />
    </Link>
);

const MobileNavLink = ({ to, children, onClick }: { to: string; children: React.ReactNode; onClick: () => void }) => (
    <Link
        to={to}
        onClick={onClick}
        className="text-2xl font-semibold text-white hover:text-indigo-400 transition-colors"
    >
        {children}
    </Link>
);

export default Navbar;
