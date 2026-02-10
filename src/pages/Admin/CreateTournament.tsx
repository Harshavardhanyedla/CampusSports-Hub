import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabaseClient';
import { useModal } from '../../context/ModalContext';

const CreateTournament = () => {
    const navigate = useNavigate();
    const { showAlert } = useModal();
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
        team_size: 'individual',
        status: 'open',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const tournamentDate = new Date(`${formData.date}T${formData.time}`);
            const deadlineDate = new Date(`${formData.registration_deadline_date}T${formData.registration_deadline_time}`);

            const { error } = await supabase.from('tournaments').insert([{
                title: formData.title,
                sport: formData.sport,
                description: formData.description,
                date: tournamentDate.toISOString(),
                venue: formData.venue,
                registration_deadline: deadlineDate.toISOString(),
                team_size: formData.team_size,
                status: formData.status,
            }]);

            if (error) throw error;

            showAlert('Success', 'Tournament created successfully!');
            navigate('/admin');
        } catch (error: any) {
            console.error('Error:', error);
            showAlert('Error', 'Failed to create tournament: ' + error.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen container-custom py-12 flex flex-col items-center justify-center">
            <div className="w-full max-w-4xl">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Create New Tournament</h1>
                        <p className="text-gray-400">Launch a new event for the campus.</p>
                    </div>
                    <button onClick={() => navigate('/admin')} className="text-gray-400 hover:text-white transition-colors">
                        Cancel
                    </button>
                </div>

                <div className="glass-panel p-8 md:p-10 rounded-3xl border border-white/5 relative overflow-hidden">
                    <form onSubmit={handleSubmit} className="space-y-8 relative z-10">

                        {/* Section 1: Basic Info */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold text-white border-b border-white/10 pb-2">Basic Info</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputField label="Tournament Title" name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. Winter Badminton Cup" />
                                <InputField label="Sport" name="sport" value={formData.sport} onChange={handleChange} required placeholder="e.g. Badminton" />
                            </div>
                            <TextAreaField label="Description" name="description" value={formData.description} onChange={handleChange} rows={4} placeholder="About the tournament..." />
                        </div>

                        {/* Section 2: Schedule & Venue */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold text-white border-b border-white/10 pb-2">Schedule & Venue</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputField type="date" label="Event Date" name="date" value={formData.date} onChange={handleChange} required />
                                <InputField type="time" label="Event Time" name="time" value={formData.time} onChange={handleChange} required />
                            </div>
                            <InputField label="Venue" name="venue" value={formData.venue} onChange={handleChange} required placeholder="e.g. Main Stadium" />
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

                        {/* Submit */}
                        <div className="pt-6 border-t border-white/10 flex justify-end gap-4">
                            <button type="button" onClick={() => navigate('/admin')} className="px-6 py-3 rounded-xl hover:bg-white/5 text-gray-300 transition-colors">
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="btn-primary px-8 py-3 text-lg shadow-lg shadow-indigo-500/20"
                            >
                                {submitting ? 'Creating...' : 'Launch Tournament'}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

const InputField = ({ label, ...props }: any) => (
    <div className="space-y-2">
        <label className="text-sm font-medium text-gray-400 ml-1">{label}</label>
        <input className="w-full bg-gray-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder-gray-600" {...props} />
    </div>
);

const TextAreaField = ({ label, ...props }: any) => (
    <div className="space-y-2">
        <label className="text-sm font-medium text-gray-400 ml-1">{label}</label>
        <textarea className="w-full bg-gray-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder-gray-600 resize-none" {...props} />
    </div>
);

const SelectField = ({ label, options, ...props }: any) => (
    <div className="space-y-2">
        <label className="text-sm font-medium text-gray-400 ml-1">{label}</label>
        <div className="relative">
            <select className="w-full bg-gray-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all appearance-none cursor-pointer capitalize" {...props}>
                {options.map((opt: string) => <option key={opt} value={opt} className="bg-gray-900 text-white capitalize">{opt}</option>)}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        </div>
    </div>
);

export default CreateTournament;
