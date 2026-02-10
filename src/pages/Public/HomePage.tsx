import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Tournament } from '../../services/supabaseClient'; // Adjusted import to use type-only
import { supabase } from '../../services/supabaseClient';
import TournamentCard from '../../components/TournamentCard';

const HomePage = () => {
    const navigate = useNavigate();
    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [loading, setLoading] = useState(true);


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
    const filteredTournaments = tournaments;



    return (
        <div className="min-h-screen pt-24 md:pt-32 pb-12">

            {/* Hero Section - Maximum Spacing */}
            <section className="relative container-custom pt-20 pb-40 md:pt-32 md:pb-64 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-5xl -z-10 opacity-40">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse-glow" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: '1.5s' }} />
                </div>

                <div className="text-center max-w-4xl mx-auto">
                    <div className="flex justify-center mb-8">
                        <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-indigo-300 text-xs font-bold tracking-[0.2em] uppercase backdrop-blur-sm">
                            The Future of Campus Athletics
                        </span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black tracking-tight text-white mb-8 leading-[0.95]">
                        UNLEASH YOUR<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 italic">
                            INNER CHAMPION
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
                        Experience the heat of competition. Join the ultimate league where campus legends are born and records are shattered.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <button
                            onClick={() => document.getElementById('tournaments-grid')?.scrollIntoView({ behavior: 'smooth' })}
                            className="btn-primary px-8 py-4 text-lg shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)] active:scale-95"
                        >
                            Explore Tournaments
                            <svg className="w-5 h-5 group-hover:translate-y-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                        </button>
                        <button
                            onClick={() => navigate('/leaderboard')}
                            className="px-8 py-4 text-lg font-bold text-white bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all backdrop-blur-md active:scale-95"
                        >
                            View Leaderboard
                        </button>
                    </div>
                </div>
            </section>

            {/* Main Content Area - Clean Break */}
            <div id="tournaments-grid" className="container-custom pt-40 md:pt-56 pb-24 relative z-10">
                <div className="flex flex-col items-center mb-20 text-center mt-12 md:mt-24">
                    <span className="text-indigo-500 font-bold tracking-widest uppercase text-xs mb-3">Live Events</span>
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Upcoming Tournaments</h2>
                    <div className="w-24 h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
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
                        <p className="text-gray-400">Please check back later for new events.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-32">
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
