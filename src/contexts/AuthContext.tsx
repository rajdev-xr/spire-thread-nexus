
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "@/components/ui/sonner";

// Define types
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Mock users for demo purposes
const MOCK_USERS = [
  {
    id: "1",
    name: "Demo User",
    email: "demo@threadspire.com",
    password: "password123",
    avatar: "",
    createdAt: new Date().toISOString()
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@threadspire.com",
    password: "password123",
    avatar: "",
    createdAt: new Date().toISOString()
  }
];

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for saved user on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('threadspire_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('threadspire_user');
      }
    }
    setIsLoading(false);
  }, []);

  // Login logic
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Find user
      const foundUser = MOCK_USERS.find(u => u.email === email);
      
      // Validate credentials
      if (!foundUser || foundUser.password !== password) {
        throw new Error("Invalid email or password");
      }
      
      // Create authenticated user object (without password)
      const authenticatedUser = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        avatar: foundUser.avatar,
        createdAt: foundUser.createdAt
      };
      
      // Save user to state and localStorage
      setUser(authenticatedUser);
      localStorage.setItem('threadspire_user', JSON.stringify(authenticatedUser));
      toast.success("Login successful!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register logic
  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Check if email already exists
      if (MOCK_USERS.some(u => u.email === email)) {
        throw new Error("Email already registered");
      }
      
      // Create new user
      const newUser = {
        id: (MOCK_USERS.length + 1).toString(),
        name,
        email,
        password, // In a real app, this would be hashed
        avatar: "",
        createdAt: new Date().toISOString()
      };
      
      // Add to mock users (in a real app, this would save to database)
      MOCK_USERS.push(newUser);
      
      // Create authenticated user object (without password)
      const authenticatedUser = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        avatar: newUser.avatar,
        createdAt: newUser.createdAt
      };
      
      // Save user to state and localStorage
      setUser(authenticatedUser);
      localStorage.setItem('threadspire_user', JSON.stringify(authenticatedUser));
      toast.success("Registration successful!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Registration failed");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout logic
  const logout = () => {
    setUser(null);
    localStorage.removeItem('threadspire_user');
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
