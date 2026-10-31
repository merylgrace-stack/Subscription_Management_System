import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('brightloop_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return {
      id: 1,
      name: 'Alex Drake',
      email: 'admin@brightloop.io',
      role: 'admin', // 'admin' | 'staff' | 'finance' | 'customer'
      avatar: 'AD',
      unreadNotifications: 3,
    };
  });

  const [token, setToken] = useState(() => localStorage.getItem('brightloop_token') || 'demo_token');

  useEffect(() => {
    localStorage.setItem('brightloop_user', JSON.stringify(user));
  }, [user]);

  const switchRole = async (newRole) => {
    let name = 'Alex Drake';
    let email = 'admin@brightloop.io';
    let pass = 'AdminPass123!';
    let avatar = 'AD';

    if (newRole === 'staff') {
      name = 'Sarah Connor';
      email = 'staff@brightloop.io';
      pass = 'StaffPass123!';
      avatar = 'SC';
    } else if (newRole === 'finance') {
      name = 'Frank Miller';
      email = 'finance@brightloop.io';
      pass = 'FinancePass123!';
      avatar = 'FM';
    } else if (newRole === 'customer') {
      name = 'Acme Corp (John)';
      email = 'john@acme.com';
      pass = 'CustomerPass123!';
      avatar = 'AC';
    }

    const updatedUser = {
      ...user,
      role: newRole,
      name,
      email,
      avatar,
    };
    setUser(updatedUser);
    localStorage.setItem('brightloop_user', JSON.stringify(updatedUser));

    // Automatically obtain fresh JWT token from backend
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.access) {
          setToken(data.access);
          localStorage.setItem('brightloop_token', data.access);
        }
      }
    } catch (e) {
      console.warn('Backend login attempt:', e);
    }
  };

  // Initial token verification on mount
  useEffect(() => {
    if (!token || token === 'demo_token') {
      fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user?.email || 'admin@brightloop.io', password: 'AdminPass123!' }),
      })
      .then(r => r.json())
      .then(data => {
        if (data.access) {
          setToken(data.access);
          localStorage.setItem('brightloop_token', data.access);
        }
      })
      .catch(() => {});
    }
  }, []);

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('brightloop_user');
    localStorage.removeItem('brightloop_token');
  };

  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('brightloop_user', JSON.stringify(userData));
    localStorage.setItem('brightloop_token', userToken);
  };

  return (
    <AuthContext.Provider value={{ user, token, switchRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
