import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { User } from '@/lib/types'
import { storage, PERSIST_KEYS } from '@/lib/utils/storage'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

const persistedAuth = storage.get<AuthState>(PERSIST_KEYS.auth, {
  user: null,
  isAuthenticated: false,
  isLoading: false,
});

const initialState: AuthState = persistedAuth

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      state.isAuthenticated = true
      state.isLoading = false
      storage.set(PERSIST_KEYS.auth, state)
    },
    loginFailure: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.isLoading = false
      storage.set(PERSIST_KEYS.auth, state)
    },
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.isLoading = false
      storage.set(PERSIST_KEYS.auth, state)
    },
  },
})

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions
export default authSlice.reducer