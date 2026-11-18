import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials in .env file')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

export type Database = {
  public: {
    Tables: {
      tangrams: {
        Row: {
          id: string
          key: string
          json_url: string | null
          thumbnail_url: string | null
          difficulty: number
          show_answer_preview: boolean
          view_count: number
          download_count: number
          created_at: string
          updated_at: string
          deleted_at: string | null
          user_id: string
        }
        Insert: {
          id?: string
          key: string
          json_url?: string | null
          thumbnail_url?: string | null
          difficulty: number
          show_answer_preview?: boolean
          view_count?: number
          download_count?: number
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
          user_id: string
        }
        Update: {
          key?: string
          json_url?: string | null
          thumbnail_url?: string | null
          difficulty?: number
          show_answer_preview?: boolean
          view_count?: number
          download_count?: number
          updated_at?: string
          deleted_at?: string | null
        }
      }
      contacts: {
        Row: {
          id: string
          email: string
          title: string
          contents: string
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          title: string
          contents: string
          status?: string
          created_at?: string
        }
        Update: {
          email?: string
          title?: string
          contents?: string
          status?: string
        }
      }
      translation_meta: {
        Row: {
          id: string
          key: string
          ko: string
          en: string
          ja: string
          created_at: string
        }
        Insert: {
          id?: string
          key: string
          ko: string
          en: string
          ja: string
          created_at?: string
        }
        Update: {
          key?: string
          ko?: string
          en?: string
          ja?: string
        }
      }
    }
  }
}
