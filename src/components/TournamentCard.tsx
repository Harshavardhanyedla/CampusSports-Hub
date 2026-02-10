import type { Tournament } from '../services/supabaseClient';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

interface TournamentCardProps {
    tournament: Tournament;
    showActions?: boolean;
    onEdit?: () => void;
    onDelete?: () => void;
}

const TournamentCard = ({ tournament, showActions, onEdit, onDelete }: TournamentCardProps) => {
    const isExpired = new Date(tournament.registration_deadline) < new Date();
    const isClosed = tournament.status === 'closed';

    return (
        <div className="card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{tournament.title}</h3>
                    <span className="inline-block bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-semibold">
                        {tournament.sport}
                    </span>
                </div>
                <div className="flex flex-col items-end">
                    <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${isClosed || isExpired
                            ? 'bg-red-100 text-red-700'
                            : 'bg-green-100 text-green-700'
                            }`}
                    >
                        {isClosed || isExpired ? 'Closed' : 'Open'}
                    </span>
                    <span className="text-xs text-gray-500 mt-1 capitalize">{tournament.team_size}</span>
                </div>
            </div>

            {/* Description */}
            <p className="text-gray-600 mb-4 line-clamp-2">{tournament.description}</p>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm">{format(new Date(tournament.date), 'MMM dd, yyyy')}</span>
                </div>
                <div className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm">{format(new Date(tournament.date), 'h:mm a')}</span>
                </div>
                <div className="flex items-center text-gray-700 col-span-2">
                    <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm">{tournament.venue}</span>
                </div>
            </div>

            {/* Deadline */}
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <p className="text-xs text-gray-600 mb-1">Registration Deadline</p>
                <p className={`text-sm font-semibold ${isExpired ? 'text-red-600' : 'text-gray-900'}`}>
                    {format(new Date(tournament.registration_deadline), 'MMM dd, yyyy h:mm a')}
                </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
                {showActions ? (
                    <>
                        <button onClick={onEdit} className="btn-primary flex-1 text-sm">
                            Edit
                        </button>
                        <button onClick={onDelete} className="btn-danger flex-1 text-sm">
                            Delete
                        </button>
                        <Link
                            to={`/admin/registrations/${tournament.id}`}
                            className="btn-secondary flex-1 text-sm text-center"
                        >
                            Registrations
                        </Link>
                    </>
                ) : (
                    <>
                        <Link
                            to={`/tournament/${tournament.id}`}
                            className="btn-secondary flex-1 text-sm text-center"
                        >
                            View Details
                        </Link>
                        {!isClosed && !isExpired && (
                            <Link
                                to={`/register/${tournament.id}`}
                                className="btn-primary flex-1 text-sm text-center"
                            >
                                Register Now
                            </Link>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default TournamentCard;
