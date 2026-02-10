import { useState } from 'react';
import { supabase, type Tournament, type Registration } from '../../services/supabaseClient';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

interface RegistrationWithTournament extends Registration {
    tournaments: Tournament;
}

const MyRegistrations = () => {
    const [email, setEmail] = useState('');
    const [registrations, setRegistrations] = useState<RegistrationWithTournament[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const fetchRegistrations = async () => {
        if (!email) return;
        setLoading(true);
        setSearched(true);

        try {
            const { data, error } = await supabase
                .from('registrations')
                .select('*, tournaments(*)')
                .eq('email', email)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setRegistrations(data as any || []);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen container-custom py-12">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold text-white mb-2">My Registrations</h1>
                <p className="text-gray-400">Track your tournament entries and status.</p>
            </div>

            {/* Search Box */}
            <div className="max-w-md mx-auto mb-12">
                <div className="glass-panel p-2 rounded-2xl flex items-center shadow-lg shadow-indigo-500/10">
                    <input
                        type="email"
                        placeholder="Enter your email address..."
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && fetchRegistrations()}
                        className="flex-1 bg-transparent border-none text-white placeholder-gray-500 px-4 py-3 focus:outline-none"
                    />
                    <button
                        onClick={fetchRegistrations}
                        disabled={loading}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white p-3 rounded-xl transition-colors"
                    >
                        {loading ? (
                            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                        ) : (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Results */}
            {searched && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {registrations.length === 0 ? (
                        <div className="col-span-full text-center py-20 text-gray-500">
                            No registrations found for this email.
                        </div>
                    ) : (
                        registrations.map((reg) => (
                            <div key={reg.id} className="glass-panel p-6 rounded-3xl border border-white/5 hover:border-indigo-500/30 transition-all group">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-lg text-xs font-bold uppercase tracking-wider">
                                        {reg.tournaments.sport}
                                    </div>
                                    <span className="text-xs text-gray-500">
                                        Registered on {format(new Date(reg.created_at), 'MMM dd')}
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">
                                    {reg.tournaments.title}
                                </h3>

                                <div className="space-y-2 mt-4 text-sm text-gray-400">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        {format(new Date(reg.tournaments.date), 'MMMM dd, yyyy')}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        {reg.tournaments.venue}
                                    </div>
                                </div>

                                <div className="mt-6 pt-4 border-t border-white/5">
                                    <Link
                                        to={`/tournament/${reg.tournament_id}`}
                                        className="block w-full text-center py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors"
                                    >
                                        View Tournament
                                    </Link>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default MyRegistrations;
