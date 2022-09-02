import axios from 'axios'
import { AppDispatch } from '../index'
import { authSlice } from '../slices/authSlice';

const baseUrl = process.env.REACT_APP_BASE_URL || ''


interface AuthResponse {
    token: string
    detail?: string
    user: {
        email: string
        first_name: string
        id: number
        last_name: string
        username: string
        role:string
    }

}

interface AuthData {
    email: string
    password: string
    first_name?: string
    last_name?: string
    username?: string
}

export const signin = (data: AuthData) => {
    return async (dispatch: AppDispatch) => {
        try {
            let response
            if(data.first_name && data.last_name){
                response = await axios.post<AuthResponse>(baseUrl+'signup/', data);
            } else {
                response = await axios.post<AuthResponse>(baseUrl+'login/', data);
            }
            
            dispatch(authSlice.actions.signin({
                token: response.data.token,
                error: response.data.detail,
                role: response.data.user.role
            }))
        } catch (e) {
            throw e;
        }
    }
}