import { createClient } from '@supabase/supabase-js'
import type { Database } from '@tangram/shared'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials in .env file')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey)

// DB 스키마 타입은 `pnpm gen:types` 가 생성하는 @tangram/shared 가 단일 출처다.
// 예전에는 이 파일이 손으로 쓴 Database 타입을 따로 들고 있었고, 실제 스키마와 어긋나 있었다
// (tangrams.id 가 string, contacts.status 가 string, profiles 누락 등).
export type { Database }
