import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase, type Tournament, type Leaderboard } from '../../services/supabaseClient';
import { useModal } from '../../context/ModalContext';

const ManageLeaderboard = () => {
    const { id } = useParams();
    const { showAlert, showConfirm } = useModal();

    const [tournament, setTournament] = useState<Tournament | null>(null);
    const [leaderboard, setLeaderboard] = useState<Leaderboard[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [form, setForm] = useState({
        rank: '',
        participant_name: '',
        score: '',
        achievement: ''
    });

    useEffect(() => {
        if (id) fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            const { data: tData, error: tErr } = await supabase.from('tournaments').select('*').eq('id', id).single();
            if (tErr) throw tErr;
            setTournament(tData);

            const { data: lData, error: lErr } = await supabase
                .from('leaderboards')
                .select('*')
                .eq('tournament_id', id)
                .order('rank', { ascending: true });

            if (lErr) throw lErr;
            setLeaderboard(lData || []);
        } catch (error: any) {
            console.error('Error:', error);
            showAlert('Error', 'Failed to load data.');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.rank || !form.participant_name) {
            showAlert('Required', 'Rank and Participant Name are required.');
            return;
        }

        setSubmitting(true);
        try {
            const { error } = await supabase.from('leaderboards').insert({
                tournament_id: id,
                rank: parseInt(form.rank),
                participant_name: form.participant_name,
                score: form.score,
                achievement: form.achievement
            });

            if (error) throw error;

            setForm({ rank: '', participant_name: '', score: '', achievement: '' });
            fetchData();
            showAlert('Success', 'Leaderboard updated!');
        } catch (error: any) {
            showAlert('Error', error.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (lId: string) => {
        showConfirm('Delete Entry', 'Are you sure you want to remove this rank?', async () => {
            try {
                const { error } = await supabase.from('leaderboards').delete().eq('id', lId);
                if (error) throw error;
                fetchData();
            } catch (error: any) {
                showAlert('Error', error.message);
            }
        });
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-500"></div></div>;

    if (!tournament) return <div className="text-center py-20 text-white">Tournament not found</div>;

    return (
        <div className="min-h-screen container-custom py-12">
            <header className="mb-12">
                <Link to="/admin" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 mb-6">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    Back to Dashboard
                </Link>
                <h1 className="text-4xl font-bold text-white mb-2">Manage Leaderboard</h1>
                <p className="text-gray-400">Tournament: {tournament.title}</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Add Entry Form */}
                <div className="glass-panel p-8 rounded-3xl border border-white/5 h-fit sticky top-24">
                    <h3 className="text-xl font-bold text-white mb-6">Add Rank</h3>
                    <form onSubmit={handleAdd} className="space-y-4">
                        <div>
                            <label className="text-sm text-gray-400 block mb-1">Rank (Number)</label>
                            <input
                                type="number"
                                value={form.rank}
                                onChange={(e) => setForm({ ...form, rank: e.target.value })}
                                className="w-full bg-gray-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none"
                                placeholder="1"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-gray-400 block mb-1">Participant / Team Name</label>
                            <input
                                type="text"
                                value={form.participant_name}
                                onChange={(e) => setForm({ ...form, participant_name: e.target.value })}
                                className="w-full bg-gray-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none"
                                placeholder="John Doe or Team Titans"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-gray-400 block mb-1">Score / Result (Optional)</label>
                            <input
                                type="text"
                                value={form.score}
                                onChange={(e) => setForm({ ...form, score: e.target.value })}
                                className="w-full bg-gray-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none"
                                placeholder="e.g. 21-15, 10:45s"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-gray-400 block mb-1">Achievement (Optional)</label>
                            <input
                                type="text"
                                value={form.achievement}
                                onChange={(e) => setForm({ ...form, achievement: e.target.value })}
                                className="w-full bg-gray-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none"
                                placeholder="e.g. Winner, Runner Up, MVP"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full btn-primary py-3 mt-4 shadow-lg shadow-indigo-500/20"
                        >
                            {submitting ? 'Adding...' : 'Add to Leaderboard'}
                        </button>
                    </form>
                </div>

                {/* Leaderboard Preview */}
                <div className="lg:col-span-2">
                    <div className="glass-panel p-8 rounded-3xl border border-white/5 overflow-hidden">
                        <h3 className="text-xl font-bold text-white mb-6">Current Standings</h3>
                        {leaderboard.length === 0 ? (
                            <div className="text-center py-20 text-gray-500 italic">
                                No entries yet. Add the winners above!
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-white/10 text-gray-400 text-sm">
                                            <th className="pb-4">Rank</th>
                                            <th className="pb-4">Participant</th>
                                            <th className="pb-4">Score</th>
                                            <th className="pb-4">Achievement</th>
                                            <th className="pb-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {leaderboard.map((entry) => (
                                            <tr key={entry.id} className="group transition-colors hover:bg-white/5">
                                                <td className="py-4">
                                                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${entry.rank === 1 ? 'bg-yellow-500/20 text-yellow-500' :
                                                        entry.rank === 2 ? 'bg-gray-400/20 text-gray-400' :
                                                            entry.rank === 3 ? 'bg-orange-500/20 text-orange-500' :
                                                                'bg-white/5 text-gray-500'
                                                        }`}>
                                                        {entry.rank}
                                                    </span>
                                                </td>
                                                <td className="py-4 font-bold text-white">{entry.participant_name}</td>
                                                <td className="py-4 text-gray-400">{entry.score || '-'}</td>
                                                <td className="py-4">
                                                    {entry.achievement && (
                                                        <span className="px-2 py-1 rounded-md bg-indigo-500/10 text-indigo-400 text-xs font-semibold">
                                                            {entry.achievement}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-4 text-right">
                                                    <button
                                                        onClick={() => handleDelete(entry.id)}
                                                        className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageLeaderboard;
