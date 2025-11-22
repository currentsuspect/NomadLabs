
import { createClient } from '@supabase/supabase-js';

// Configuration provided by environment/user
// In a standard build, these would be process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_URL = 'https://nsetkbsbadllihqhmjud.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zZXRrYnNiYWRsbGlocWhtanVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4MTYxNzQsImV4cCI6MjA3OTM5MjE3NH0.1ndeZVyg8tlLn5LE48qOphQGruh-uqGkhHX2DVfb3fI';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
