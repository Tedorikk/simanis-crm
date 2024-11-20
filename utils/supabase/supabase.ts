import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://yvoxbgkggvacwpdgryof.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2b3hiZ2tnZ3ZhY3dwZGdyeW9mIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMTQ2ODM1NCwiZXhwIjoyMDQ3MDQ0MzU0fQ.VkefOC087vbixAyr2IwFjWl5NzNn6EZiF7HuBSU4tIc';

export const supabase = createClient(supabaseUrl, supabaseKey)