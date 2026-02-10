import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabaseClient';

const CreateTournament = () => {
    const navigate = useNavigate();
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

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.title.trim()) newErrors.title = 'Tournament title is required';
        if (!formData.sport.trim()) newErrors.sport = 'Sport is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (!formData.date) newErrors.date = 'Tournament date is required';
        if (!formData.time) newErrors.time = 'Tournament time is required';
        if (!formData.venue.trim()) newErrors.venue = 'Venue is required';
        if (!formData.registration_deadline_date) newErrors.registration_deadline_date = 'Registration deadline date is required';
        if (!formData.registration_deadline_time) newErrors.registration_deadline_time = 'Registration deadline time is required';

        // Validate deadline is before tournament date
        if (formData.date && formData.registration_deadline_date) {
            const tournamentDate = new Date(`${formData.date}T${formData.time || '00:00'}`);
            const deadlineDate = new Date(`${formData.registration_deadline_date}T${formData.registration_deadline_time || '00:00'}`);

            if (deadlineDate >= tournamentDate) {
                newErrors.registration_deadline_date = 'Registration deadline must be before tournament date';
            }
        }

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

            const { error } = await supabase.from('tournaments').insert([
                {
                    title: formData.title,
                    sport: formData.sport,
                    description: formData.description,
                    date: tournamentDateTime,
                    venue: formData.venue,
                    registration_deadline: deadlineDateTime,
                    team_size: formData.team_size,
                    status: formData.status,
                },
            ]);

            if (error) throw error;

            alert('Tournament created successfully!');
            navigate('/admin');
        } catch (error) {
            console.error('Error creating tournament:', error);
            alert('Failed to create tournament. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        if (errors[e.target.name]) {
            setErrors({
                ...errors,
                [e.target.name]: '',
            });
        }
    };

    return (
        <div className="min-h-screen py-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="card">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Create New Tournament</h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Tournament Title */}
                        <div>
                            <label className="label">
                                Tournament Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className={`input-field ${errors.title ? 'border-red-500' : ''}`}
                                placeholder="e.g., Inter-College Cricket Championship 2026"
                            />
                            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                        </div>

                        {/* Sport */}
                        <div>
                            <label className="label">
                                Sport <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="sport"
                                value={formData.sport}
                                onChange={handleChange}
                                className={`input-field ${errors.sport ? 'border-red-500' : ''}`}
                                placeholder="e.g., Cricket, Basketball, Football"
                            />
                            {errors.sport && <p className="text-red-500 text-sm mt-1">{errors.sport}</p>}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="label">
                                Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                                className={`input-field ${errors.description ? 'border-red-500' : ''}`}
                                placeholder="Describe the tournament, rules, format, prizes, etc."
                            />
                            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                        </div>

                        {/* Date and Time */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="label">
                                    Tournament Date <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    className={`input-field ${errors.date ? 'border-red-500' : ''}`}
                                />
                                {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
                            </div>
                            <div>
                                <label className="label">
                                    Tournament Time <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="time"
                                    name="time"
                                    value={formData.time}
                                    onChange={handleChange}
                                    className={`input-field ${errors.time ? 'border-red-500' : ''}`}
                                />
                                {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
                            </div>
                        </div>

                        {/* Venue */}
                        <div>
                            <label className="label">
                                Venue <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="venue"
                                value={formData.venue}
                                onChange={handleChange}
                                className={`input-field ${errors.venue ? 'border-red-500' : ''}`}
                                placeholder="e.g., Main Sports Ground, Indoor Stadium"
                            />
                            {errors.venue && <p className="text-red-500 text-sm mt-1">{errors.venue}</p>}
                        </div>

                        {/* Registration Deadline */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="label">
                                    Registration Deadline Date <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    name="registration_deadline_date"
                                    value={formData.registration_deadline_date}
                                    onChange={handleChange}
                                    className={`input-field ${errors.registration_deadline_date ? 'border-red-500' : ''}`}
                                />
                                {errors.registration_deadline_date && (
                                    <p className="text-red-500 text-sm mt-1">{errors.registration_deadline_date}</p>
                                )}
                            </div>
                            <div>
                                <label className="label">
                                    Registration Deadline Time <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="time"
                                    name="registration_deadline_time"
                                    value={formData.registration_deadline_time}
                                    onChange={handleChange}
                                    className={`input-field ${errors.registration_deadline_time ? 'border-red-500' : ''}`}
                                />
                                {errors.registration_deadline_time && (
                                    <p className="text-red-500 text-sm mt-1">{errors.registration_deadline_time}</p>
                                )}
                            </div>
                        </div>

                        {/* Team Size */}
                        <div>
                            <label className="label">
                                Team Size <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="team_size"
                                value={formData.team_size}
                                onChange={handleChange}
                                className="input-field"
                            >
                                <option value="individual">Individual</option>
                                <option value="team">Team</option>
                            </select>
                        </div>

                        {/* Status */}
                        <div>
                            <label className="label">
                                Status <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="input-field"
                            >
                                <option value="open">Open</option>
                                <option value="closed">Closed</option>
                            </select>
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex gap-4 pt-4">
                            <button
                                type="button"
                                onClick={() => navigate('/admin')}
                                className="btn-secondary flex-1"
                                disabled={submitting}
                            >
                                Cancel
                            </button>
                            <button type="submit" className="btn-primary flex-1" disabled={submitting}>
                                {submitting ? 'Creating...' : 'Create Tournament'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateTournament;
