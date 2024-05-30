import { useState, useEffect} from "react";
import Footer from '../../Components/Footer/Footer'
import MovieDetails from '../../Components/MovieDetails/MovieDetails'
import Navbar from '../../Components/Navbar/Navbar'
import './Detail.css'
import { getUser } from '../../api/auth';
import { useNavigate } from 'react-router-dom';

const Detail = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUser();
        setUser(response.user);
      } catch (error) {
        setError('Failed to fetch user data: ' + error.message);
        navigate('/login')
      }
    };

    fetchUser();
  }, []);
  return (
    <div>
      {error ? (
        <p>Error: {error}</p>
      ) : user ? (
      <header className="header-top">
            <Navbar />
            <div>
                <MovieDetails />
            </div>
              <Footer />
        </header>
        ) : (
          <p>Loading...</p>
        )}
    </div>
  )
}

export default Detail
