import { useState, useEffect } from 'react';
import type { Tournament } from '../../services/supabaseClient'; // Adjusted import to use type-only
import { supabase } from '../../services/supabaseClient';
import TournamentCard from '../../components/TournamentCard';

const HomePage = () => {
    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSport, setSelectedSport] = useState('All');
    const [activeTab, setActiveTab] = useState<'open' | 'closed'>('open');

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

    // Filter Logic
    const filteredTournaments = tournaments.filter((t) => {
        const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.sport.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSport = selectedSport === 'All' || t.sport === selectedSport;

        // Status Logic
        const isExpired = new Date(t.registration_deadline) < new Date();
        const isClosed = t.status === 'closed';
        const isOpen = !isClosed && !isExpired;

        const matchesTab = activeTab === 'open' ? isOpen : (isClosed || isExpired);

        return matchesSearch && matchesSport && matchesTab;
    });

    // Get unique sports for filter pills
    const sports = ['All', ...new Set(tournaments.map(t => t.sport))];

    return (
        <div className="min-h-screen pt-24 md:pt-32 pb-12">

            {/* Hero Section */}
            <section className="relative container-custom mb-16 overflow-hidden sm:pt-16">
                <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-purple-600/30 rounded-full blur-[128px] animate-pulse-glow" />
                <div className="absolute bottom-0 left-0 -z-10 w-96 h-96 bg-indigo-600/30 rounded-full blur-[128px] animate-pulse-glow" style={{ animationDelay: '1s' }} />

                <div className="text-center max-w-3xl mx-auto space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium animate-slide-up">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                        </span>
                        Registration Open for Spring 2026
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        Unleash Your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 animate-gradient-x">
                            Inner Champion
                        </span>
                    </h1>

                    <p className="text-xl text-gray-400 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        Join the ultimate campus sports league. Compete, connect, and conquer in tournaments designed for legends.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                        <button
                            onClick={() => document.getElementById('tournaments-grid')?.scrollIntoView({ behavior: 'smooth' })}
                            className="btn-primary"
                        >
                            Explore Tournaments
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                        </button>
                        <button className="btn-glass backdrop-blur-md">
                            View Leaderboard
                        </button>
                    </div>
                </div>
            </section>

            {/* Main Content Area */}
            <div id="tournaments-grid" className="container-custom">

                {/* Controls Bar */}
                <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-16 glass-panel p-4 rounded-3xl md:sticky md:top-24 z-30">

                    {/* Tabs */}
                    <div className="flex p-1 bg-gray-900/50 rounded-xl">
                        <button
                            onClick={() => setActiveTab('open')}
                            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'open'
                                ? 'bg-indigo-600 text-white shadow-lg'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            Open Now
                        </button>
                        <button
                            onClick={() => setActiveTab('closed')}
                            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'closed'
                                ? 'bg-indigo-600 text-white shadow-lg'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            Past / Closed
                        </button>
                    </div>

                    {/* Search */}
                    <div className="relative w-full lg:max-w-md group">
                        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-indigo-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search tournaments..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-900/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                        />
                    </div>
                </div>

                {/* Sport Filters (Pills) */}
                <div className="flex flex-wrap gap-3 mb-12 justify-center">
                    {sports.map((sport) => (
                        <button
                            key={sport}
                            onClick={() => setSelectedSport(sport)}
                            className={`px-5 py-2 rounded-full text-sm font-medium border transition-all duration-300 transform hover:scale-105 ${selectedSport === sport
                                ? 'bg-white text-gray-900 border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]'
                                : 'bg-transparent text-gray-400 border-white/10 hover:border-white/30 hover:text-white'
                                }`}
                        >
                            {sport}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="relative w-20 h-20">
                            <div className="absolute inset-0 border-4 border-indigo-500/30 rounded-full animate-ping"></div>
                            <div className="absolute inset-0 border-4 border-t-indigo-500 rounded-full animate-spin"></div>
                        </div>
                    </div>
                ) : filteredTournaments.length === 0 ? (
                    <div className="text-center py-20 glass-panel rounded-3xl mx-auto max-w-2xl">
                        <div className="bg-gray-800/50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">No tournaments found</h3>
                        <p className="text-gray-400">Try adjusting your filters or search terms.</p>
                        <button
                            onClick={() => { setSearchTerm(''); setSelectedSport('All'); }}
                            className="mt-6 text-indigo-400 hover:text-indigo-300 font-semibold"
                        >
                            Clear all filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredTournaments.map((tournament) => (
                            <TournamentCard key={tournament.id} tournament={tournament} />
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
};

export default HomePage;
