import { useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import { format } from 'date-fns';

interface RegistrationWithTournament {
    id: string;
    student_name: string;
    email: string;
    college_id: string;
    department: string;
    year: string;
    phone: string;
    created_at: string;
    tournaments: {
        title: string;
        sport: string;
        date: string;
        venue: string;
    } | null;
}

const MyRegistrations = () => {
    const [email, setEmail] = useState('');
    const [registrations, setRegistrations] = useState<RegistrationWithTournament[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const fetchRegistrations = async () => {
        if (!email.trim()) {
            alert('Please enter your email address');
            return;
        }

        setLoading(true);
        setSearched(true);

        try {
            const { data, error } = await supabase
                .from('registrations')
                .select(`
          *,
          tournaments (
            title,
            sport,
            date,
            venue
          )
        `)
                .eq('email', email.trim())
                .order('created_at', { ascending: false });

            if (error) throw error;
            setRegistrations(data || []);
        } catch (error) {
            console.error('Error fetching registrations:', error);
            alert('Failed to fetch registrations. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        fetchRegistrations();
    };

    return (
        <div className="min-h-screen py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">My Registrations</h1>
                    <p className="text-xl text-white/90">
                        View all your tournament registrations
                    </p>
                </div>

                {/* Email Search */}
                <div className="card mb-8">
                    <form onSubmit={handleSubmit} className="flex gap-4">
                        <div className="flex-1">
                            <label className="label">Enter your email to view registrations</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-field"
                                placeholder="your.email@college.edu"
                                required
                            />
                        </div>
                        <div className="flex items-end">
                            <button type="submit" className="btn-primary" disabled={loading}>
                                {loading ? 'Searching...' : 'Search'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Results */}
                {searched && (
                    <>
                        {registrations.length === 0 ? (
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
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                </svg>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    No registrations found
                                </h3>
                                <p className="text-gray-600">
                                    No tournament registrations found for <strong>{email}</strong>
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {registrations.map((registration) => (
                                    <div key={registration.id} className="card hover:shadow-xl transition-shadow">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900 mb-1">
                                                    {registration.tournaments?.title || 'Tournament Deleted'}
                                                </h3>
                                                {registration.tournaments && (
                                                    <span className="inline-block bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-semibold">
                                                        {registration.tournaments.sport}
                                                    </span>
                                                )}
                                            </div>
                                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                                                Registered
                                            </span>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <p className="text-sm text-gray-600">Student Name</p>
                                                <p className="font-semibold text-gray-900">{registration.student_name}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">College ID</p>
                                                <p className="font-semibold text-gray-900">{registration.college_id}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Department</p>
                                                <p className="font-semibold text-gray-900">{registration.department}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Year</p>
                                                <p className="font-semibold text-gray-900">{registration.year}</p>
                                            </div>
                                        </div>

                                        {registration.tournaments && (
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <div className="grid md:grid-cols-2 gap-3 text-sm">
                                                    <div className="flex items-center text-gray-700">
                                                        <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        <span>{format(new Date(registration.tournaments.date), 'MMM dd, yyyy')}</span>
                                                    </div>
                                                    <div className="flex items-center text-gray-700">
                                                        <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                        <span>{registration.tournaments.venue}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="mt-4 text-xs text-gray-500">
                                            Registered on {format(new Date(registration.created_at), 'MMM dd, yyyy h:mm a')}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default MyRegistrations;
