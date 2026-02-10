import { Link } from 'react-router-dom';
import type { Tournament } from '../services/supabaseClient';
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

    // Status Logic
    const statusColor = isClosed
        ? 'bg-red-500/20 text-red-300 border-red-500/30'
        : isExpired
            ? 'bg-orange-500/20 text-orange-300 border-orange-500/30'
            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';

    const statusText = isClosed ? 'Closed' : isExpired ? 'Registration Full/Ended' : 'Open for Registration';

    return (
        <div className="group relative bg-gray-900/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:border-indigo-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/20">

            {/* Card Header (Sport Icon & Status) */}
            <div className="absolute top-4 right-4 z-10">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${statusColor} backdrop-blur-md`}>
                    {statusText}
                </span>
            </div>

            {/* Hero Image Area (Gradient Placeholder) */}
            <div className={`h-48 w-full bg-gradient-to-br ${getSportGradient(tournament.sport)} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/20 mix-blend-overlay" />
                <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent" />

                {/* Sport Icon (Large, Faded) */}
                <div className="absolute -bottom-6 -right-6 text-white/10 transform rotate-12 scale-150 pointer-events-none">
                    <SportIcon sport={tournament.sport} className="w-40 h-40" />
                </div>
            </div>

            {/* Content */}
            <div className="p-6 relative -mt-12 z-20">

                {/* Sport Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg border border-white/10 mb-3">
                    <SportIcon sport={tournament.sport} className="w-4 h-4 text-indigo-300" />
                    <span className="text-xs font-medium text-white/80 uppercase tracking-widest">{tournament.sport}</span>
                </div>

                <h3 className="text-2xl font-bold text-white mb-2 leading-tight group-hover:text-indigo-400 transition-colors">
                    {tournament.title}
                </h3>

                <div className="flex flex-col gap-2 mt-4 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{format(new Date(tournament.date), 'MMMM dd, yyyy • h:mm a')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{tournament.venue}</span>
                    </div>
                </div>

                {/* Actions Footer */}
                <div className="mt-6 pt-4 border-t border-white/5 flex gap-3">
                    {showActions ? (
                        <>
                            <div className="grid grid-cols-2 gap-2 w-full">
                                <button onClick={onEdit} className="py-2 px-4 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold rounded-xl transition-all">
                                    Edit
                                </button>
                                <button onClick={onDelete} className="py-2 px-4 bg-red-500/80 hover:bg-red-600 text-white text-sm font-semibold rounded-xl transition-all">
                                    Delete
                                </button>
                                <Link to={`/admin/registrations/${tournament.id}`} className="py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white text-center text-sm font-semibold rounded-xl transition-all">
                                    Regs
                                </Link>
                                <Link to={`/admin/leaderboard/${tournament.id}`} className="py-2 px-4 bg-amber-600 hover:bg-amber-500 text-white text-center text-sm font-semibold rounded-xl transition-all">
                                    Results
                                </Link>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link
                                to={`/tournament/${tournament.id}`}
                                className="flex-1 py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-center text-sm font-semibold rounded-xl backdrop-blur-sm transition-all hover:border-indigo-500/50"
                            >
                                Details
                            </Link>
                            {!isClosed && !isExpired && (
                                <Link
                                    to={`/register/${tournament.id}`}
                                    className="flex-1 py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-center text-sm font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all transform hover:-translate-y-1"
                                >
                                    Register
                                </Link>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

// Helper: Get gradient based on sport
const getSportGradient = (sport: string) => {
    const s = sport.toLowerCase();
    if (s.includes('cricket')) return 'from-blue-600 to-indigo-900';
    if (s.includes('badminton')) return 'from-emerald-500 to-teal-900';
    if (s.includes('basket')) return 'from-orange-500 to-red-900';
    if (s.includes('football') || s.includes('soccer')) return 'from-green-600 to-emerald-900';
    return 'from-purple-600 to-indigo-900';
};

// Helper: SVG Icons for sports
const SportIcon = ({ sport, className }: { sport: string, className?: string }) => {
    const s = sport.toLowerCase();

    // Cricket Icon (Bat & Ball representation)
    if (s.includes('cricket')) {
        return (
            <svg className={className} fill="currentColor" viewBox="0 0 24 24">
                <path d="M15.24 9.68a1 1 0 00-.71-1.71 1 1 0 00-.71.29l-1.42 1.42a1 1 0 000 1.42 1 1 0 001.42 0l1.42-1.42zM12.4 12.51a1 1 0 00-.7-.29 1 1 0 00-.71.29l-1.41 1.42a1 1 0 000 1.41 1 1 0 001.41 0l1.41-1.41a1 1 0 000-1.42z" />
                <path d="M19.78 4.22a2 2 0 00-2.83 0l-9.9 9.9a2 2 0 000 2.83l2.83 2.83a2 2 0 002.83 0l9.9-9.9a2.01 2.01 0 000-2.83l-2.83-2.83zM5.5 19.5a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
        );
    }

    // Basketball Icon
    if (s.includes('basket')) {
        return (
            <svg className={className} fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
            </svg>
        );
    }

    // Badminton / Racket (Simple representation)
    if (s.includes('badminton') || s.includes('tennis')) {
        return (
            <svg className={className} fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 4.1l-.8-.8a1.94 1.94 0 00-3.3 1.3V10c0 1.1.9 2 2 2h3.4l.7-.7c.4-.4.4-1 0-1.4L10 8V6l2-2 1.4 1.4c.4.4 1 .4 1.4 0l.7-.7c.4-.4.4-1 0-1.4L14.1 2A1.94 1.94 0 0012 2c-.5 0-1 .2-1.4.6L10 4.1zM11.5 12c-2.5 0-4.5 2-4.5 4.5S9 21 11.5 21s4.5-2 4.5-4.5S14 12 11.5 12z" />
                <path d="M21.2 5.1L19.5 3.4l-6.3 6.3c-.4.4-.4 1 0 1.4l1.7 1.7c.4.4 1 .4 1.4 0l4.9-7.7z" />
            </svg>
        );
    }

    // Default Trophy Icon
    return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.2 2H3.8c-.7 0-1.2.6-1.2 1.2v3.5c0 3.6 2.7 6.6 6.2 7.1.3 2.1 2 3.8 4.2 4.1v2H9c-.6 0-1 .4-1 1s.4 1 1 1h6c.6 0 1-.4 1-1s-.4-1-1-1h-4v-2c2.2-.3 3.9-2 4.2-4.1 3.5-.5 6.2-3.5 6.2-7.1V3.2c0-.6-.5-1.2-1.2-1.2zM5 6.7V4h2v3.5c0 1.8-.7 3.4-1.9 4.6C5.1 12.1 5 6.7 5 6.7zm14 0c0 4.5-3.5 8-7 8.3V4H19v2.7z" />
        </svg>
    );
};

export default TournamentCard;
