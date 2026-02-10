import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        // The specific credentials requested by the user
        if (username === 'bvricesports2026' && password === 'bvricesports2026') {
            localStorage.setItem('isAdminAuthenticated', 'true');
            navigate('/admin');
        } else {
            setError('Invalid admin credentials. Please try again.');
        }
    };

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-10 space-y-2">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-500/10 rounded-2xl mb-4 border border-indigo-500/20">
                        <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Admin Access</h1>
                    <p className="text-gray-400">Enter your special credentials to continue</p>
                </div>

                <div className="glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
                    {/* Subtle glow */}
                    <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-[50px] -translate-x-1/2 -translate-y-1/2" />

                    <form onSubmit={handleLogin} className="space-y-6 relative z-10">
                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl text-center">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400 ml-1">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-gray-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder-gray-600"
                                placeholder="bvricesports2026"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400 ml-1">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-gray-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder-gray-600"
                                placeholder="••••••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full btn-primary py-4 text-lg font-bold shadow-lg shadow-indigo-500/20 active:scale-95"
                        >
                            Unlock Dashboard
                        </button>
                    </form>
                </div>

                <div className="text-center mt-8">
                    <button
                        onClick={() => navigate('/')}
                        className="text-gray-500 hover:text-white text-sm font-medium transition-colors"
                    >
                        ← Back to Public View
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
