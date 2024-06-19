import './Auth.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../../api/auth';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

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
      if (error.response && error.response.status === 422) {
        const errors = error.response.data.errors;
        if (errors.email) {
          setError(errors.email[0]);
        } else if (errors.password) {
          setError(errors.password[0]);
        } else if (errors.credentials) {
          setError(errors.credentials[0]);
        } else {
          setError('Unknown error occurred.');
        }
      } else {
        setError('Login failed. Please try again later.');
      }
    }
  };

  return (
    <div className="container-login">
      <div className="image">
        <img
          src="https://assets.nflxext.com/ffe/siteui/vlv3/a99688ca-33c3-4099-9baa-07a2e2acb398/909335d4-2d4a-40d8-85ab-042acc857be7/MA-fr-20240520-popsignuptwoweeks-perspective_alpha_website_small.jpg"
          alt="Placeholder Image"
        />
      </div>
      <div className="form">
        <h1>LOGIN</h1>
        {error && <p className="error" style={{ color: "red" }}>{error}</p>} {/* Display error message */}
        <form onSubmit={handleSubmit}>
          <div className="form__group field">
            <input
              type="email"
              className="form__field"
              placeholder="Email"
              id="email"
              name="email"
              onChange={handleChange}
            />
            <label htmlFor="email" className="form__label">Email</label>
          </div>
          <div className="form__group field">
            <input
              type="password"
              className="form__field"
              placeholder="Password"
              id="password"
              name="password"
              onChange={handleChange}
            />
            <label htmlFor="password" className="form__label">Password</label>
          </div>
          <button type="submit" className="button">LOGIN</button>
        </form>
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
