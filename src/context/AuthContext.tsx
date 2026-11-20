import React, { createContext, useContext, useState, useEffect } from 'react';
import { Profile, UserRole } from '../types/database';
import { DEMO_PROFILES, StorageService } from '../lib/storage';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

interface AuthContextType {
  currentUser: Profile | null;
  role: UserRole;
  switchRole: (role: UserRole) => void;
  login: (email: string, role?: UserRole) => Promise<boolean>;
  register: (name: string, email: string, role: UserRole, phone?: string, credentials?: string) => Promise<boolean>;
  updateProfile: (updates: Partial<Pick<Profile, 'full_name' | 'phone' | 'organization'>>) => void;
  logout: () => void;
  unreadCount: number;
  isLiveSupabase: boolean;
  refreshNotifications: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<Profile | null>(() => {
    try {
      const saved = localStorage.getItem('hostelsafe_active_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse saved user', e);
    }
    // Default to student role for immediate accommodation discovery and safety reporting
    return DEMO_PROFILES.student;
  });

  const [unreadCount, setUnreadCount] = useState<number>(0);

  const refreshNotifications = () => {
    if (!currentUser) {
      setUnreadCount(0);
      return;
    }
    const notifs = StorageService.getNotifications(currentUser.id);
    const unread = notifs.filter((n) => !n.read_at).length;
    setUnreadCount(unread);
  };

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('hostelsafe_active_user', JSON.stringify(currentUser));
      refreshNotifications();
    } else {
      localStorage.removeItem('hostelsafe_active_user');
      setUnreadCount(0);
    }
  }, [currentUser]);

  const switchRole = (newRole: UserRole) => {
    const profile = DEMO_PROFILES[newRole] || {
      id: `u-${newRole}-${Date.now()}`,
      full_name: `${newRole.toUpperCase()} User`,
      email: `${newRole}@hostelsafe.ng`,
      role: newRole,
      created_at: new Date().toISOString(),
    };
    setCurrentUser(profile);
  };

  const login = async (email: string, requestedRole?: UserRole): Promise<boolean> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: 'Password123!',
        });
        if (error) {
          console.warn('Supabase auth sign in error, fallback to profile search', error.message);
        } else if (data.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();
          if (profile) {
            setCurrentUser(profile);
            return true;
          }
        }
      } catch (err) {
        console.warn('Live Supabase query failed:', err);
      }
    }

    // Match demo accounts or create logged-in profile
    const matchedRole = Object.keys(DEMO_PROFILES).find(
      (k) => DEMO_PROFILES[k].email.toLowerCase() === email.toLowerCase()
    );

    if (matchedRole) {
      setCurrentUser(DEMO_PROFILES[matchedRole]);
      return true;
    }

    const fallbackRole = requestedRole || 'student';
    const newProfile: Profile = {
      id: `user-${Date.now()}`,
      full_name: email.split('@')[0].replace(/[._]/g, ' '),
      email,
      role: fallbackRole,
      phone: '+234 800 000 0000',
      created_at: new Date().toISOString(),
    };
    setCurrentUser(newProfile);
    return true;
  };

  const register = async (
    name: string,
    email: string,
    role: UserRole,
    phone?: string,
    credentials?: string
  ): Promise<boolean> => {
    const newProfile: Profile = {
      id: `u-${Date.now()}`,
      full_name: name,
      email,
      role,
      phone: phone || '+234 800 000 0000',
      credentials_info: credentials,
      is_verified_inspector: role === 'inspector' ? false : undefined, // Inspectors require admin verification
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('profiles').insert(newProfile);
      } catch (e) {
        console.warn('Failed to insert into live Supabase', e);
      }
    }

    setCurrentUser(newProfile);
    return true;
  };

  const updateProfile = (updates: Partial<Pick<Profile, 'full_name' | 'phone' | 'organization'>>) => {
    setCurrentUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      if (isSupabaseConfigured && supabase) {
        supabase
          .from('profiles')
          .update(updates)
          .eq('id', prev.id)
          .then(({ error }) => {
            if (error) console.warn('Profile sync skipped:', error.message);
          });
      }
      return updated;
    });
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role: currentUser?.role || 'student',
        switchRole,
        login,
        register,
        updateProfile,
        logout,
        unreadCount,
        isLiveSupabase: isSupabaseConfigured,
        refreshNotifications,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
