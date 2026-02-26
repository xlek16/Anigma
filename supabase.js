const SUPABASE_URL = 'https://kpfrlivnrqqzajwpambo.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwZnJsaXZucnFxemFqd3BhbWJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2OTIxMjgsImV4cCI6MjA4NzI2ODEyOH0.aJZn3sfUGQp9j-5eUIK8hmYhBEPJxsSCk9OxUpOlCbM';

const { createClient } = window.supabase;

// Criar cliente com sessão persistente — mantém login entre páginas
window.supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    persistSession: true,      // guarda sessão no localStorage
    autoRefreshToken: true,    // renova o token automaticamente
    detectSessionInUrl: true,
  }
});