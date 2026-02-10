import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
    const location = useLocation();
    const isAdminPath = location.pathname.startsWith('/admin');

    return (
        <nav className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-3">
                        <div className="bg-gradient-to-r from-primary-600 to-purple-600 p-2 rounded-lg">
                            <svg
                                className="w-8 h-8 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                                />
                            </svg>
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                            CampusSports Hub
                        </span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="flex items-center space-x-6">
                        {isAdminPath ? (
                            // Admin Navigation
                            <>
                                <Link
                                    to="/admin"
                                    className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    to="/admin/create"
                                    className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                                >
                                    Create Tournament
                                </Link>
                                <Link
                                    to="/"
                                    className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                                >
                                    Public View
                                </Link>
                            </>
                        ) : (
                            // Public Navigation
                            <>
                                <Link
                                    to="/"
                                    className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                                >
                                    Tournaments
                                </Link>
                                <Link
                                    to="/my-registrations"
                                    className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                                >
                                    My Registrations
                                </Link>
                                <Link
                                    to="/admin"
                                    className="btn-primary text-sm"
                                >
                                    Admin Panel
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
