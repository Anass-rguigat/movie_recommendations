import React, { useState, useEffect } from "react";
import Background from "../../Components/Background/Background";
import Navbar from "../../Components/Navbar/Navbar";
import Hero from "../../Components/Hero/Hero";
import Card from "../../Components/Cards/Card";
import Footer from "../../Components/Footer/Footer";
import { getUser } from '../../api/auth';
import { getHybridRecommendations } from '../../api/hybrid';
import { useNavigate } from "react-router-dom";
import Loading from "../../Components/loadingAnimation/Loading";
import axios from "axios";
import MovieRating from "../../Components/MovieRating/Movierating";

const Home = () => {
  const [heroData, setHeroData] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [heroCount, setHeroCount] = useState(0);
  const [playStatus, setPlayStatus] = useState(false);
  const [hasRated, setHasRated] = useState(false);
  const [movieALT, setMovieALT] = useState([]);
  const [countRating, setCountRating] = useState(0)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUser();
        setUser(response.user);
      } catch (error) {
        setError('Failed to fetch user data: ' + error.message);
        navigate('/login');
      }
    };

    fetchUser();
  }, [navigate]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        if (user && user.id) {
          const response = await axios.post('http://localhost:5000/check-user-ratings', {
            user_id: user.id
          });

          if (!response.data.has_rated) {
            setHasRated(false);
            setMovieALT(response.data.random_movies);
          } else {
            setHasRated(true);
            const data = await getHybridRecommendations();
            setHeroData(data);
          }
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        setError('Failed to fetch recommendations.');
      }
    };

    fetchRecommendations();
  }, [user]);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroCount((count) => (count + 1) % 3);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {error ? (
        <p>Error: {error}</p>
      ) : user ? (
        <div className="home">
          {!hasRated || countRating < 6 ? (
            <div className="rating-reminder">
            <MovieRating movies={movieALT} setCountRating={setCountRating} /> {/* Pass movie and handleNext */}
          </div>
          ) : (
            <>
            <header className="header-home">
            <Background heroData={heroData[0]} playStatus={playStatus} heroCount={heroCount} />
            <Navbar />
            <Hero
              playStatus={playStatus}
              setPlayStatus={setPlayStatus}
              heroData={heroData[0]}
              heroCount={heroCount}
              setHeroCount={setHeroCount}
            />
          </header>
              <Card heroData={heroData.slice(1)} />
              <Footer />
            </>
          )}
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default Home;
