import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabaseClient';

const EditTournament = () => {
    const { id } = useParams();
    const navigate = useNavigate();
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

            // Parse date/time
            const tournamentDate = new Date(data.date);
            const deadlineDate = new Date(data.registration_deadline);

            setFormData({
                title: data.title,
                sport: data.sport,
                description: data.description,
                date: tournamentDate.toISOString().split('T')[0],
                time: tournamentDate.toTimeString().slice(0, 5),
                venue: data.venue,
                registration_deadline_date: deadlineDate.toISOString().split('T')[0],
                registration_deadline_time: deadlineDate.toTimeString().slice(0, 5),
                team_size: data.team_size,
                status: data.status,
            });
        } catch (error) {
            console.error('Error fetching tournament:', error);
            alert('Tournament not found');
            navigate('/admin');
        } finally {
            setLoading(false);
        }
    };

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

            alert('Tournament updated successfully!');
            navigate('/admin');
        } catch (error) {
            console.error('Error updating tournament:', error);
            alert('Failed to update tournament. Please try again.');
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

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="card">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Tournament</h1>

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
                                {submitting ? 'Updating...' : 'Update Tournament'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditTournament;
