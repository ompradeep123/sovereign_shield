require("dotenv").config();
const supabase = require('./lib/supabaseClient');

async function test() {
    const { error } = await supabase.from('citizens').upsert({
        id: "2883165d-0cf0-4bf9-be46-e310d7cf1b4f",
        email: "test_upsert@example.com",
        role: "citizen"
    }, { onConflict: "id" });
    console.log("Upsert Error:", error);
}
test();
