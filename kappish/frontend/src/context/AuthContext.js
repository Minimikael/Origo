import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For demonstration purposes, provide a mock user
    const mockUser = {
      uid: 'demo-user-123',
      email: 'demo@kappish.com',
      displayName: 'Demo User'
    };
    
    // Set mock user immediately for demo
    setUser(mockUser);
    setLoading(false);
    
    // Comment out Firebase auth for demo
    // const unsubscribe = onAuthStateChanged(auth, (user) => {
    //   setUser(user);
    //   setLoading(false);
    // });
    // return unsubscribe;
  }, []);

  const signIn = async (email, password) => {
    // Mock authentication for demo
    if (email === 'demo@kappish.com' && password === 'demo123') {
      const mockUser = {
        uid: 'demo-user-123',
        email: email,
        displayName: 'Demo User'
      };
      setUser(mockUser);
      return { success: true, user: mockUser };
    } else {
      return { success: false, error: 'Invalid credentials' };
    }
  };

  const signUp = async (email, password) => {
    // Mock registration for demo
    const mockUser = {
      uid: 'demo-user-123',
      email: email,
      displayName: email.split('@')[0]
    };
    setUser(mockUser);
    return { success: true, user: mockUser };
  };

  const logout = async () => {
    setUser(null);
    return { success: true };
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 