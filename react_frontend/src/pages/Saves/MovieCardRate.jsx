import './MovieCardRate.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfAlt, faStar as farStar } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const MovieCardRate = ({ heroData, title }) => {
  const maxLength = 20;
  const maxLengthDesc = 250; // Adjust the maximum length for description
  const navigate = useNavigate();

  const renderStars = (rating) => {
    const totalStars = 5;
    let stars = [];
    for (let i = 1; i <= totalStars; i++) {
      if (rating >= i) {
        stars.push(<FontAwesomeIcon key={i} icon={faStar} className="star filled" />);
      } else if (rating >= i - 0.5) {
        stars.push(<FontAwesomeIcon key={i} icon={faStarHalfAlt} className="star half" />);
      } else {
        stars.push(<FontAwesomeIcon key={i} icon={farStar} className="star empty" />);
      }
    }
    return stars;
  };

  const handleDetailsClick = (movie) => {
    navigate('/detail', { state: { movie } });
  };

  return (
    <div className='Card'>
      <h1>{title || 'MOVIE RECOMMEND'}</h1>
      <div className="container">
        {heroData && heroData.length > 0 ? (
          heroData.map((movie, index) => (
            <div key={index} className="movie-cards">
              <div className="card">
                <div className="image-container">
                  <img src={`https://image.tmdb.org/t/p/original${movie.poster_path}`} alt={`Thumbnail ${index + 1}`} />
                </div>
                <div className="content">
                  <h1 className="name">
                    {movie.title.length > maxLength ? (
                      <>
                        {movie.title.substring(0, maxLength)}<span className="pointsTitle">...</span><span className="full-title">{movie.title.substring(maxLength)}</span>
                      </>
                    ) : (
                      movie.title
                    )}
                  </h1>
                  <div className="info">
                    <p>
                      {renderStars(
                        movie.ratings_mean !== undefined && movie.ratings_mean !== null 
                          ? movie.ratings_mean.toFixed(2) 
                          : movie.average_rating !== undefined && movie.average_rating !== null 
                          ? movie.average_rating.toFixed(2) 
                          : movie.rating !== undefined && movie.rating !== null
                          ? movie.rating
                          : 'N/A'
                        )} { 
                        movie.ratings_mean !== undefined && movie.ratings_mean !== null 
                          ? movie.ratings_mean.toFixed(2) 
                          : movie.average_rating !== undefined && movie.average_rating !== null 
                          ? movie.average_rating.toFixed(2) 
                          : movie.vote_average !== undefined && movie.vote_average !== null
                          ? (movie.vote_average / 2).toFixed(2)
                          : 'N/A'
                      } | {movie.release_date}
                    </p>
                  </div>
                  <p className="short-desc">
                    {movie.overview.length > maxLengthDesc ? (
                      <>
                        {movie.overview.substring(0, maxLengthDesc)}<span className="pointsdesc">...</span>
                      </>
                    ) : (
                      movie.overview
                    )}
                  </p>
                  <div className="icons">
                    <button className="btn" onClick={() => handleDetailsClick(movie)}>SEE MORE</button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <h3 className='emptyRatedMovieP'>You haven't rated any movies yet. ! <Link to="/">Rate Now</Link></h3>
        )}
      </div>
    </div>
  );
}

export default MovieCardRate;
