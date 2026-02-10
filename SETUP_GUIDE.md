# 🚀 Quick Setup Guide - CampusSports Hub

Follow these steps to get your College Sports Tournament Registration System up and running!

## ⚡ Quick Start (5 Minutes)

### Step 1: Install Dependencies ✅
You've already got the project files. Now install packages:

```bash
npm install
```

### Step 2: Create Supabase Account 🔐

1. Visit [https://app.supabase.com](https://app.supabase.com)
2. Sign up with your email or GitHub
3. Create a new project:
   - **Project Name**: CampusSports Hub (or any name you like)
   - **Database Password**: Choose a strong password and SAVE IT
   - **Region**: Choose closest to you
   - Click **Create new project**

⏳ Wait 2-3 minutes for Supabase to set up your project.

### Step 3: Set Up Database 📊

1. In your Supabase project dashboard, click **SQL Editor** (left sidebar)
2. Click **New Query**
3. Open `database-schema.sql` from this project
4. Copy ALL the contents and paste into the SQL Editor
5. Click **Run** (or press Cmd/Ctrl + Enter)

✅ You should see: "Success. No rows returned"

This creates:
- `tournaments` table
- `registrations` table
- `users` table (for future use)
- Sample tournaments for testing

### Step 4: Get Your API Keys 🔑

1. In Supabase, go to **Project Settings** (gear icon, bottom left)
2. Click **API** in the settings menu
3. You'll see two important values:

   - **Project URL**: Looks like `https://xxxxx.supabase.co`
   - **anon/public key**: Long string starting with `eyJ...`

Keep this tab open!

### Step 5: Create Environment File 📝

1. In your project folder, create a file called `.env` (yes, just `.env`)
2. Copy this template:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

3. Replace `your-project.supabase.co` with your **Project URL**
4. Replace `your-anon-key-here` with your **anon/public key**
5. Save the file

### Step 6: Start the Application 🎉

```bash
npm run dev
```

Open your browser to:
```
http://localhost:5173
```

## 🎯 What to Test

### Public Side (Student View)
1. **Homepage**: See sample tournaments
2. **Search**: Try searching for "Cricket" or "Basketball"
3. **View Details**: Click on a tournament
4. **Register**: Click "Register Now" and fill out the form
5. **My Registrations**: Enter your email to see your registrations

### Admin Side
1. Click **Admin Panel** in the navbar
2. **Dashboard**: See tournament statistics
3. **Create Tournament**: Add a new tournament
4. **Edit/Delete**: Manage existing tournaments
5. **View Registrations**: See who registered and export to CSV

## ✅ Verification Checklist

- [ ] Dependencies installed (`node_modules` folder exists)
- [ ] Supabase project created
- [ ] Database schema executed (no errors in SQL Editor)
- [ ] `.env` file created with correct credentials
- [ ] Dev server running on `http://localhost:5173`
- [ ] Can view tournaments on homepage
- [ ] Can register for a tournament
- [ ] Can access admin dashboard

## 🐛 Troubleshooting

### Problem: "Module not found" errors
**Solution**: Run `npm install` again

### Problem: "Failed to fetch tournaments"
**Solutions**:
1. Check your `.env` file exists and has correct values
2. Verify your Supabase project is active
3. Make sure you ran the database schema SQL
4. Check browser console (F12) for specific errors

### Problem: Blank page or white screen
**Solutions**:
1. Check browser console (F12) for errors
2. Make sure dev server is running (`npm run dev`)
3. Try hard refresh (Cmd/Ctrl + Shift + R)

### Problem: "Row Level Security" errors
**Solution**: The database schema includes RLS policies. Make sure you ran the ENTIRE `database-schema.sql` file.

### Problem: Old data showing after changes
**Solution**: 
1. Clear browser cache
2. Hard refresh (Cmd/Ctrl + Shift + R)
3. Restart dev server

## 📱 Mobile Testing

The app is fully responsive! Test on mobile:

1. Find your local IP address:
   - Mac: System Preferences → Network
   - Windows: `ipconfig` in terminal
   - Usually looks like `192.168.x.x`

2. Access from your phone on same WiFi:
   ```
   http://YOUR_IP_ADDRESS:5173
   ```

## 🚀 Next Steps

### Customize Your App
1. **Colors**: Edit `tailwind.config.js` to change the color scheme
2. **Branding**: Update the app name in `src/components/Navbar.tsx`
3. **Background**: Change gradient in `src/index.css` (body styles)

### Add More Sample Data
Go to Supabase → SQL Editor and run:

```sql
INSERT INTO tournaments (title, sport, description, date, venue, registration_deadline, team_size, status)
VALUES 
  ('Your Tournament Name', 'Your Sport', 'Description here', 
   '2026-04-15 10:00:00+00', 'Your Venue', '2026-04-10 23:59:59+00', 
   'individual', 'open');
```

### Deploy to Production
Ready to share with your college?

1. **Build**: `npm run build`
2. **Deploy to Vercel**:
   - Install Vercel CLI: `npm i -g vercel`
   - Run: `vercel`
   - Add environment variables in Vercel dashboard

## 💡 Pro Tips

1. **Keyboard Shortcuts** in Supabase SQL Editor:
   - Run query: `Cmd/Ctrl + Enter`
   - New query: `Cmd/Ctrl + N`

2. **View Database Data**:
   - Supabase → Table Editor
   - See all your tournaments and registrations

3. **Clear Test Data**:
   ```sql
   DELETE FROM registrations;
   DELETE FROM tournaments;
   ```

4. **Reset Auto-increment** (if needed):
   ```sql
   -- Data is UUID-based, no need to reset!
   ```

## 📞 Need Help?

Check these in order:
1. Browser Console (F12 → Console tab)
2. Network Tab (F12 → Network tab) for API errors
3. Supabase Logs (Project → Logs)
4. README.md (full documentation)

## 🎓 Learning Resources

- **Supabase Tutorial**: [https://supabase.com/docs/guides/getting-started](https://supabase.com/docs/guides/getting-started)
- **React**: [https://react.dev/learn](https://react.dev/learn)
- **Tailwind CSS**: [https://tailwindcss.com/docs](https://tailwindcss.com/docs)

---

**🎉 Enjoy building your sports tournament system!**
