import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Test.css';

const Test = () => {
  const [movieData, setMovieData] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [actor, setActor] = useState(null);
  const id = 49022;
  
  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        const movieResponse = await axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=82630e4c1f743f98068c95b3a28f8d6c`);
        const trailerResponse = await axios.get(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=82630e4c1f743f98068c95b3a28f8d6c&language=en-US`);
        const actorResponse = await axios.get(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=82630e4c1f743f98068c95b3a28f8d6c&language=en-US`);
        setMovieData(movieResponse.data);
        setTrailer(trailerResponse.data);
        setActor(actorResponse.data);
      } catch (error) {
        console.error('Error fetching movie data:', error);
      }
    };

    fetchMovieData();
  }, []);

  return (
    <div>
      {movieData ? (
        <div>
          <h1>Title: {movieData.original_title}</h1>
          <p>Overview: {movieData.overview}</p>
          <p>Production Companies:</p>
          {movieData.production_companies.map((company, index) => (
            <p key={index}>{company.name}</p>
          ))}
          <p>Vote Average: {movieData.vote_average}</p>
          <p>Backdrop:</p>
          {movieData.backdrop_path && <img width="100%" height="300" src={`https://image.tmdb.org/t/p/original${movieData.backdrop_path}`} alt="Backdrop" />}
          <p>Poster:</p>
          {movieData.poster_path && <img width="300" height="300" src={`https://image.tmdb.org/t/p/original${movieData.poster_path}`} alt="Poster" />}
          <div className="youtube-container">
            <iframe
              id="frame"
              width="560"
              height="315"
              src={`https://www.youtube.com/embed/${trailer.results[1].key}?autoplay=1&mute=1&loop=1&color=white&controls=0&modestbranding=1&playsinline=1&rel=0&enablejsapi=1&showinfo=0`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          {actor && actor.cast.slice(0, 4).map((act, index) => (
              <div key={index}>
                <p>Name Actor: {act.original_name}</p>
                <img width="300" height="300" src={`https://image.tmdb.org/t/p/original${act.profile_path}`} alt="" />
              </div>
            ))}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Test;
