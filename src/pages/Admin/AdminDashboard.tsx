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
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen container-custom py-12">

            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
                    <p className="text-gray-400">Manage your tournaments and player data.</p>
                </div>
                <Link to="/admin/create" className="btn-primary shadow-lg shadow-indigo-500/30">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create New Tournament
                </Link>
            </header>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <StatCard
                    title="Total Tournaments"
                    value={stats.total}
                    icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />}
                    color="indigo"
                />
                <StatCard
                    title="Active / Open"
                    value={stats.open}
                    icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />}
                    color="emerald"
                />
                <StatCard
                    title="Closed / Past"
                    value={stats.closed}
                    icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />}
                    color="gray" // Changed to gray for closed
                />
            </div>

            {/* Content Area */}
            <div className="glass-panel rounded-3xl p-8 border border-white/5">
                <h2 className="text-2xl font-bold text-white mb-8 border-b border-white/10 pb-4">All Tournaments</h2>

                {tournaments.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-medium text-white mb-2">No tournaments found</h3>
                        <p className="text-gray-400 mb-6">Get started by creating your first tournament.</p>
                        <Link to="/admin/create" className="btn-primary inline-flex">
                            Create Tournament
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

// Helper Stat Card
const StatCard = ({ title, value, icon, color }: { title: string, value: number, icon: React.ReactNode, color: string }) => (
    <div className={`p-6 rounded-2xl glass-panel relative overflow-hidden group`}>
        <div className={`absolute top-0 right-0 w-24 h-24 bg-${color}-500/10 rounded-full blur-2xl transform translate-x-10 -translate-y-10`} />

        <div className="flex items-center justify-between relative z-10">
            <div>
                <p className="text-sm font-medium text-gray-400 mb-1 uppercase tracking-wider">{title}</p>
                <p className="text-3xl font-bold text-white">{value}</p>
            </div>
            <div className={`p-3 rounded-xl bg-${color}-500/20 text-${color}-400`}>
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {icon}
                </svg>
            </div>
        </div>
    </div>
);

export default AdminDashboard;
