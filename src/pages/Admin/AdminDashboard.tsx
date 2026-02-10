import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase, type Tournament } from '../../services/supabaseClient';
import TournamentCard from '../../components/TournamentCard';

const AdminDashboard = () => {
    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        open: 0,
        closed: 0,
    });

    useEffect(() => {
        fetchTournaments();
    }, []);

    const fetchTournaments = async () => {
        try {
            const { data, error } = await supabase
                .from('tournaments')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            setTournaments(data || []);

            // Calculate stats
            const total = data?.length || 0;
            const open = data?.filter(t => t.status === 'open' && new Date(t.registration_deadline) > new Date()).length || 0;
            const closed = total - open;

            setStats({ total, open, closed });
        } catch (error) {
            console.error('Error fetching tournaments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this tournament? This will also delete all registrations.')) {
            return;
        }

        try {
            const { error } = await supabase.from('tournaments').delete().eq('id', id);

            if (error) throw error;

            alert('Tournament deleted successfully');
            fetchTournaments();
        } catch (error) {
            console.error('Error deleting tournament:', error);
            alert('Failed to delete tournament');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">Admin Dashboard</h1>
                    <p className="text-xl text-white/90">Manage tournaments and view registrations</p>
                </div>

                {/* Stats Cards */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="card bg-gradient-to-br from-primary-500 to-primary-700 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-primary-100 text-sm font-medium">Total Tournaments</p>
                                <p className="text-4xl font-bold mt-2">{stats.total}</p>
                            </div>
                            <svg className="w-16 h-16 text-primary-200" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>

                    <div className="card bg-gradient-to-br from-green-500 to-green-700 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100 text-sm font-medium">Open for Registration</p>
                                <p className="text-4xl font-bold mt-2">{stats.open}</p>
                            </div>
                            <svg className="w-16 h-16 text-green-200" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>

                    <div className="card bg-gradient-to-br from-red-500 to-red-700 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-red-100 text-sm font-medium">Closed Tournaments</p>
                                <p className="text-4xl font-bold mt-2">{stats.closed}</p>
                            </div>
                            <svg className="w-16 h-16 text-red-200" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Create Button */}
                <div className="mb-8">
                    <Link to="/admin/create" className="btn-primary inline-flex items-center text-lg">
                        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Create New Tournament
                    </Link>
                </div>

                {/* Tournaments List */}
                {tournaments.length === 0 ? (
                    <div className="card text-center py-12">
                        <svg
                            className="w-24 h-24 mx-auto text-gray-400 mb-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                            />
                        </svg>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No tournaments yet</h3>
                        <p className="text-gray-600 mb-6">Get started by creating your first tournament</p>
                        <Link to="/admin/create" className="btn-primary inline-block">
                            Create Tournament
                        </Link>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tournaments.map((tournament) => (
                            <TournamentCard
                                key={tournament.id}
                                tournament={tournament}
                                showActions
                                onEdit={() => window.location.href = `/admin/edit/${tournament.id}`}
                                onDelete={() => handleDelete(tournament.id)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
