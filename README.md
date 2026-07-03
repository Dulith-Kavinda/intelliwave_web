# Intelliwave ECG Landing Page

A Vite + React + Tailwind CSS landing page for the Intelliwave ECG monitoring device.

## Includes

- 3D demo device scene with Three.js
- Scroll-linked parallax and premium hero layout
- Google-authenticated feedback and order capture
- Supabase-backed editable site content and admin editor
- Replaceable structure for your future device GLB model

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file from `.env.example` and add your Supabase values. The provided template already contains the project URL and public anon key.

3. Run the app:

```bash
npm run dev
```

## Supabase setup

Run the following once for the backend:

```bash
supabase login
supabase init
supabase link --project-ref jzsfgperbqylfahphbcw
supabase db push
```

If you want to apply the SQL directly instead of pushing migrations, you can also run:

```bash
supabase db execute --file supabase/site_content.sql --linked
```

The migration used by `supabase db push` is in `supabase/migrations/20260703_init.sql`.

This creates the `lead_requests`, `feedback_messages`, `site_content`, and `site_admins` tables used by the forms, feedback system, and editable website copy.

Google OAuth is required before users can submit feedback or order requests.

The admin panel uses Google sign-in and edits the `site_content` rows directly from the database.

The order form inserts into a table named `lead_requests` with these fields:

- `full_name`
- `email`
- `organization`
- `details`
- `request_type`
- `source`

The editable content table stores one JSON row per section:

- `header`
- `footer`
- `home`
- `installApp`
- `orderDevice`
- `feedbackContact`
- `leadForm`

The feedback form writes into `feedback_messages`, including a 1-5 rating and an `is_featured` flag that the home page reads from Supabase.

## Environment variables

Add these values to your `.env` file:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

For this project, the values are:

- `VITE_SUPABASE_URL=https://jzsfgperbqylfahphbcw.supabase.co`
- `VITE_SUPABASE_ANON_KEY=sb_publishable_W5eOVqbTjTBKfing1kcGDQ_1oKvjndH`

## Editing content in Supabase

Update the `content` JSON in any `site_content` row to change the website copy. The app merges the Supabase content over the defaults in `src/content/siteContent.js`, so the site still works before you add any rows.
