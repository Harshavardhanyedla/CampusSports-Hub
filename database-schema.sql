-- =====================================================
-- College Sports Tournament Registration System
-- Database Schema (Supabase/PostgreSQL)
-- =====================================================
-- ⚠️ NO AUTHENTICATION FOR v1
-- ⚠️ Schema is designed to be AUTH-READY for future implementation
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TOURNAMENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS tournaments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    sport VARCHAR(100) NOT NULL,
    description TEXT,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    venue VARCHAR(255) NOT NULL,
    registration_deadline TIMESTAMP WITH TIME ZONE NOT NULL,
    team_size VARCHAR(20) NOT NULL CHECK (team_size IN ('individual', 'team')),
    status VARCHAR(20) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for frequently queried columns
CREATE INDEX idx_tournaments_status ON tournaments(status);
CREATE INDEX idx_tournaments_date ON tournaments(date);

-- =====================================================
-- REGISTRATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
    student_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    college_id VARCHAR(50) NOT NULL,
    department VARCHAR(100) NOT NULL,
    year VARCHAR(20) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX idx_registrations_tournament ON registrations(tournament_id);
CREATE INDEX idx_registrations_email ON registrations(email);
CREATE INDEX idx_registrations_college_id ON registrations(college_id);

-- =====================================================
-- USERS TABLE (FOR FUTURE AUTH)
-- =====================================================
-- ⚠️ Not used in v1, but schema is ready for future auth implementation
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'student')),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================
-- Enable RLS on all tables
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- ⚠️ TEMPORARY PUBLIC ACCESS POLICIES (v1 - NO AUTH)
-- 🔒 Replace these with role-based policies once authentication is implemented

-- TOURNAMENTS: Public read, public write (admin actions)
-- TODO: Replace with: Only admins can create/update/delete
CREATE POLICY "tournaments_public_read" ON tournaments
    FOR SELECT USING (true);

CREATE POLICY "tournaments_public_write" ON tournaments
    FOR INSERT WITH CHECK (true);

CREATE POLICY "tournaments_public_update" ON tournaments
    FOR UPDATE USING (true);

CREATE POLICY "tournaments_public_delete" ON tournaments
    FOR DELETE USING (true);

-- REGISTRATIONS: Public insert, public read
-- TODO: Replace with: Students can only see their own, admins can see all
CREATE POLICY "registrations_public_read" ON registrations
    FOR SELECT USING (true);

CREATE POLICY "registrations_public_insert" ON registrations
    FOR INSERT WITH CHECK (true);

-- USERS: No public access (future use only)
-- TODO: Add proper auth policies when implementing authentication
CREATE POLICY "users_no_access" ON users
    FOR ALL USING (false);

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for tournaments updated_at
CREATE TRIGGER update_tournaments_updated_at BEFORE UPDATE ON tournaments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for users updated_at (future use)
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SAMPLE DATA (Optional - for testing)
-- =====================================================

-- Sample Tournament
INSERT INTO tournaments (title, sport, description, date, venue, registration_deadline, team_size, status)
VALUES 
    ('Inter-College Cricket Championship 2026', 'Cricket', 'Annual cricket tournament featuring top college teams from across the region.', 
     '2026-03-15 09:00:00+05:30', 'Main Sports Ground', '2026-03-10 23:59:59+05:30', 'team', 'open'),
    ('Basketball 3v3 Tournament', 'Basketball', 'Fast-paced 3v3 basketball competition. Show your skills!', 
     '2026-02-25 14:00:00+05:30', 'Indoor Sports Complex', '2026-02-20 23:59:59+05:30', 'team', 'open'),
    ('Individual Badminton Championship', 'Badminton', 'Singles badminton tournament open to all students.', 
     '2026-03-01 08:00:00+05:30', 'Badminton Hall', '2026-02-25 23:59:59+05:30', 'individual', 'open');

-- =====================================================
-- LEADERBOARDS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS leaderboards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
    rank INT NOT NULL,
    participant_name VARCHAR(255) NOT NULL,
    score VARCHAR(100),
    achievement VARCHAR(255), -- e.g. "Winner", "Best Player"
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_leaderboards_tournament ON leaderboards(tournament_id);
CREATE INDEX idx_leaderboards_rank ON leaderboards(rank);

-- RLS for Leaderboards
ALTER TABLE leaderboards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "leaderboards_public_read" ON leaderboards
    FOR SELECT USING (true);

CREATE POLICY "leaderboards_admin_insert" ON leaderboards
    FOR INSERT WITH CHECK (true); -- TODO: Tighten to admin only later

CREATE POLICY "leaderboards_admin_update" ON leaderboards
    FOR UPDATE USING (true);

CREATE POLICY "leaderboards_admin_delete" ON leaderboards
    FOR DELETE USING (true);

-- =====================================================
-- NOTES FOR FUTURE AUTH IMPLEMENTATION
-- =====================================================
-- When adding authentication:
-- 1. Integrate Supabase Auth (email/password or OAuth)
-- 2. Update RLS policies:
--    - tournaments: Only role='admin' can INSERT/UPDATE/DELETE
--    - registrations: Students can only SELECT their own (WHERE email = auth.email())
--    - registrations: Admins can SELECT all
-- 3. Link registrations to users table via user_id foreign key
-- 4. Add middleware to check user roles in frontend
-- 5. Protect admin routes in React Router
-- =====================================================