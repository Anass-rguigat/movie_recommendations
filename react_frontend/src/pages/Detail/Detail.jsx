import { useState, useEffect} from "react";
import Footer from '../../Components/Footer/Footer'
import MovieDetails from '../../Components/MovieDetails/MovieDetails'
import Navbar from '../../Components/Navbar/Navbar'
import './Detail.css'
import { getUser } from '../../api/auth';
import { useNavigate, useLocation } from 'react-router-dom';
import Loading from "../../Components/loadingAnimation/Loading";

const Detail = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const location = useLocation();
  const { movie } = location.state || {}; 
  // console.log(movie);
  
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
                <MovieDetails movie={movie}/>
            </div>
              <Footer />
        </header>
        ) : (
          <Loading />
        )} 
    </div>
  )
}

export default Detail
