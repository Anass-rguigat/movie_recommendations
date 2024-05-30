import './Auth.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
// src/components/Auth/Login.js
import  { useState } from 'react';
import { useNavigate , Link } from 'react-router-dom';
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

    navigate('/'); 
  } catch (error) {
    console.error('Login failed:', error);
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
                <h1>LOGIN</h1>
                <form onSubmit={handleSubmit}>
                    {/* Username Input */}
                    <div className="form__group field">
                        <input type="email" className="form__field" placeholder="Email" id="email" name="email" onChange={handleChange} />
                        <label htmlFor="email" className="form__label">Email</label>
                    </div>
                    {/* Password Input */}
                    <div className="form__group field">
                        <input type="password" className="form__field" placeholder="Password" id="password" name="password" onChange={handleChange} />
                        <label htmlFor="password" className="form__label">Password</label>
                    </div>
                    {/* Login Button */}
                    <button type="submit" className="button">LOGIN</button>
                </form>
                {/* Custom Button */}
                <button className="cta">
                    <Link to='/register'>
                  <span className="hover-underline-animation"> Sign UP <FontAwesomeIcon icon={faArrowRight} /> </span>
                  </Link>
                </button>
            </div>
        </div>
    );
}

export default Login;
