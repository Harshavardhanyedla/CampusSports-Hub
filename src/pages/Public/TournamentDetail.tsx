import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase, type Tournament } from '../../services/supabaseClient';
import { format } from 'date-fns';

const TournamentDetail = () => {
    const { id } = useParams();
    const [tournament, setTournament] = useState<Tournament | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchTournament();
        }
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
            console.error('Error fetching tournament:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!tournament) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="card text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Tournament not found</h2>
                    <Link to="/" className="btn-primary">
                        Back to Tournaments
                    </Link>
                </div>
            </div>
        );
    }

    const isExpired = new Date(tournament.registration_deadline) < new Date();
    const isClosed = tournament.status === 'closed';
    const canRegister = !isClosed && !isExpired;

    return (
        <div className="min-h-screen py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <Link to="/" className="inline-flex items-center text-white mb-6 hover:underline">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Tournaments
                </Link>

                {/* Tournament Details Card */}
                <div className="card">
                    {/* Header */}
                    <div className="border-b border-gray-200 pb-6 mb-6">
                        <div className="flex justify-between items-start mb-4">
                            <h1 className="text-4xl font-bold text-gray-900">{tournament.title}</h1>
                            <span
                                className={`px-4 py-2 rounded-full text-sm font-bold ${canRegister
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-red-100 text-red-700'
                                    }`}
                            >
                                {canRegister ? 'Registration Open' : 'Registration Closed'}
                            </span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-semibold">
                                {tournament.sport}
                            </span>
                            <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold capitalize">
                                {tournament.team_size}
                            </span>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-3">About Tournament</h2>
                        <p className="text-gray-700 leading-relaxed">{tournament.description}</p>
                    </div>

                    {/* Details Grid */}
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center mb-2">
                                <svg className="w-6 h-6 text-primary-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <h3 className="font-semibold text-gray-900">Tournament Date</h3>
                            </div>
                            <p className="text-gray-700 ml-8">{format(new Date(tournament.date), 'EEEE, MMMM dd, yyyy')}</p>
                            <p className="text-gray-600 ml-8 text-sm">{format(new Date(tournament.date), 'h:mm a')}</p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center mb-2">
                                <svg className="w-6 h-6 text-primary-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <h3 className="font-semibold text-gray-900">Venue</h3>
                            </div>
                            <p className="text-gray-700 ml-8">{tournament.venue}</p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 md:col-span-2">
                            <div className="flex items-center mb-2">
                                <svg className="w-6 h-6 text-primary-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h3 className="font-semibold text-gray-900">Registration Deadline</h3>
                            </div>
                            <p className={`ml-8 font-semibold ${isExpired ? 'text-red-600' : 'text-gray-700'}`}>
                                {format(new Date(tournament.registration_deadline), 'EEEE, MMMM dd, yyyy h:mm a')}
                            </p>
                            {isExpired && (
                                <p className="text-red-600 text-sm ml-8 mt-1">Registration deadline has passed</p>
                            )}
                        </div>
                    </div>

                    {/* Registration Button */}
                    <div className="border-t border-gray-200 pt-6">
                        {canRegister ? (
                            <Link to={`/register/${tournament.id}`} className="btn-primary w-full text-center block text-lg py-4">
                                Register for Tournament
                            </Link>
                        ) : (
                            <div className="text-center">
                                <p className="text-gray-600 mb-2">Registration is closed for this tournament</p>
                                <Link to="/" className="btn-secondary inline-block">
                                    View Other Tournaments
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TournamentDetail;
