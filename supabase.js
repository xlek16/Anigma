const SUPABASE_URL  = 'https://kpfrlivnrqqzajwpambo.supabase.co';
const SUPABASE_KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwZnJsaXZucnFxemFqd3BhbWJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2OTIxMjgsImV4cCI6MjA4NzI2ODEyOH0.aJZn3sfUGQp9j-5eUIK8hmYhBEPJxsSCk9OxUpOlCbM';

// Cria a instância do cliente Supabase e a disponibiliza como `supabaseClient`
// para evitar colisões com o objecto global fornecido pelo SDK.
window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);