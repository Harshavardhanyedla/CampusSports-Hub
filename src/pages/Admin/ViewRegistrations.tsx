import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase, type Tournament } from '../../services/supabaseClient';
import { format } from 'date-fns';
import { useModal } from '../../context/ModalContext';

interface Registration {
    id: string;
    student_name: string;
    email: string;
    college_id: string;
    department: string;
    year: string;
    phone: string;
    created_at: string;
}

const ViewRegistrations = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showAlert } = useModal();
    const [tournament, setTournament] = useState<Tournament | null>(null);
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            const { data: tData, error: tErr } = await supabase.from('tournaments').select('*').eq('id', id).single();
            if (tErr) throw tErr;
            setTournament(tData);

            const { data: rData, error: rErr } = await supabase.from('registrations').select('*').eq('tournament_id', id).order('created_at', { ascending: false });
            if (rErr) throw rErr;
            setRegistrations(rData || []);
        } catch (error: any) {
            console.error('Error:', error);
            showAlert('Error', 'Failed to load registrations.');
        } finally {
            setLoading(false);
        }
    };

    const exportToCSV = () => {
        if (registrations.length === 0) {
            showAlert('Info', 'No registrations to export.');
            return;
        }

        const headers = ['Student Name', 'Email', 'College ID', 'Department', 'Year', 'Phone', 'Registered At'];
        const csvContent = [
            headers.join(','),
            ...registrations.map(r => [
                `"${r.student_name}"`, `"${r.email}"`, `"${r.college_id}"`, `"${r.department}"`, `"${r.year}"`, `"${r.phone}"`, `"${format(new Date(r.created_at), 'yyyy-MM-dd HH:mm:ss')}"`
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${tournament?.title.replace(/\s+/g, '_')}_registrations.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-500"></div></div>;

    if (!tournament) return (
        <div className="min-h-screen flex items-center justify-center container-custom">
            <div className="glass-panel p-10 text-center rounded-3xl border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-6">Tournament not found</h2>
                <button onClick={() => navigate('/admin')} className="btn-primary">Back to Dashboard</button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen container-custom py-12">
            <header className="mb-12">
                <Link to="/admin" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 mb-6">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    Back to Dashboard
                </Link>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">{tournament.title}</h1>
                        <p className="text-gray-400">Viewing all registered participants</p>
                    </div>
                    <button onClick={exportToCSV} className="btn-primary shadow-lg shadow-indigo-500/20">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        Export as CSV
                    </button>
                </div>
            </header>

            <div className="glass-panel p-8 rounded-3xl border border-white/5 relative overflow-hidden">
                {registrations.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                        <svg className="w-20 h-20 mx-auto mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        <h3 className="text-2xl font-bold text-white mb-2">No Registrations Yet</h3>
                        <p>When students sign up, they'll appear here.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="pb-4 pt-2 font-semibold text-gray-400">Student Info</th>
                                    <th className="pb-4 pt-2 font-semibold text-gray-400">Identity</th>
                                    <th className="pb-4 pt-2 font-semibold text-gray-400">Department</th>
                                    <th className="pb-4 pt-2 font-semibold text-gray-400">Year</th>
                                    <th className="pb-4 pt-2 font-semibold text-gray-400">Contact</th>
                                    <th className="pb-4 pt-2 font-semibold text-gray-400">Registered</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {registrations.map((reg) => (
                                    <tr key={reg.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="py-5">
                                            <div className="font-bold text-white">{reg.student_name}</div>
                                            <div className="text-sm text-gray-500">{reg.email}</div>
                                        </td>
                                        <td className="py-5">
                                            <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-lg text-indigo-400 font-mono text-sm">{reg.college_id}</span>
                                        </td>
                                        <td className="py-5 text-gray-300">{reg.department}</td>
                                        <td className="py-5 text-gray-300">{reg.year}</td>
                                        <td className="py-5 text-gray-300 font-mono text-sm">{reg.phone}</td>
                                        <td className="py-5">
                                            <div className="text-white text-sm">{format(new Date(reg.created_at), 'MMM dd')}</div>
                                            <div className="text-xs text-gray-500">{format(new Date(reg.created_at), 'h:mm a')}</div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewRegistrations;
