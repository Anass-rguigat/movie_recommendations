import  { useState, useEffect  } from 'react';
import './Slider.css'; // Import the CSS file
import { useNavigate } from 'react-router-dom';
import { getPopularityRecommendations } from '../../api/recommendations';

const Slider = () => {
  const [itemActive, setItemActive] = useState(0);
  const [movies, setMovie] = useState([]);
  const userId = 1;
  const navigate = useNavigate();
  
// -=-=-=-=-=-=-
// getPopularityRecommendations
// -=-=-=-=-=-=-
  

  const maxLength = 24; 
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const data = await getPopularityRecommendations();
        setMovie(data.slice(0, 10));
        // console.log(data);
        // data[0].genres.map(genre => console.log(genre.name))
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      }
    };

    fetchRecommendations();

  }, [userId]);

// -=-=-=-=-=-=-
  
  const nextSlide = () => {
    setItemActive((prevIndex) => (prevIndex + 1) % 10);
  };

  const prevSlide = () => {
    setItemActive((prevIndex) => (prevIndex === 0 ? 10 - 1 : prevIndex - 1));
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleThumbnailClick = (index) => {
    setItemActive(index);
  };

  const handleDetailsClick = (movie) => {
    navigate('/detail', { state: { movie } });
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
              <button className="btn" onClick={() => handleDetailsClick(movie)} >Details</button>
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
            <div>
              <img src={`https://image.tmdb.org/t/p/original${movie.poster_path}`} alt={`Thumbnail ${index + 1}`} />
              {/* <div className="title">{movie.title.substring(0, 24)}</div> */}
              <div className="title">{movie.title.length > 24 ? (
                  <>
                    {movie.title.substring(0, 20)}<span className="pointsTitle"></span><span className="full-title">{movie.title.substring(20)}</span>
                  </>
                ) : (
                  movie.title
                )}</div>
            </div>
          </div>
          
        ))}
      </div>
    </div>
  );
};

export default Slider;