// src/components/Auth/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api/auth';

const Login = () => {
//   const history = useHistory();
const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(formData);
      const token = response.data.access_token; 
      localStorage.setItem('token', token); 

      navigate('/profile'); 
    } catch (error) {
      console.error('===---Login failed:', error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" className='form-control w-50 m-3' placeholder="Email" onChange={handleChange} />
        <input type="password" name="password" className='form-control w-50 m-3' placeholder="Password" onChange={handleChange} />
        <button type="submit" className='btn btn-outline-dark m-3'>Login</button>
      </form>
    </div>
  );
};

export default Login;
