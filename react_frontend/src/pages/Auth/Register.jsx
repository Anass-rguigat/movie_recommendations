import './Auth.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
// src/components/Auth/Login.js
import  { useState } from 'react';
import { useNavigate , Link } from 'react-router-dom';
import { register } from '../../api/auth';
const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await register({ name, email, password });
      const token = response.data.access_token;
      localStorage.setItem('token', token); 
      navigate('/');
    } catch (error) {
      console.error('Registration failed', error);
    }
  };
    return (
        <div className="container-login">
            {/* Left: Image */}
            <div className="image">
                <img src="https://assets.nflxext.com/ffe/siteui/vlv3/a99688ca-33c3-4099-9baa-07a2e2acb398/909335d4-2d4a-40d8-85ab-042acc857be7/MA-fr-20240520-popsignuptwoweeks-perspective_alpha_website_small.jpg" alt="Placeholder Image" />
            </div>
            {/* Right: Login Form */}
            <div className="form">
                <h1>SIGN UP</h1>
                <form onSubmit={handleSubmit}>
                    {/* Username Input */}
                    <div className="form__group field">
                        <input type="text" value={name} className="form__field" placeholder="Username" id="name" name="name" onChange={(e) => setName(e.target.value)} />
                        <label htmlFor="Username" className="form__label">Username</label>
                    </div>
                    {/* email Input */}
                    <div className="form__group field">
                        <input type="email" className="form__field" placeholder="Email" id="email" value={email} name="email" onChange={(e) => setEmail(e.target.value)}/>
                        <label htmlFor="email" className="form__label">Email</label>
                    </div>
                    {/* Password Input */}
                    <div className="form__group field">
                        <input type="password" className="form__field" placeholder="Password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <label htmlFor="password" className="form__label">Password</label>
                    </div>
                    {/* Login Button */}
                    <button type="submit" className="button">SIGN UP</button>
                </form>
                {/* Custom Button */}
                < button className="cta">
                  <Link to="/login">
                  <span className="hover-underline-animation"> Login <FontAwesomeIcon icon={faArrowRight} /> </span>
                  </Link>
                </ button>
            </div>
        </div>
    );
}

export default Register;
