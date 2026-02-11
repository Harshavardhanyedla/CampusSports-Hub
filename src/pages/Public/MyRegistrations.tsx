import { useState, useEffect, useCallback } from 'react';
import { supabase, type Tournament, type Registration } from '../../services/supabaseClient';
import { format } from 'date-fns';
import { Link, useLocation } from 'react-router-dom';
import { useModal } from '../../context/ModalContext';

interface RegistrationWithTournament extends Registration {
    tournaments: Tournament;
}

const MyRegistrations = () => {
    const location = useLocation();

    const { showAlert } = useModal();
    const [email, setEmail] = useState('');
    const [registrations, setRegistrations] = useState<RegistrationWithTournament[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const fetchRegistrations = useCallback(async (searchEmail: string) => {
        const trimmedEmail = searchEmail.trim().toLowerCase();
        if (!trimmedEmail) return;

        setLoading(true);
        setSearched(true);
        setRegistrations([]); // Clear previous results

        try {
            // Use .eq for exact match as we already normalized the data
            const { data, error } = await supabase
                .from('registrations')
                .select(`
                    *,
                    tournaments (*)
                `)
                .eq('email', trimmedEmail)
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Map data correctly just in case Supabase returns it differently
            const formattedData = (data as any[] || []).map(reg => ({
                ...reg,
                // Handle various join naming conventions just in case
                tournaments: reg.tournaments || reg.tournament || {}
            }));

            setRegistrations(formattedData as RegistrationWithTournament[]);
        } catch (error: any) {
            console.error('Error fetching registrations:', error);
            showAlert('Search Failed', 'Could not retrieve your registrations. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [showAlert]);

    // Handle initial load if email is passed or stored
    useEffect(() => {
        const state = location.state as { email?: string };
        const storedEmail = localStorage.getItem('last_registered_email');

        const emailToSearch = state?.email || storedEmail;

        if (emailToSearch) {
            setEmail(emailToSearch);
            fetchRegistrations(emailToSearch);
            // Save it back to localStorage to make it permanent
            localStorage.setItem('last_registered_email', emailToSearch);
        }
    }, [location.state, fetchRegistrations]);

    return (
        <div className="min-h-screen container-custom py-12">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold text-white mb-2 animate-slide-up">My Registrations</h1>
                <p className="text-gray-400 animate-slide-up" style={{ animationDelay: '0.1s' }}>Track your tournament entries and status.</p>
            </div>

            {/* Search Box */}
            <div className="max-w-md mx-auto mb-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <div className="glass-panel p-2 rounded-2xl flex items-center shadow-lg shadow-indigo-500/10 hover:border-indigo-500/30 transition-all group">
                    <input
                        type="email"
                        placeholder="Enter your email address..."
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && fetchRegistrations(email)}
                        className="flex-1 bg-transparent border-none text-white placeholder-gray-500 px-4 py-3 focus:outline-none"
                    />
                    <button
                        onClick={() => fetchRegistrations(email)}
                        disabled={loading}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white p-3 rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-95 disabled:opacity-50"
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
                        <div className="col-span-full text-center py-20 text-gray-500 glass-panel rounded-3xl animate-slide-up">
                            <svg className="w-16 h-16 mx-auto mb-4 text-gray-600 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="text-2xl font-bold text-white mb-2">No registrations found</h3>
                            <p className="text-gray-400">We couldn't find any entries for <span className="text-indigo-400 font-medium">{email}</span>.</p>
                            <p className="text-sm mt-4 text-gray-500 italic">Tip: Make sure you used the same email during registration.</p>
                        </div>
                    ) : (
                        registrations.map((reg, idx) => (
                            <div
                                key={reg.id}
                                className="glass-panel p-6 rounded-3xl border border-white/5 hover:border-indigo-500/30 transition-all group relative overflow-hidden animate-slide-up"
                                style={{ animationDelay: `${0.1 * idx}s` }}
                            >
                                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl transform translate-x-8 -translate-y-8" />

                                <div className="flex justify-between items-start mb-4 relative z-10">
                                    <div className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-lg text-xs font-bold uppercase tracking-wider border border-indigo-500/20">
                                        {reg.tournaments?.sport || 'Event'}
                                    </div>
                                    <span className="text-xs text-gray-500 font-medium">
                                        {format(new Date(reg.created_at), 'MMM dd, yyyy')}
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors relative z-10">
                                    {reg.tournaments?.title || 'Unknown Tournament'}
                                </h3>

                                <div className="space-y-3 mt-4 text-sm text-gray-400 relative z-10">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        {reg.tournaments?.date ? format(new Date(reg.tournaments.date), 'MMMM dd • h:mm a') : 'Date TBA'}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        {reg.tournaments?.venue || 'Venue TBA'}
                                    </div>
                                </div>

                                <div className="mt-6 pt-4 border-t border-white/5 relative z-10">
                                    <Link
                                        to={`/tournament/${reg.tournament_id}`}
                                        className="block w-full text-center py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold transition-all border border-white/5 hover:border-white/10"
                                    >
                                        Tournament Details
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
