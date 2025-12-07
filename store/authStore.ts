import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    // Actions
    login: (user: User, token: string) => void;
    logout: () => void;
    setLoading: (isLoading: boolean) => void;
    setError: (error: string | null) => void;
    loadUserFromStorage: () => void;
}

// Read initial state from storage
const getInitialState = () => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    let user = null;

    if (userStr) {
        try {
            user = JSON.parse(userStr);
        } catch (e) {
            console.error('Failed to parse user from storage');
            localStorage.removeItem('user');
        }
    }

    return {
        token,
        user,
        isAuthenticated: !!(token && user)
    };
};

export const useAuthStore = create<AuthState>((set) => {
    const initialState = getInitialState();

    return {
        ...initialState,
        isLoading: false,
        error: null,

        login: (user, token) => {
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            set({ user, token, isAuthenticated: true, error: null });
        },

        logout: () => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            set({ user: null, token: null, isAuthenticated: false, error: null });
        },

        setLoading: (isLoading) => set({ isLoading }),

        setError: (error) => set({ error }),

        loadUserFromStorage: () => {
            // Re-sync if needed, though initial state handles the boot
            const state = getInitialState();
            set({ ...state });
        }
    };
});
