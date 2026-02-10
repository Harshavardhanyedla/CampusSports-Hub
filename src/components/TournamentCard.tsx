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
        <div className="card-modern group relative flex flex-col h-full bg-slate-900/30 backdrop-blur-md border border-white/5 rounded-[2rem] overflow-hidden">

            {/* Action Overlay (Admin Actions) */}
            {showActions && (
                <div className="absolute top-4 left-4 z-30 flex gap-2">
                    <button onClick={onEdit} className="p-2 bg-indigo-500/90 hover:bg-indigo-600 text-white rounded-lg backdrop-blur-md shadow-lg transition-all active:scale-90">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </button>
                    <button onClick={onDelete} className="p-2 bg-red-500/90 hover:bg-red-600 text-white rounded-lg backdrop-blur-md shadow-lg transition-all active:scale-90">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                </div>
            )}

            {/* Premium Status Badge */}
            <div className="absolute top-6 right-6 z-30">
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] shadow-xl border ${statusColor} backdrop-blur-xl ring-4 ring-black/20`}>
                    {statusText}
                </span>
            </div>

            {/* Dynamic Visual Header */}
            <div className={`relative h-56 w-full bg-gradient-to-br ${getSportGradient(tournament.sport)} transition-transform duration-700 group-hover:scale-105`}>
                <div className="absolute inset-0 bg-black/10" />
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

                {/* Floating Sport Icon */}
                <div className="absolute inset-x-0 bottom-4 flex justify-center opacity-30 group-hover:opacity-50 transition-opacity duration-500">
                    <SportIcon sport={tournament.sport} className="w-32 h-32 text-white blur-[2px]" />
                </div>

                {/* Sport Tag */}
                <div className="absolute bottom-6 left-6 flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg">
                    <SportIcon sport={tournament.sport} className="w-3.5 h-3.5 text-white" />
                    <span className="text-[10px] font-bold text-white uppercase tracking-widest">{tournament.sport}</span>
                </div>
            </div>

            {/* Refined Content Area */}
            <div className="p-8 flex flex-col flex-grow bg-slate-950/40 border-t border-white/5">
                <h3 className="text-2xl font-black text-white mb-4 line-clamp-2 leading-tight tracking-tight min-h-[4rem]">
                    {tournament.title}
                </h3>

                <div className="grid grid-cols-1 gap-4 text-xs font-medium text-slate-400">
                    <div className="flex items-center gap-3 group/info">
                        <div className="p-2 bg-indigo-500/10 rounded-lg group-hover/info:bg-indigo-500/20 transition-colors">
                            <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        </div>
                        <span className="group-hover/info:text-indigo-300 transition-colors">{format(new Date(tournament.date), 'MMM dd • h:mm a')}</span>
                    </div>

                    <div className="flex items-center gap-3 group/info">
                        <div className="p-2 bg-pink-500/10 rounded-lg group-hover/info:bg-pink-500/20 transition-colors">
                            <svg className="w-4 h-4 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                        </div>
                        <span className="group-hover/info:text-pink-300 transition-colors truncate max-w-[200px]">{tournament.venue}</span>
                    </div>
                </div>

                {/* CTA Buttons */}
                <div className="mt-8 pt-6 border-t border-white/5 flex gap-3">
                    {showActions ? (
                        <div className="grid grid-cols-2 gap-2 w-full">
                            <Link to={`/admin/registrations/${tournament.id}`} className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-white text-center text-[10px] font-black uppercase tracking-widest rounded-xl transition-all">
                                Registrations
                            </Link>
                            <Link to={`/admin/leaderboard/${tournament.id}`} className="py-2.5 px-4 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 text-amber-500 text-center text-[10px] font-black uppercase tracking-widest rounded-xl transition-all">
                                Leaderboard
                            </Link>
                        </div>
                    ) : (
                        <>
                            <Link
                                to={`/tournament/${tournament.id}`}
                                className="flex-1 py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/5 text-white text-center text-xs font-bold rounded-2xl transition-all"
                            >
                                Info
                            </Link>
                            {!isClosed && !isExpired && (
                                <Link
                                    to={`/register/${tournament.id}`}
                                    className="flex-[2] py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:shadow-[0_0_20px_-5px_rgba(99,102,241,0.5)] text-white text-center text-xs font-black uppercase tracking-wider rounded-2xl transition-all active:scale-95"
                                >
                                    Participate
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
