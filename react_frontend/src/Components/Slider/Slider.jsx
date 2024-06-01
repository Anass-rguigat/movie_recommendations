import  { useState, useEffect } from 'react';
import './Slider.css'; // Import the CSS file
import { getPopularityRecommendations } from '../../api/recommendations';

const Slider = () => {
  const [itemActive, setItemActive] = useState(0);

// -=-=-=-=-=-=-
// getPopularityRecommendations
// -=-=-=-=-=-=-

  const [movies, setMovie] = useState([]);
  const userId = 1;

  const maxLength = 24; 

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const data = await getPopularityRecommendations();
        setMovie(data);
        console.log(data);
        // data[0].genres.map(genre => console.log(genre.name))
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      }
    };

    fetchRecommendations();

  }, [userId]);

// -=-=-=-=-=-=-
  
  const nextSlide = () => {
    setItemActive((prevIndex) => (prevIndex + 1) % items.length);
  };

  const prevSlide = () => {
    setItemActive((prevIndex) => (prevIndex === 0 ? items.length - 1 : prevIndex - 1));
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleThumbnailClick = (index) => {
    setItemActive(index);
  };

  return (
    <div className="slider">

      {/* backdrop image and movies informations */}
      <div className="list">
        {movies.map((movie, index) => (
          <div key={index} className={index === itemActive ? "item active" : "item"}>
            <img src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`} alt={`Slider ${index + 1}`} />
            <div className="content">
              <p>{movie.genres.map(genre => genre.name).join(" - ")}</p>
              <h2>
                {movie.title.length > maxLength ? (
                  <>
                    {movie.title.substring(0, maxLength)}<span className="pointsTitle">...</span><span className="full-title">{movie.title.substring(maxLength)}</span>
                  </>
                ) : (
                  movie.title
                )}
              </h2>
              
              <p>{ movie.release_date } <br /> {movie.overview}</p>
              <button className="btn">Details</button>
            </div>
          </div>
        ))}
      </div>

      {/* movies cards */}
      <div className="arrows">
        <button onClick={prevSlide}>{"<"}</button>
        <button onClick={nextSlide}>{">"}</button>
      </div>
      <div className="thumbnail">
        {movies.map((movie, index) => (
          <div key={index} className={index === itemActive ? "item active" : "item"} onClick={() => handleThumbnailClick(index)}>
            <img src={`https://image.tmdb.org/t/p/original${movie.poster_path}`} alt={`Thumbnail ${index + 1}`} />
            <div className="title">{movie.title.substring(0, 20)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Slider;