require('dotenv').config({ path: './.env' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function test() {
    const email = 'dummy123@example.com';
    const password = 'password123';
    
    // 2. Sign in with anon key to get valid session token
    const anonSupabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
    const { data: { session }, error } = await anonSupabase.auth.signInWithPassword({ email, password });
    
    if (error) { console.error("SignIn Error:", error); return; }
    
    // 3. Try to get user with the service role client
    const token = session.access_token;
    const { data: { user }, error: getError } = await supabase.auth.getUser(token);
    console.log("Get User Error:", getError);
    console.log("Got user:", user ? "YES" : "NO");
}
test();
