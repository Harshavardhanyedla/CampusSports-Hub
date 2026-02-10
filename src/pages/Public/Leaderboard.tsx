import { useState, useEffect } from 'react';
import { supabase, type Tournament, type Leaderboard as LeaderboardType } from '../../services/supabaseClient';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

interface TournamentWithLeaderboard extends Tournament {
    leaderboard_entries: LeaderboardType[];
}

const PublicLeaderboard = () => {
    const [tournaments, setTournaments] = useState<TournamentWithLeaderboard[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLeaderboards();
    }, []);

    const fetchLeaderboards = async () => {
        try {
            // First get all tournaments
            const { data: tData, error: tErr } = await supabase
                .from('tournaments')
                .select('*')
                .order('date', { ascending: false });

            if (tErr) throw tErr;

            // Get all leaderboard entries
            const { data: lData, error: lErr } = await supabase
                .from('leaderboards')
                .select('*')
                .order('rank', { ascending: true });

            if (lErr) throw lErr;

            // Group leaderboards by tournament
            const enriched: TournamentWithLeaderboard[] = (tData || [])
                .map(t => ({
                    ...t,
                    leaderboard_entries: (lData || []).filter(l => l.tournament_id === t.id)
                }))
                .filter(t => t.leaderboard_entries.length > 0); // Only show those with rankings

            setTournaments(enriched);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-500"></div></div>;

    return (
        <div className="min-h-screen container-custom py-12">
            <header className="text-center mb-16">
                <h1 className="text-5xl font-extrabold text-white mb-4 animate-slide-up">Hall of Fame</h1>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    Celebrating the champions across every sport. Your legacy starts here.
                </p>
            </header>

            {tournaments.length === 0 ? (
                <div className="glass-panel p-20 text-center rounded-3xl border border-white/5 animate-slide-up">
                    <svg className="w-20 h-20 mx-auto mb-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                    <h3 className="text-2xl font-bold text-white mb-2">No results posted yet</h3>
                    <p className="text-gray-400">Winning moments are being recorded. Check back soon!</p>
                </div>
            ) : (
                <div className="space-y-12">
                    {tournaments.map((t, tIdx) => (
                        <div
                            key={t.id}
                            className="glass-panel p-8 md:p-12 rounded-[40px] border border-white/5 relative overflow-hidden animate-slide-up"
                            style={{ animationDelay: `${tIdx * 0.15}s` }}
                        >
                            {/* Decorative Blur */}
                            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

                            <div className="flex flex-col lg:flex-row gap-12 relative z-10">
                                {/* Tournament Info */}
                                <div className="lg:w-1/3 border-b lg:border-b-0 lg:border-r border-white/10 pb-8 lg:pb-0 lg:pr-12">
                                    <div className="px-4 py-1.5 bg-indigo-500/10 text-indigo-400 rounded-full text-xs font-bold uppercase tracking-widest border border-indigo-500/20 w-fit mb-6">
                                        {t.sport}
                                    </div>
                                    <h2 className="text-3xl font-bold text-white mb-4 leading-tight">{t.title}</h2>
                                    <div className="space-y-3 text-gray-400">
                                        <div className="flex items-center gap-3">
                                            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                            {format(new Date(t.date), 'MMMM dd, yyyy')}
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                            {t.venue}
                                        </div>
                                    </div>
                                    <Link
                                        to={`/tournament/${t.id}`}
                                        className="mt-8 inline-flex items-center gap-2 text-indigo-400 hover:text-white transition-colors group font-semibold"
                                    >
                                        Event Details
                                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                    </Link>
                                </div>

                                {/* Results Grid */}
                                <div className="lg:w-2/3">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {t.leaderboard_entries.slice(0, 3).map((entry) => (
                                            <div key={entry.id} className={`p-6 rounded-3xl border transition-all ${entry.rank === 1 ? 'bg-indigo-500/10 border-indigo-500/30 ring-1 ring-indigo-500/20' : 'bg-white/5 border-white/10'
                                                }`}>
                                                <div className="flex justify-between items-start mb-4">
                                                    <span className={`text-4xl font-black ${entry.rank === 1 ? 'text-yellow-500' :
                                                            entry.rank === 2 ? 'text-gray-400' :
                                                                'text-orange-500'
                                                        }`}>
                                                        #{entry.rank}
                                                    </span>
                                                    {entry.achievement && (
                                                        <span className="px-2 py-1 bg-white/10 rounded-lg text-[10px] font-bold text-white uppercase tracking-tighter">
                                                            {entry.achievement}
                                                        </span>
                                                    )}
                                                </div>
                                                <h4 className="text-xl font-bold text-white truncate">{entry.participant_name}</h4>
                                                <p className="text-sm text-gray-500 mt-1 font-mono uppercase tracking-widest">{entry.score || 'No score record'}</p>
                                            </div>
                                        ))}

                                        {/* Show more button or indicator if there are > 3 entries */}
                                        {t.leaderboard_entries.length > 3 && (
                                            <div className="p-6 rounded-3xl border border-dashed border-white/10 flex items-center justify-center text-gray-500 text-sm italic">
                                                + {t.leaderboard_entries.length - 3} more participants
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PublicLeaderboard;
