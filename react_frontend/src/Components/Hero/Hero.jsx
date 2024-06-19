import './Hero.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfAlt, faStar as farStar } from '@fortawesome/free-solid-svg-icons';
import play_icon from '../../assets/play_icon.png';
import pause_icon from '../../assets/pause_icon.png';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Hero = ({ heroData, setPlayStatus, playStatus }) => {
    const [isHeroContentVisible, setIsHeroContentVisible] = useState(true);
    const maxLengthDesc = 250;
    const maxLength = 20;

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

    const handlePlayClick = () => {
        setPlayStatus(!playStatus);
        setIsHeroContentVisible(!isHeroContentVisible);
    };

    const handleDetailsClick = (movie) => {
        navigate('/detail', { state: { movie } });
    };

    const renderGenres = (genres) => {
        const maxGenresToShow = 5;
    
        if (genres.length > maxGenresToShow) {
            return genres.slice(0, maxGenresToShow).map((genre, index) => (
                <span key={index}>
                    {genre.name}
                    {index !== maxGenresToShow - 1 && ' - '} {/* Add "-" only if it's not the last genre */}
                </span>
            )).concat(<span key="ellipsis">...</span>);
        } else {
            return genres.map((genre, index) => (
                <span key={index}>
                    {genre.name}
                    {index !== genres.length - 1 && ' - '} {/* Add "-" only if it's not the last genre */}
                </span>
            ));
        }
    };

    return (
        <div className={`hero ${isHeroContentVisible ? '' : 'hidden-content'}`}>
            {heroData && heroData.title && (
                <div className="hero-text">
                    <p className='title'>
                        {heroData.title.length > maxLength ? (
                            <>
                                {heroData.title.substring(0, maxLength)}<span className="pointsTitle">...</span><span className="full-title">{heroData.title.substring(maxLength)}</span>
                            </>
                        ) : (
                            heroData.title
                        )}
                    </p>
                    <p className='description'>
                        {heroData.overview.length > maxLengthDesc ? (
                            <>
                                {heroData.overview.substring(0, maxLengthDesc)}<span className="pointsdesc">...</span>
                            </>
                        ) : (
                            heroData.overview
                        )}
                    </p>
                    <p className='genre'>{renderGenres(heroData.genres)}</p>
                    <div className='rating'>

                        {renderStars(
                            heroData.average_rating !== undefined && heroData.average_rating !== null 
                            ? heroData.average_rating.toFixed(2) 
                            : heroData.ratings_mean !== undefined && heroData.ratings_mean !== null 
                              ? heroData.ratings_mean.toFixed(2) 
                              : 'N/A'
                        )}
                        <span style={{ marginTop: "-4px", marginLeft: "4px" }}>
                            {/* heroData.average_rating.toFixed(2) */}
                            {heroData.average_rating !== undefined && heroData.average_rating !== null 
                                ? heroData.average_rating.toFixed(2) 
                                : heroData.ratings_mean !== undefined && heroData.ratings_mean !== null 
                                  ? heroData.ratings_mean.toFixed(2) 
                                  : 'N/A'
                            }

                        </span>
                    </div>
                    <button className="btn" onClick={() => handleDetailsClick(heroData)}>SEE MORE</button>
                </div>
            )}
            <div className="hero-dot-play">
                <ul className="hero-dots"></ul>
                <div className="hero-play">
                    <img onClick={handlePlayClick} src={playStatus ? pause_icon : play_icon} alt="" />
                    <p>See the trailer</p>
                </div>
            </div>
        </div>
    );
};

export default Hero;
