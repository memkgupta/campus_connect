import type { AuthState, User } from '@/types/index';

export type AuthAction =
  | { type: 'LOGIN_START' | 'REGISTER_START' | 'LOGOUT' }
  | { type: 'LOGIN_SUCCESS' | 'REGISTER_SUCCESS'; payload: User }
  | { type: 'AUTH_ERROR'; payload: string }
  | {type:'SET_SESSION';payload:User};

export const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  feed:null
};

export function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
    case 'REGISTER_START':
      return { ...state, isLoading: true };
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      return {
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      }
      case 'SET_SESSION':
        return {
          user:action.payload,
          isAuthenticated:true,
          isLoading:false
        }
    case 'AUTH_ERROR':
      return{
        user:null,
        isAuthenticated:false,
        isLoading:false
      }
    case 'LOGOUT':
      return {
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    default:
      return state;
  }
}