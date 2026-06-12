const SUPABASE_URL = 'https://xxpmvxcjnqwzrsbnqdsg.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4cG12eGNqbnF3enJzYm5xZHNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5OTE4OTAsImV4cCI6MjA5NjU2Nzg5MH0.VN4lZV0Bnh_5c3JjrDFFcceTxkaUNzWLvDcJ_EKWzxA';

const { createClient } = window.supabase;

// Criar cliente com sessão persistente — mantém login entre páginas
window.supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    persistSession: true,      // guarda sessão no localStorage
    autoRefreshToken: true,    // renova o token automaticamente
    detectSessionInUrl: true,
  }
});