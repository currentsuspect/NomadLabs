
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://nsetkbsbadllihqhmjud.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zZXRrYnNiYWRsbGlocWhtanVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4MTYxNzQsImV4cCI6MjA3OTM5MjE3NH0.1ndeZVyg8tlLn5LE48qOphQGruh-uqGkhHX2DVfb3fI';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testConnection() {
    console.log('Testing connection to:', SUPABASE_URL);

    try {
        const { data, error } = await supabase.from('posts').select('count', { count: 'exact', head: true });

        if (error) {
            console.error('Connection failed:', error.message);
            console.error('Full error:', error);
        } else {
            console.log('Connection successful!');
            console.log('Post count:', data); // data is null for head:true with count, but count is in count property? No, count is returned separately.
            // Actually with head:true data is null.
        }

        // Try to list one post
        const { data: posts, error: postsError } = await supabase.from('posts').select('*').limit(1);
        if (postsError) {
            console.error('Error listing posts:', postsError.message);
        } else {
            console.log('Successfully listed posts:', posts.length);
        }

    } catch (err) {
        console.error('Unexpected error:', err);
    }
}

testConnection();
