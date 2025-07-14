import { createClient } from '@supabase/supabase-js';

// Fallback values for development - replace with your actual Supabase credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

// Check if we have valid Supabase credentials
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.warn('⚠️ Supabase environment variables not found. Please set up your Supabase credentials.');
  console.warn('Create a .env.local file with:');
  console.warn('NEXT_PUBLIC_SUPABASE_URL=your_supabase_url');
  console.warn('NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);