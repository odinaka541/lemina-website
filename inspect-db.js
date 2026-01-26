
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://gihfvmxhxwdqqufxtpzk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpaGZ2bXhoeHdkcXF1Znh0cHprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0MTY4MzAsImV4cCI6MjA3Nzk5MjgzMH0.6nk_M1BNIYVxr6GGfXegEVDmwEIqLyRt7684zxb2L64';

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspect() {
    console.log('Fetching one company from DB...');
    const { data, error } = await supabase
        .from('companies')
        .select(`
      *,
      funding_rounds(*),
      metrics(*),
      regulatory_info(*)
    `)
        .limit(1);

    if (error) {
        console.error('Error fetching companies:', error);
    } else {
        console.log('Company Data Structure:');
        if (data && data.length > 0) {
            console.log(JSON.stringify(data[0], null, 2));
        } else {
            console.log('No companies found in DB.');
        }
    }
}

inspect();
