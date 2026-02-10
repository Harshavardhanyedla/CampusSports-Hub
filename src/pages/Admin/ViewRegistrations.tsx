import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase, type Tournament } from '../../services/supabaseClient';
import { format } from 'date-fns';

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
    const [tournament, setTournament] = useState<Tournament | null>(null);
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchData();
        }
    }, [id]);

    const fetchData = async () => {
        try {
            // Fetch tournament
            const { data: tournamentData, error: tournamentError } = await supabase
                .from('tournaments')
                .select('*')
                .eq('id', id)
                .single();

            if (tournamentError) throw tournamentError;
            setTournament(tournamentData);

            // Fetch registrations
            const { data: registrationsData, error: registrationsError } = await supabase
                .from('registrations')
                .select('*')
                .eq('tournament_id', id)
                .order('created_at', { ascending: false });

            if (registrationsError) throw registrationsError;
            setRegistrations(registrationsData || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const exportToCSV = () => {
        if (registrations.length === 0) {
            alert('No registrations to export');
            return;
        }

        const headers = ['Student Name', 'Email', 'College ID', 'Department', 'Year', 'Phone', 'Registered At'];
        const rows = registrations.map((reg) => [
            reg.student_name,
            reg.email,
            reg.college_id,
            reg.department,
            reg.year,
            reg.phone,
            format(new Date(reg.created_at), 'yyyy-MM-dd HH:mm:ss'),
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${tournament?.title.replace(/\s+/g, '_')}_registrations.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
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
                    <Link to="/admin" className="btn-primary">
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <Link to="/admin" className="inline-flex items-center text-white mb-4 hover:underline">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Dashboard
                    </Link>
                    <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">{tournament.title}</h1>
                    <p className="text-xl text-white/90">Tournament Registrations</p>
                </div>

                {/* Stats Card */}
                <div className="card mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 mb-1">Total Registrations</p>
                            <p className="text-4xl font-bold text-primary-600">{registrations.length}</p>
                        </div>
                        <button onClick={exportToCSV} className="btn-primary flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Export to CSV
                        </button>
                    </div>
                </div>

                {/* Registrations Table */}
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
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                        </svg>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No registrations yet</h3>
                        <p className="text-gray-600">Students haven't registered for this tournament</p>
                    </div>
                ) : (
                    <div className="card overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Student Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            College ID
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Department
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Year
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Phone
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Registered At
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {registrations.map((registration) => (
                                        <tr key={registration.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="font-medium text-gray-900">{registration.student_name}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-gray-600">{registration.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-gray-900 font-mono">{registration.college_id}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-gray-600">{registration.department}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-gray-600">{registration.year}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-gray-600">{registration.phone}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-600">
                                                    {format(new Date(registration.created_at), 'MMM dd, yyyy')}
                                                    <br />
                                                    <span className="text-xs text-gray-500">
                                                        {format(new Date(registration.created_at), 'h:mm a')}
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewRegistrations;
