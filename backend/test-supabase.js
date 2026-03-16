const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://makjlmjrtumszoasxdov.supabase.co';
const supabaseKey = 'mock-key';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  try {
    console.log('Testing Supabase connection...');
    const { data, error } = await supabase.auth.getSession();
    console.log('Result:', error ? error.message : 'Success');
  } catch (e) {
    console.error('Exception:', e);
  }
}
test();
