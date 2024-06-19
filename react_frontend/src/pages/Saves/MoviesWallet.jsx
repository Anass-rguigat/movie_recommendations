import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MovieCardRate from "./MovieCardRate";
import axios from "axios";
import Loading from "../../Components/loadingAnimation/Loading";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";

const tmdbApi = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: {
    api_key: '82630e4c1f743f98068c95b3a28f8d6c',
  },
});

export default function MoviesWallet() {
  const [ratedMovies, setRatedMovies] = useState(null);
  const [userr, setUserr] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRatedMovies = async () => {
      try {

        const response = await axios.get('http://localhost:8000/api/rated-movies', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          params: {
            user_id: localStorage.getItem('userId')
          }
        });

        const ratedMovies = response.data.ratings;

        // Fetch detailed movie info from TMDB for each rated movie
        const detailedMovies = await Promise.all(
          ratedMovies.map(async (movie) => {
            const tmdbResponse = await tmdbApi.get(`/movie/${movie.tmdb_id}`);
            return { ...movie, ...tmdbResponse.data };
          })
        );

        setRatedMovies(detailedMovies);
        console.log(detailedMovies);
      } catch (error) {
        setError('Failed to fetch user data: ' + error.message);
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };

    fetchRatedMovies();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <header className="header-top">
        <Navbar />
        <div>
          <MovieCardRate heroData={ratedMovies} title="Rated Movies" />
        </div>
        <Footer />
      </header>
      {error && <p>{error}</p>}
    </div>
  );
}
