import './Hero.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfAlt, faStar as farStar } from '@fortawesome/free-solid-svg-icons';
import play_icon from '../../assets/play_icon.png';
import pause_icon from '../../assets/pause_icon.png';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Hero = ({ heroData, setPlayStatus, playStatus }) => {
    const [isHeroContentVisible, setIsHeroContentVisible] = useState(true);
    const maxLengthDesc = 250
    const maxLength =20

    const navigate = useNavigate();
    // console.log(heroData);

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
                    <p className='genre'>{heroData.genres.map(genre => genre.name).join(" - ")}</p>
                    <div className='rating'>
                        {renderStars(heroData.average_rating) } <span style={{ marginTop : "-4px" , marginLeft : "4px"}}>{heroData.average_rating.toFixed(2)}</span>
                        {/* {renderStars(heroData.vote_average)} */}
                    </div>
                    <button className="btn" onClick={() => handleDetailsClick(heroData)}>SEE MORE</button>
                </div>
            )}
            <div className="hero-dot-play">
                <ul className="hero-dots"></ul>
                <div className="hero-play">
                    <img onClick={handlePlayClick} src={playStatus ? pause_icon : play_icon} alt="" />
                    {/* <img onClick={() => setPlayStatus(!playStatus) } src={playStatus ? pause_icon : play_icon} alt="" /> */}
                    {/* <img onClick={() => setPlayStatus(!playStatus) } src={playStatus ? pause_icon : play_icon} alt="" /> */}
                    <p>See the trailer</p>
                </div>
            </div>
        </div>
    );
};

export default Hero;
