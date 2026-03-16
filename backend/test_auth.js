require('dotenv').config({ path: './.env' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function test() {
    // 1. Create a dummy user
    const email = 'dummy123@example.com';
    const password = 'password123';
    await supabase.auth.admin.createUser({ email, password, email_confirm: true, user_metadata: { role: 'citizen' } });
    
    // 2. Sign in with anon key to get valid session token
    const anonSupabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
    const { data: { session }, error } = await anonSupabase.auth.signInWithPassword({ email, password });
    
    if (error) { console.error("SignIn Error:", error); return; }
    
    // 3. Make the Axios request locally to the backend
    const axios = require('axios');
    try {
        const res = await axios.get('http://localhost:5000/api/eligibility/verify', {
            headers: { Authorization: `Bearer ${session.access_token}` }
        });
        console.log("SUCCESS:");
        console.log(res.data);
    } catch (e) {
        console.log("AXIOS ERROR:");
        console.log(e.response ? e.response.data : e.message);
    }
}
test();
