import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import './Navbar.css';
import { logout } from '../../api/auth';
import { useNavigate , Link} from 'react-router-dom';

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();

    const handleMenuToggle = () => {
        setMenuOpen(!menuOpen);
    };
    const handleLogout = async () => {
        try {
          await logout();
          localStorage.removeItem('token'); // Remove token from local storage
          navigate('/login'); // Redirect to login page
        } catch (error) {
          console.log('Failed to logout: '+ error.message);
        }
      };

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    
    return (
        <div className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        {/* <div className="navbar"> */}
            <div className="nav-logo">RANDMOVIE</div>
            <FontAwesomeIcon icon={faBars} className="burger-icon" onClick={handleMenuToggle} />
            <ul className={`nav-menu ${menuOpen ? 'open' : ''}`}>
                <li className='nav-link'> <Link to="/">Recommend</Link></li>
                <li className='nav-link'><Link to="/top-10">Top 10</Link></li>
                <li className='nav-link'><Link to="/wallet">Wallet</Link></li>
                <button onClick={handleLogout}>
                <div className="text">
                        <span>logout</span>
                </div>
                <div className="clone">
                    <span>Logout</span>
                </div>
                <svg
                    strokeWidth="2"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    width="20px"
                >
                    <path
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    ></path>
                </svg>
                </button>
            </ul>
        </div>
    );
};

export default Navbar;
