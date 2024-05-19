// src/components/Auth/Logout.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../api/auth';
import useAuth from '../../hooks/useAuth';

const Logout = () => {
  const navigate = useNavigate(); 
  const { setUser } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default Logout;
