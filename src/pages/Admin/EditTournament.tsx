import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabaseClient';
import { useModal } from '../../context/ModalContext';

const EditTournament = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showAlert } = useModal();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        sport: '',
        description: '',
        date: '',
        time: '',
        venue: '',
        registration_deadline_date: '',
        registration_deadline_time: '',
        team_size: 'individual' as 'individual' | 'team',
        status: 'open' as 'open' | 'closed',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (id) fetchTournament();
    }, [id]);

    const fetchTournament = async () => {
        try {
            const { data, error } = await supabase
                .from('tournaments')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;

            const tDate = new Date(data.date);
            const dDate = new Date(data.registration_deadline);

            setFormData({
                title: data.title,
                sport: data.sport,
                description: data.description,
                date: tDate.toISOString().split('T')[0],
                time: tDate.toTimeString().slice(0, 5),
                venue: data.venue,
                registration_deadline_date: dDate.toISOString().split('T')[0],
                registration_deadline_time: dDate.toTimeString().slice(0, 5),
                team_size: data.team_size,
                status: data.status,
            });
        } catch (error) {
            console.error('Error:', error);
            showAlert('Error', 'Tournament not found');
            navigate('/admin');
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.sport.trim()) newErrors.sport = 'Sport is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (!formData.date || !formData.time) newErrors.date = 'Date and Time are required';
        if (!formData.venue.trim()) newErrors.venue = 'Venue is required';
        if (!formData.registration_deadline_date || !formData.registration_deadline_time) newErrors.registration_deadline_date = 'Deadline is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setSubmitting(true);
        try {
            const tournamentDateTime = `${formData.date}T${formData.time}`;
            const deadlineDateTime = `${formData.registration_deadline_date}T${formData.registration_deadline_time}`;

            const { error } = await supabase
                .from('tournaments')
                .update({
                    title: formData.title,
                    sport: formData.sport,
                    description: formData.description,
                    date: tournamentDateTime,
                    venue: formData.venue,
                    registration_deadline: deadlineDateTime,
                    team_size: formData.team_size,
                    status: formData.status,
                })
                .eq('id', id);

            if (error) throw error;

            showAlert('Success', 'Tournament updated successfully!');
            navigate('/admin');
        } catch (error: any) {
            console.error('Error:', error);
            showAlert('Error', 'Failed to update tournament: ' + error.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-500"></div></div>;

    return (
        <div className="min-h-screen container-custom py-12 flex flex-col items-center justify-center">
            <div className="w-full max-w-4xl">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-white">Edit Tournament</h1>
                    <button onClick={() => navigate('/admin')} className="text-gray-400 hover:text-white transition-colors">Cancel</button>
                </div>

                <div className="glass-panel p-8 md:p-10 rounded-3xl border border-white/5 relative overflow-hidden">
                    <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                        {/* Section 1: Basic Info */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold text-white border-b border-white/10 pb-2">Basic Info</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputField label="Tournament Title" name="title" value={formData.title} onChange={handleChange} error={errors.title} required />
                                <InputField label="Sport" name="sport" value={formData.sport} onChange={handleChange} error={errors.sport} required />
                            </div>
                            <TextAreaField label="Description" name="description" value={formData.description} onChange={handleChange} error={errors.description} rows={4} />
                        </div>

                        {/* Section 2: Schedule & Venue */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold text-white border-b border-white/10 pb-2">Schedule & Venue</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputField type="date" label="Event Date" name="date" value={formData.date} onChange={handleChange} required />
                                <InputField type="time" label="Event Time" name="time" value={formData.time} onChange={handleChange} required />
                            </div>
                            <InputField label="Venue" name="venue" value={formData.venue} onChange={handleChange} error={errors.venue} required />
                        </div>

                        {/* Section 3: Registration Rules */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold text-white border-b border-white/10 pb-2">Registration Rules</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputField type="date" label="Deadline Date" name="registration_deadline_date" value={formData.registration_deadline_date} onChange={handleChange} required />
                                <InputField type="time" label="Deadline Time" name="registration_deadline_time" value={formData.registration_deadline_time} onChange={handleChange} required />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <SelectField label="Participation Type" name="team_size" value={formData.team_size} onChange={handleChange} options={['individual', 'team']} />
                                <SelectField label="Initial Status" name="status" value={formData.status} onChange={handleChange} options={['open', 'closed']} />
                            </div>
                        </div>

                        <div className="pt-6 border-t border-white/10 flex justify-end gap-4">
                            <button type="button" onClick={() => navigate('/admin')} className="px-6 py-3 rounded-xl hover:bg-white/5 text-gray-300 transition-colors">Cancel</button>
                            <button type="submit" disabled={submitting} className="btn-primary px-8 py-3 text-lg shadow-lg shadow-indigo-500/20">
                                {submitting ? 'Updating...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

const InputField = ({ label, error, ...props }: any) => (
    <div className="space-y-2">
        <label className="text-sm font-medium text-gray-400 ml-1">{label}</label>
        <input className={`w-full bg-gray-900/50 border ${error ? 'border-red-500/50' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all`} {...props} />
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
);

const TextAreaField = ({ label, error, ...props }: any) => (
    <div className="space-y-2">
        <label className="text-sm font-medium text-gray-400 ml-1">{label}</label>
        <textarea className={`w-full bg-gray-900/50 border ${error ? 'border-red-500/50' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none`} {...props} />
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
);

const SelectField = ({ label, options, ...props }: any) => (
    <div className="space-y-2">
        <label className="text-sm font-medium text-gray-400 ml-1">{label}</label>
        <div className="relative">
            <select className="w-full bg-gray-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all appearance-none cursor-pointer capitalize" {...props}>
                {options.map((opt: string) => <option key={opt} value={opt} className="bg-gray-900 text-white capitalize">{opt}</option>)}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </div>
        </div>
    </div>
);

export default EditTournament;
