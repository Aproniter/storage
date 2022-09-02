import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
    token: string
    role: string
    isAuth: boolean
    error?: string
}

interface AuthPayload {
    token: string
    error?: string
    role: string
}

const initialState: AuthState = {
    token: sessionStorage.getItem('at') ?? '',
    isAuth: Boolean(sessionStorage.getItem('at')),
    error: '',
    role: ''
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        signin(state, action: PayloadAction<AuthPayload>){
            state.token = action.payload.token
            state.isAuth = Boolean(action.payload.token)
            state.role = action.payload.role
            state.error = action.payload.error
            sessionStorage.setItem('at', action.payload.token)
            sessionStorage.setItem('role', action.payload.role)
        },
        signout(state){
            state.token = ''
            state.role = ''
            state.error = ''
            state.isAuth = false
            sessionStorage.removeItem('at')
            sessionStorage.removeItem('role')
        }
    }
})

export default authSlice.reducer