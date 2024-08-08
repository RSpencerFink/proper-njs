
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@supabase/supabase-js'

export type State = {
    user: User | null
}

export type Actions = {
    addUser: (user: User | null) => void
}

export const useUserStore = create<State & Actions>()(set => ({
    user: {id: "", app_metadata: {}, user_metadata: {}, aud: "", created_at: ""},
    addUser: (user: User | null) =>
        set(state => ({
            user: user
        })),
}))