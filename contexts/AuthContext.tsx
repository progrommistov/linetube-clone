
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { type User } from '../types';
import { MOCK_USERS } from '../constants';

type ProfileUpdates = Partial<Pick<User, 'username' | 'avatarUrl' | 'bannerUrl'>>;

interface AuthContextType {
  currentUser: User | null;
  users: User[];
  login: (username: string, password?: string) => boolean;
  logout: () => void;
  signup: (username: string, password?: string) => boolean;
  toggleSubscription: (channelId: string) => void;
  updateUserSubscribers: (userId: string, count: number) => void;
  getUserById: (userId: string) => User | undefined;
  deleteUser: (userId: string) => void;
  toggleAdminStatus: (userId: string) => void;
  updateUserProfile: (userId: string, updates: ProfileUpdates) => { success: boolean, suggestions?: string[] };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_STORAGE_KEY = 'yt-users';
const CURRENT_USER_STORAGE_KEY = 'yt-currentUser';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
      if (!storedUsers) {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(MOCK_USERS));
        return MOCK_USERS;
      }
      return JSON.parse(storedUsers);
    } catch (error) {
      console.error("Failed to initialize users from localStorage", error);
      return MOCK_USERS;
    }
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const storedUser = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      return null;
    }
  });

  useEffect(() => {
    try {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (error) {
        console.error("Failed to save users to localStorage", error);
    }
  }, [users]);

  const login = (username: string, password?: string): boolean => {
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (user && user.password === password) {
      setCurrentUser(user);
      localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
  };

  const signup = (username: string, password?: string): boolean => {
    if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
      return false; 
    }
    if(!password) return false;

    const newUser: User = {
      id: `user_${Date.now()}`,
      username,
      password,
      avatarUrl: `https://picsum.photos/seed/${username}/48/48`,
      subscriptions: [],
      isAdmin: false,
      subscribers: 0,
    };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    setCurrentUser(newUser);
    localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(newUser));
    return true;
  };

  const toggleSubscription = (channelId: string) => {
    if (!currentUser || currentUser.id === channelId) return;
    
    const isSubscribed = currentUser.subscriptions.includes(channelId);
    
    const updatedSubscriptions = isSubscribed
      ? currentUser.subscriptions.filter(id => id !== channelId)
      : [...currentUser.subscriptions, channelId];
      
    const updatedCurrentUser = { ...currentUser, subscriptions: updatedSubscriptions };
    setCurrentUser(updatedCurrentUser);
    localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(updatedCurrentUser));
    
    const updatedUsers = users.map(u => {
      if (u.id === currentUser.id) return updatedCurrentUser;
      if (u.id === channelId) return { ...u, subscribers: u.subscribers + (isSubscribed ? -1 : 1) };
      return u;
    });
    setUsers(updatedUsers);
  };

  const updateUserSubscribers = (userId: string, count: number) => {
    setUsers(prevUsers => {
      const newUsers = prevUsers.map(user => {
        if (user.id === userId) return { ...user, subscribers: count };
        return user;
      });
      if (currentUser?.id === userId) {
        const updatedCurrentUser = newUsers.find(u => u.id === userId);
        if (updatedCurrentUser) {
          setCurrentUser(updatedCurrentUser);
          localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(updatedCurrentUser));
        }
      }
      return newUsers;
    });
  };

  const deleteUser = (userId: string) => {
    if (currentUser?.id === userId) {
        alert("You cannot delete yourself.");
        return;
    }
    setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
  };

  const toggleAdminStatus = (userId: string) => {
    if (currentUser?.id === userId) {
        alert("You cannot change your own admin status.");
        return;
    }
     setUsers(prevUsers => prevUsers.map(user => 
        user.id === userId ? { ...user, isAdmin: !user.isAdmin } : user
    ));
  };

  const updateUserProfile = (userId: string, updates: ProfileUpdates): { success: boolean, suggestions?: string[] } => {
    const userToUpdate = users.find(u => u.id === userId);
    if (!userToUpdate) return { success: false };

    // Check for username uniqueness if it's being changed
    if (updates.username && updates.username !== userToUpdate.username) {
        const isTaken = users.some(u => u.username.toLowerCase() === updates.username?.toLowerCase());
        if (isTaken) {
            const suggestions = [
                `${updates.username}${Math.floor(Math.random() * 100)}`,
                `${updates.username}_${Math.floor(Math.random() * 10)}`,
                `The${updates.username}`
            ];
            return { success: false, suggestions };
        }
    }

    const updatedUsers = users.map(user => {
        if (user.id === userId) {
            return { ...user, ...updates };
        }
        return user;
    });

    setUsers(updatedUsers);

    if (currentUser?.id === userId) {
        const updatedCurrentUser = updatedUsers.find(u => u.id === userId);
        if (updatedCurrentUser) {
            setCurrentUser(updatedCurrentUser);
            localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(updatedCurrentUser));
        }
    }
     return { success: true };
  };

  const getUserById = (userId: string) => users.find(u => u.id === userId);

  return (
    <AuthContext.Provider value={{ currentUser, users, login, logout, signup, toggleSubscription, updateUserSubscribers, getUserById, deleteUser, toggleAdminStatus, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};