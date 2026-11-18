import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials in .env file')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// DB 타입은 Supabase 에서 생성한 공용 타입을 쓴다 (`pnpm gen:types`)
export type { Database } from '@tangram/shared'
