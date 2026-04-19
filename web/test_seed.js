const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://puprmtfdjsuiqlvtqfrh.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1cHJtdGZkanN1aXFsdnRxZnJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3NzYwNTQsImV4cCI6MjA5MDM1MjA1NH0.53vsuQ3DXw-frHhf8z1TBROcg1aMBkVd6vzgWr1ZpHM';
const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
    console.log("Starting script via auth.signUp...");
    const { data, error } = await supabase.auth.signUp({
        email: "test_seed_user@example.com",
        password: "Password123!",
        options: {
            data: {
                full_name: "Test User",
                role: "user"
            }
        }
    });

    if (error) {
        console.error("Error signing up:", error);
    } else {
        console.log("Success:", data.user?.id);
    }
}

seed();
