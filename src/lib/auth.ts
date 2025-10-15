export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export const AUTH_STORAGE_KEY = 'quizmaster_auth';

export const getAuthState = (): AuthState => {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        user: parsed.user,
        isAuthenticated: !!parsed.user
      };
    }
  } catch (error) {
    console.error('Error parsing auth state:', error);
  }
  
  return {
    user: null,
    isAuthenticated: false
  };
};

export const getCurrentUser = (): User | null => {
  const authState = getAuthState();
  return authState.user;
};

export const setAuthState = (user: User | null): void => {
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user }));
  } catch (error) {
    console.error('Error saving auth state:', error);
  }
};

export const login = async (email: string, password: string): Promise<{ success: boolean; error?: string; user?: User }> => {
  // Mock authentication - in real app, this would call an API
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check if user exists in localStorage
    const users = getStoredUsers();
    const user = users.find(u => u.email === email);
    
    if (!user) {
      return { success: false, error: 'User not found' };
    }
    
    // In a real app, you'd verify the password hash
    // For now, we'll just check if password is not empty
    if (!password) {
      return { success: false, error: 'Invalid password' };
    }
    
    setAuthState(user);
    return { success: true, user };
  } catch (error) {
    return { success: false, error: 'Login failed' };
  }
};

export const signup = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string; user?: User }> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check if user already exists
    const users = getStoredUsers();
    if (users.find(u => u.email === email)) {
      return { success: false, error: 'User already exists' };
    }
    
    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      createdAt: new Date().toISOString()
    };
    
    // Store user
    users.push(newUser);
    localStorage.setItem('quizmaster_users', JSON.stringify(users));
    
    setAuthState(newUser);
    return { success: true, user: newUser };
  } catch (error) {
    return { success: false, error: 'Signup failed' };
  }
};

export const logout = (): void => {
  setAuthState(null);
};

const getStoredUsers = (): User[] => {
  try {
    const stored = localStorage.getItem('quizmaster_users');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};