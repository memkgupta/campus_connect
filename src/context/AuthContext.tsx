'use client'
import React, { createContext, useReducer, useCallback, useEffect } from 'react';
import type { User, AuthState, LoginCredentials, RegisterCredentials } from '@/types/index';
import { authReducer, initialState } from '@/reducer/authReducer';
import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie'
import { toast } from '@/components/ui/use-toast';
import { BACKEND_URL } from '@/constants';
interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      dispatch({ type: 'LOGIN_START' });
      // Simulate API call
      const request = await axios.post(`http://localhost:8080/api/v1/auth/login`,{usernameOrEmail:credentials.email,password:credentials.password});
      if(!request.data.success){
        throw new Error(request.data.message);
      }
      const user = request.data.user;
      const accessToken = request.data.accessToken
const refreshToken = request.data.refreshToken;
Cookies.set('access-token',accessToken,{
  expires:1
});
Cookies.set('refreshToken',refreshToken,{expires:30});
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
     
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR', payload: 'Login failed' });
      throw error;
    }
  }, []);

  // const register = useCallback(async (credentials: RegisterCredentials) => {
  //   try {
  //     dispatch({ type: 'VERIFICATION_START' });
  //     // Simulate API call
  //     const response = await new Promise<User>((resolve) =>
  //       setTimeout(() => resolve({
  //         id: '1',
  //         email: credentials.email,
  //         name: 'John Doe',
  //         verified:true,
  //         username:'ff'
  //       }), 1000)
  //     );
  //     dispatch({ type: 'REGISTER_SUCCESS', payload: response });
  //     localStorage.setItem('user', JSON.stringify(response));
  //   } catch (error) {
  //     dispatch({ type: 'AUTH_ERROR', payload: 'Registration failed' });
  //     throw error;
  //   }
  // }, []);
const fetchSession = async()=>{
const token = Cookies.get('access-token');
// const refreshToken = Cookies.get('refresh-token')
if(token){
try {
  const request = await axios.get(`http://localhost:8080/api/v1/auth/session`,{headers:{
    'Authorization':`Bearer ${token}`
  }});
  const user = request.data.user;
dispatch({type:'SET_SESSION',payload:user})
} catch (error) {
  const axiosError = error as AxiosError<any>
  if(axiosError.status!=500){
    try {
    const refreshRequest = await axios.post(`http://localhost:8080/api/v1/auth/refresh-token`,{},{withCredentials:true});
      if(refreshRequest.data.success){
        Cookies.set('access-token',refreshRequest.data.accessToken,{expires:1});
        fetchSession();
      }
    } catch (error) {
      console.log(error);
    }
  }

}

}
else{
  try {
    const refreshRequest = await axios.post(`http://localhost:8080/api/v1/auth/refresh-token`,{},{withCredentials:true});
      if(refreshRequest.data.success){
        Cookies.set('access-token',refreshRequest.data.accessToken,{expires:1});
        fetchSession();
      }
    } catch (error) {
      console.log(error);
    }
  }

}
  const logout = useCallback(async () => {

    const token = Cookies.get('access-token');
if(!token){
throw new Error("Please login first");
}
    try {
      dispatch({ type: 'LOGOUT' });
      const request = await axios.post(`${BACKEND_URL}/auth/logout`,{},{headers:{'Authorization':`Bearer ${token}`}});
      Cookies.remove('access-token');
    } catch (error) {
      toast({
        title:"Some error occured",
        variant:"destructive"
      })
    }
  
  }, []);

  const value = {
    ...state,
    login,
    logout,
  };

useEffect(()=>{
fetchSession();
},[])

  return (<AuthContext.Provider value={value}>{children}</AuthContext.Provider>)
}