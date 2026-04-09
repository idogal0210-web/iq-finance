import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://yjmjoynhveogwkvxtcnn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqbWpveW5odmVvZ3drdnh0Y25uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3NjMyMjQsImV4cCI6MjA5MTMzOTIyNH0.1SSFhJY4Cv_faGbHO7rBnvlikPdYwteQlJh8HjQKjV4';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
