import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase, type Tournament } from '../../services/supabaseClient';

const Register = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [tournament, setTournament] = useState<Tournament | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        student_name: '',
        email: '',
        college_id: '',
        department: '',
        year: '',
        phone: '',
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
            setTournament(data);
        } catch (error) {
            console.error('Error fetching tournament:', error);
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.student_name.trim()) newErrors.student_name = 'Name is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!formData.college_id.trim()) newErrors.college_id = 'College ID is required';
        if (!formData.department.trim()) newErrors.department = 'Department is required';
        if (!formData.year) newErrors.year = 'Year is required';
        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
            newErrors.phone = 'Phone number must be 10 digits';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setSubmitting(true);

        try {
            const { error } = await supabase.from('registrations').insert([
                {
                    tournament_id: id,
                    ...formData,
                },
            ]);

            if (error) throw error;

            setSuccess(true);
            setTimeout(() => {
                navigate('/my-registrations');
            }, 2000);
        } catch (error) {
            console.error('Error submitting registration:', error);
            alert('Failed to submit registration. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        // Clear error when user starts typing
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

    if (!tournament) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="card text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Tournament not found</h2>
                </div>
            </div>
        );
    }

    const isExpired = new Date(tournament.registration_deadline) < new Date();
    const isClosed = tournament.status === 'closed';

    if (isClosed || isExpired) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="card text-center max-w-md">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Registration Closed</h2>
                    <p className="text-gray-600 mb-6">
                        Registration for this tournament is no longer available.
                    </p>
                    <button onClick={() => navigate('/')} className="btn-primary">
                        View Other Tournaments
                    </button>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="card text-center max-w-md">
                    <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                        <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Registration Successful!</h2>
                    <p className="text-gray-600 mb-6">
                        You have successfully registered for <strong>{tournament.title}</strong>
                    </p>
                    <p className="text-sm text-gray-500">Redirecting to your registrations...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="card">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Tournament Registration</h1>
                    <p className="text-gray-600 mb-6">{tournament.title}</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Student Name */}
                        <div>
                            <label className="label">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="student_name"
                                value={formData.student_name}
                                onChange={handleChange}
                                className={`input-field ${errors.student_name ? 'border-red-500' : ''}`}
                                placeholder="Enter your full name"
                            />
                            {errors.student_name && (
                                <p className="text-red-500 text-sm mt-1">{errors.student_name}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="label">
                                Email Address <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`input-field ${errors.email ? 'border-red-500' : ''}`}
                                placeholder="your.email@college.edu"
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>

                        {/* College ID */}
                        <div>
                            <label className="label">
                                College ID <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="college_id"
                                value={formData.college_id}
                                onChange={handleChange}
                                className={`input-field ${errors.college_id ? 'border-red-500' : ''}`}
                                placeholder="e.g., STU2026001"
                            />
                            {errors.college_id && (
                                <p className="text-red-500 text-sm mt-1">{errors.college_id}</p>
                            )}
                        </div>

                        {/* Department */}
                        <div>
                            <label className="label">
                                Department <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                className={`input-field ${errors.department ? 'border-red-500' : ''}`}
                                placeholder="e.g., Computer Science"
                            />
                            {errors.department && (
                                <p className="text-red-500 text-sm mt-1">{errors.department}</p>
                            )}
                        </div>

                        {/* Year */}
                        <div>
                            <label className="label">
                                Year <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="year"
                                value={formData.year}
                                onChange={handleChange}
                                className={`input-field ${errors.year ? 'border-red-500' : ''}`}
                            >
                                <option value="">Select year</option>
                                <option value="1st Year">1st Year</option>
                                <option value="2nd Year">2nd Year</option>
                                <option value="3rd Year">3rd Year</option>
                                <option value="4th Year">4th Year</option>
                            </select>
                            {errors.year && <p className="text-red-500 text-sm mt-1">{errors.year}</p>}
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="label">
                                Phone Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className={`input-field ${errors.phone ? 'border-red-500' : ''}`}
                                placeholder="10-digit phone number"
                            />
                            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                        </div>

                        {/* Submit Button */}
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="btn-secondary flex-1"
                                disabled={submitting}
                            >
                                Cancel
                            </button>
                            <button type="submit" className="btn-primary flex-1" disabled={submitting}>
                                {submitting ? 'Submitting...' : 'Register'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
