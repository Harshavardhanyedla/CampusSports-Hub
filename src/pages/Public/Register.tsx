import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase, type Tournament } from '../../services/supabaseClient';

const Register = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [tournament, setTournament] = useState<Tournament | null>(null);
    const [submitting, setSubmitting] = useState(false);
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
        if (id) fetchTournament();
    }, [id]);

    const fetchTournament = async () => {
        const { data } = await supabase.from('tournaments').select('*').eq('id', id).single();
        setTournament(data);
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.student_name.trim()) newErrors.student_name = 'Full Name is required';
        if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Valid Email is required';
        if (!formData.college_id.trim()) newErrors.college_id = 'College ID is required';
        if (!formData.phone.trim() || !/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Valid 10-digit Phone is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setSubmitting(true);
        try {
            const { error } = await supabase.from('registrations').insert({
                tournament_id: id,
                ...formData,
            });

            if (error) throw error;

            navigate('/my-registrations');
        } catch (error: any) {
            console.error('Error:', error);
            alert('Registration failed: ' + error.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    if (!tournament) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div></div>;

    return (
        <div className="min-h-screen container-custom py-12 flex flex-col items-center justify-center">

            <div className="w-full max-w-2xl">
                <div className="text-center mb-10 space-y-2">
                    <h1 className="text-4xl font-bold text-white">Secure Your Spot</h1>
                    <p className="text-gray-400">Registering for <span className="text-indigo-400 font-medium">{tournament.title}</span></p>
                </div>

                <div className="glass-panel p-8 md:p-10 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />

                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField
                                label="Full Name"
                                name="student_name"
                                value={formData.student_name}
                                onChange={handleChange}
                                error={errors.student_name}
                                placeholder="John Doe"
                            />
                            <InputField
                                label="College Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                error={errors.email}
                                placeholder="john@college.edu"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField
                                label="College ID / Roll No."
                                name="college_id"
                                value={formData.college_id}
                                onChange={handleChange}
                                error={errors.college_id}
                                placeholder="2023CS101"
                            />
                            <InputField
                                label="Phone Number"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                error={errors.phone}
                                placeholder="9876543210"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <SelectField
                                label="Department"
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                options={['CSE', 'ECE', 'MECH', 'CIVIL', 'IT', 'AI&DS', 'MBA', 'Other']}
                            />
                            <SelectField
                                label="Year of Study"
                                name="year"
                                value={formData.year}
                                onChange={handleChange}
                                options={['1st Year', '2nd Year', '3rd Year', '4th Year', 'PG']}
                            />
                        </div>

                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={submitting}
                                className={`w-full btn-primary py-4 text-lg font-bold shadow-lg shadow-indigo-500/20 group relative overflow-hidden ${submitting ? 'opacity-70 cursor-wait' : ''}`}
                            >
                                <span className={`relative z-10 flex items-center justify-center gap-2 ${submitting ? 'invisible' : ''}`}>
                                    Confirm Registration
                                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </span>
                                {submitting && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent" />
                                    </div>
                                )}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

// Helper Components
interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

const InputField = ({ label, error, ...props }: FieldProps) => (
    <div className="space-y-2">
        <label className="text-sm font-medium text-gray-400 ml-1">{label}</label>
        <input
            className={`w-full bg-gray-900/50 border ${error ? 'border-red-500/50' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder-gray-600`}
            {...props}
        />
        {error && <p className="text-xs text-red-400 ml-1">{error}</p>}
    </div>
);

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    options: string[];
}

const SelectField = ({ label, options, ...props }: SelectProps) => (
    <div className="space-y-2">
        <label className="text-sm font-medium text-gray-400 ml-1">{label}</label>
        <div className="relative">
            <select
                className="w-full bg-gray-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all appearance-none cursor-pointer"
                {...props}
            >
                <option value="" disabled selected>Select {label}</option>
                {options.map((opt) => <option key={opt} value={opt} className="bg-gray-900 text-white">{opt}</option>)}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        </div>
    </div>
);

export default Register;
