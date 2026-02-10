# 🏆 CampusSports Hub - College Sports Tournament Registration System

A modern, full-stack web application for managing college sports tournaments and student registrations, built with React, TypeScript, Tailwind CSS, and Supabase.

## ✨ Features

### 🎓 **Student Features (Public)**
- View all active and past tournaments
- Search and filter tournaments by sport
- View detailed tournament information
- Register for open tournaments
- View personal registration history by email
- Responsive, mobile-friendly design

### 👨‍💼 **Admin Features**
- Admin dashboard with statistics
- Create, edit, and delete tournaments
- View all registrations per tournament
- Export registrations to CSV
- Manage tournament status (Open/Closed)

### 🔐 **Authentication Status**
- **v1 (Current)**: No authentication required
- **Auth-Ready Architecture**: Database schema and code structure designed for easy authentication implementation in future versions

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL + REST API)
- **Routing**: React Router v6
- **Date Handling**: date-fns
- **State Management**: React Hooks

## 📦 Project Structure

```
CampusSports Hub/
├── src/
│   ├── components/          # Reusable components
│   │   ├── Navbar.tsx
│   │   └── TournamentCard.tsx
│   ├── pages/
│   │   ├── Public/          # Student-facing pages
│   │   │   ├── HomePage.tsx
│   │   │   ├── TournamentDetail.tsx
│   │   │   ├── Register.tsx
│   │   │   └── MyRegistrations.tsx
│   │   └── Admin/           # Admin pages
│   │       ├── AdminDashboard.tsx
│   │       ├── CreateTournament.tsx
│   │       ├── EditTournament.tsx
│   │       └── ViewRegistrations.tsx
│   ├── services/
│   │   └── supabaseClient.ts  # Supabase configuration
│   ├── App.tsx              # Main app with routing
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── database-schema.sql      # Complete database schema
├── .env.example             # Environment variables template
└── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Supabase account ([Create one here](https://supabase.com))

### 1️⃣ Clone and Install

```bash
cd "CampusSports Hub"
npm install
```

### 2️⃣ Set Up Supabase

1. **Create a Supabase Project**
   - Go to [https://app.supabase.com](https://app.supabase.com)
   - Create a new project
   - Wait for the project to be fully set up

2. **Run the Database Schema**
   - In your Supabase project, go to **SQL Editor**
   - Copy the entire contents of `database-schema.sql`
   - Paste and run the SQL script
   - This will create all tables, indexes, and RLS policies

3. **Get Your API Credentials**
   - Go to **Project Settings > API**
   - Copy your **Project URL** and **anon/public key**

### 3️⃣ Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4️⃣ Run the Development Server

```bash
npm run dev
```

The application will open at `http://localhost:5173`

## 📊 Database Schema

### Tables

#### `tournaments`
- Tournament details (title, sport, date, venue, etc.)
- Registration deadline
- Team size (individual/team)
- Status (open/closed)

#### `registrations`
- Student registration information
- Links to tournaments via foreign key
- Stores student name, email, college ID, department, year, phone

#### `users` (Future Use)
- Ready for authentication implementation
- Role-based (admin/student)

### Row Level Security (RLS)
- **Currently**: Public access enabled (temporary for v1)
- **Future**: Role-based policies ready to implement

## 🎨 Design Features

- **Modern Gradient Background**: Eye-catching purple gradient
- **Responsive Cards**: Beautiful card-based UI
- **Smooth Animations**: Hover effects and transitions
- **Status Indicators**: Visual feedback for open/closed tournaments
- **Form Validation**: Client-side validation with helpful error messages
- **Empty States**: Friendly messages when no data exists
- **Loading States**: Spinner animations during data fetching

## 🔄 Development Workflow

### Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🔐 Future Authentication Implementation

The system is **auth-ready**. To add authentication:

1. **Enable Supabase Auth**
   - Configure authentication providers in Supabase
   - Update environment variables

2. **Update RLS Policies** (in `database-schema.sql`)
   - Replace public policies with role-based policies
   - Restrict admin actions to `role='admin'`
   - Restrict student data access

3. **Add Auth Context**
   - Create AuthContext/Provider
   - Implement login/signup pages
   - Add protected routes

4. **Update Components**
   - Add auth checks in admin pages
   - Link registrations to user accounts
   - Show/hide features based on role

## 📝 Sample Data

The `database-schema.sql` includes sample tournaments. You can:
- Use them for testing
- Delete them after setup
- Modify them as needed

## 🚨 Important Notes

### Security
- ⚠️ **No authentication in v1**: Admin panel is publicly accessible
- 🔒 RLS policies are set for public access temporarily
- ✅ Schema is designed to easily add auth later

### Production Deployment
Before deploying to production:
1. Implement authentication
2. Update RLS policies
3. Protect admin routes
4. Add rate limiting
5. Configure custom domain
6. Set up monitoring

## 🌐 Deployment

### Deploy Frontend (Vercel/Netlify)

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Deploy** to your preferred platform:
   - Vercel: `vercel deploy`
   - Netlify: `netlify deploy`

3. **Set environment variables** in the hosting platform

### Supabase is Already Hosted
- Your Supabase backend is already live
- No additional backend deployment needed

## 🐛 Troubleshooting

### Common Issues

1. **"Failed to fetch tournaments"**
   - Check your `.env` file has correct Supabase credentials
   - Verify database schema is properly set up
   - Check browser console for specific errors

2. **"Registration failed"**
   - Ensure RLS policies are correctly set
   - Check network tab for API errors
   - Verify tournament ID exists

3. **Date/Time Issues**
   - Ensure dates are in the future
   - Check registration deadline is before tournament date
   - Timezone handling in date-fns

## 📚 Resources

- [React Documentation](https://react.dev)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Router Documentation](https://reactrouter.com)

## 🤝 Contributing

This is a college project. Feel free to:
- Report bugs
- Suggest features
- Submit pull requests
- Improve documentation

## 📄 License

MIT License - feel free to use this for your college or organization!

## 🎯 Roadmap

### v2 (Planned)
- [ ] User authentication (Admin & Student roles)
- [ ] Team registration support
- [ ] Tournament brackets/fixtures
- [ ] Live score updates
- [ ] Image uploads for tournaments
- [ ] Email notifications
- [ ] Advanced analytics dashboard

---

**Built with ❤️ for college sports enthusiasts**
