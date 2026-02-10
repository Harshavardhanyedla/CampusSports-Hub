import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase, type Tournament } from '../../services/supabaseClient';
import { format } from 'date-fns';

const TournamentDetail = () => {
    const { id } = useParams();
    const [tournament, setTournament] = useState<Tournament | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) fetchTournament();
    }, [id]);

    const fetchTournament = async () => {
        try {
            const { data, error } = await supabase
                .from('tournaments')
                .select('*')
                .eq('id', id)
                .single();
            if (error) throw error;
            setTournament(data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
    );

    if (!tournament) return <div className="text-center py-20 text-white">Tournament not found</div>;

    const isExpired = new Date(tournament.registration_deadline) < new Date();
    const isClosed = tournament.status === 'closed';
    const canRegister = !isClosed && !isExpired;

    return (
        <div className="min-h-screen pb-20">

            {/* Hero Header */}
            <div className="relative h-[40vh] min-h-[400px] w-full -mt-20 overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br from-indigo-900 to-purple-900 animate-gradient-x`} />
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

                <div className="container-custom relative h-full flex flex-col justify-end pb-12 z-10">
                    <Link to="/" className="inline-flex items-center text-indigo-300 hover:text-white mb-6 transition-colors group">
                        <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        Back to Tournaments
                    </Link>

                    <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-sm font-medium text-indigo-200">
                            {tournament.sport}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wider border ${isClosed ? 'bg-red-500/20 text-red-300 border-red-500/30' :
                                isExpired ? 'bg-orange-500/20 text-orange-300 border-orange-500/30' :
                                    'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            }`}>
                            {isClosed ? 'Closed' : isExpired ? 'Registration ended' : 'Open'}
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
                        {tournament.title}
                    </h1>
                </div>
            </div>

            {/* Content Grid */}
            <div className="container-custom -mt-8 relative z-20 grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Details */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="glass-panel p-8 rounded-3xl">
                        <h2 className="text-2xl font-bold text-white mb-4">About the Tournament</h2>
                        <p className="text-gray-300 leading-relaxed text-lg whitespace-pre-wrap">
                            {tournament.description || "No description provided."}
                        </p>
                    </div>

                    <div className="glass-panel p-8 rounded-3xl">
                        <h2 className="text-2xl font-bold text-white mb-6">Event Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <DetailItem
                                icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />}
                                label="Date & Time"
                                value={format(new Date(tournament.date), 'MMMM dd, yyyy • h:mm a')}
                            />
                            <DetailItem
                                icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />}
                                label="Venue"
                                value={tournament.venue}
                            />
                            <DetailItem
                                icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />}
                                label="Format"
                                value={`${tournament.team_size === 'team' ? 'Team Event' : 'Individual Event'}`}
                            />
                            <DetailItem
                                icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />}
                                label="Registration Deadline"
                                value={format(new Date(tournament.registration_deadline), 'MMM dd, yyyy • h:mm a')}
                            />
                        </div>
                    </div>
                </div>

                {/* Right Column: CTA */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 glass p-6 rounded-3xl border border-indigo-500/30 shadow-xl shadow-indigo-900/20">
                        <h3 className="text-xl font-bold text-white mb-2">Ready to Compete?</h3>
                        <p className="text-gray-400 text-sm mb-6">
                            Secure your spot before the deadline. Slots are limited!
                        </p>

                        {canRegister ? (
                            <Link
                                to={`/register/${tournament.id}`}
                                className="w-full btn-primary py-4 text-lg justify-center shadow-lg shadow-indigo-500/40 animate-pulse-glow"
                            >
                                Register Now
                            </Link>
                        ) : (
                            <button
                                disabled
                                className="w-full py-4 bg-gray-700 text-gray-400 font-bold rounded-xl cursor-not-allowed border border-white/5"
                            >
                                Registration Closed
                            </button>
                        )}

                        <div className="mt-6 pt-6 border-t border-white/10 text-center">
                            <p className="text-xs text-gray-500">
                                Create an account to track your stats and get updates on future tournaments.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

// Helper for detail items
const DetailItem = ({ icon, label, value }: { icon: any, label: string, value: string }) => (
    <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
        <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {icon}
            </svg>
        </div>
        <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">{label}</p>
            <p className="text-white font-semibold">{value}</p>
        </div>
    </div>
);

export default TournamentDetail;
