import { useState, useEffect } from 'react';
import { supabase, type Tournament } from '../../services/supabaseClient';
import TournamentCard from '../../components/TournamentCard';

const HomePage = () => {
    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterSport, setFilterSport] = useState('all');

    useEffect(() => {
        fetchTournaments();
    }, []);

    const fetchTournaments = async () => {
        try {
            const { data, error } = await supabase
                .from('tournaments')
                .select('*')
                .order('date', { ascending: true });

            if (error) throw error;
            setTournaments(data || []);
        } catch (error) {
            console.error('Error fetching tournaments:', error);
        } finally {
            setLoading(false);
        }
    };

    // Get unique sports for filter
    const sports = ['all', ...new Set(tournaments.map((t) => t.sport))];

    // Filter tournaments
    const filteredTournaments = tournaments.filter((tournament) => {
        const matchesSearch = tournament.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tournament.sport.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesSport = filterSport === 'all' || tournament.sport === filterSport;
        return matchesSearch && matchesSport;
    });

    // Separate open and closed tournaments
    const openTournaments = filteredTournaments.filter(
        (t) => t.status === 'open' && new Date(t.registration_deadline) > new Date()
    );
    const closedTournaments = filteredTournaments.filter(
        (t) => t.status === 'closed' || new Date(t.registration_deadline) <= new Date()
    );

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
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
                        College Sports Tournaments
                    </h1>
                    <p className="text-xl text-white/90 max-w-2xl mx-auto">
                        Join exciting sports tournaments and compete with the best athletes from colleges across the region
                    </p>
                </div>

                {/* Search and Filter */}
                <div className="card max-w-4xl mx-auto mb-8">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="label">Search Tournaments</label>
                            <input
                                type="text"
                                placeholder="Search by name or sport..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="input-field"
                            />
                        </div>
                        <div>
                            <label className="label">Filter by Sport</label>
                            <select
                                value={filterSport}
                                onChange={(e) => setFilterSport(e.target.value)}
                                className="input-field"
                            >
                                {sports.map((sport) => (
                                    <option key={sport} value={sport}>
                                        {sport === 'all' ? 'All Sports' : sport}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Open Tournaments */}
                {openTournaments.length > 0 && (
                    <div className="mb-12">
                        <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                            <span className="bg-green-500 w-3 h-3 rounded-full mr-3 animate-pulse"></span>
                            Open for Registration
                        </h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {openTournaments.map((tournament) => (
                                <TournamentCard key={tournament.id} tournament={tournament} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Closed Tournaments */}
                {closedTournaments.length > 0 && (
                    <div className="mb-12">
                        <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                            <span className="bg-red-500 w-3 h-3 rounded-full mr-3"></span>
                            Closed / Past Tournaments
                        </h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-75">
                            {closedTournaments.map((tournament) => (
                                <TournamentCard key={tournament.id} tournament={tournament} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {filteredTournaments.length === 0 && (
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
                                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No tournaments found</h3>
                        <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomePage;
