import './Card.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfAlt, faStar as farStar } from '@fortawesome/free-solid-svg-icons';
import { getHybridRecommendations } from '../../api/hybrid';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


const Card = ({heroData}) => {
    const [movies, setMovies] = useState([]);
    const userId = 1;
    const maxLength = 20;
    const maxLengthDesc = 250; // Adjust the maximum length for description
    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const data = await getHybridRecommendations();
                setMovies(data);
                console.log(data);
            } catch (error) {
                console.error('Error fetching recommendations:', error);
            }
        };

        fetchRecommendations();

    }, [userId]);

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
            <h1>MOVIE RECOMMEND</h1>
            <div className="container">
                {heroData.map((movie, index) => (
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
                                    <p> {renderStars(movie.average_rating)} {movie.average_rating.toFixed(2)} | {movie.release_date}</p>
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
                ))}
            </div>
        </div>
    );
}

export default Card;
