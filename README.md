# Smart Bookmark App 🔖

This is a modern bookmark manager that lets you save your favorite links. I built it using **Next.js 15**, **Supabase**, and **Tailwind CSS**.

It features **Google Login**, **Secure Data**, and **Instant Updates** (Realtime).

---

## 🚀 Live Demo
- **Vercel URL**: [https://smart-bookmark-app-two-hazel.vercel.app](https://smart-bookmark-app-two-hazel.vercel.app)

---

## �️ What I Built
A full-stack application where users can:
1.  **Sign in with Google** (Secure authentication).
2.  **Add Bookmarks** (Title & URL).
3.  **Delete Bookmarks**.
4.  **See Updates Instantly** across multiple tabs/devices without refreshing.

---

## 🤔 Problems I Ran Into & How I Solved Them
*(This section is for the submission requirement)*

### 1. Realtime DELETE was not working
**The Problem:** When I deleted a bookmark in one tab, the other tab did not update automatically.
**Why:** By default, Supabase only sends the `ID` of the deleted row, but not the `user_id`. My app was filtering updates by `user_id`, so it ignored the delete event.
**The Solution:** I ran a special SQL command:
\`\`\`sql
alter table bookmarks replica identity full;
\`\`\`
This forced the database to send *all* data (including `user_id`) when a row is deleted, allowing my filter to work.

### 2. Login Redirected to Home instead of Dashboard
**The Problem:** After signing in, users stayed on the homepage.
**The Solution:** I updated the OAuth configuration to explicitly redirect to `window.location.origin + '/dashboard'`. I also added a check on the homepage to automatically redirect logged-in users to the dashboard.

### 3. Google Login Failed After Deployment
**The Problem:** Authentication worked locally (`localhost:3000`) but failed on the Vercel live site.
**The Solution:** I had to register the new Vercel URL in two places:
1.  **Supabase Auth Settings**: Added the Vercel URL to "Site URL" and "Redirect URLs".
2.  **Google Cloud Console**: Verified that Supabase callback URL was correct.

---

## � Tech Stack
- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS
- **Backend & Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (Google OAuth)
- **Realtime**: Supabase Realtime (WebSockets)

---

## ⚙️ How to Run Locally

1.  **Clone the repo**:
    \`\`\`bash
    git clone https://github.com/your-username/smart-bookmark-app.git
    cd smart-bookmark-app
    \`\`\`

2.  **Install packages**:
    \`\`\`bash
    npm install
    \`\`\`

3.  **Set up Environment Variables**:
    Create a \`.env.local\` file and add your Supabase keys:
    \`\`\`
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    \`\`\`

4.  **Run the app**:
    \`\`\`bash
    npm run dev
    \`\`\`
    Open [http://localhost:3000](http://localhost:3000).
