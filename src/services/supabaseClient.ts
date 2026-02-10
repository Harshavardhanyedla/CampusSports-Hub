import { createClient } from '@supabase/supabase-js';

// Replace these with your actual Supabase credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types for TypeScript
export interface Tournament {
    id: string;
    title: string;
    sport: string;
    description: string;
    date: string;
    venue: string;
    registration_deadline: string;
    team_size: 'individual' | 'team';
    status: 'open' | 'closed';
    created_at: string;
}

export interface Registration {
    id: string;
    tournament_id: string;
    student_name: string;
    email: string;
    college_id: string;
    department: string;
    year: string;
    phone: string;
    created_at: string;
}

// Future auth-ready type
export interface User {
    id: string;
    role: 'admin' | 'student';
    email: string;
    name: string;
}
