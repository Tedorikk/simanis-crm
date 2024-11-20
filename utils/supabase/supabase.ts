import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://yvoxbgkggvacwpdgryof.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2b3hiZ2tnZ3ZhY3dwZGdyeW9mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE0NjgzNTQsImV4cCI6MjA0NzA0NDM1NH0.Lz7EkVYMUTfaCfmxAlXQMTIJy_jkATMe0exoQ8vUnew';

export const supabase = createClient(supabaseUrl, supabaseKey)