import { useState, useEffect } from 'react';
import imgg2 from '../../assets/image2.jpg';
import imgg1 from '../../assets/pic1.jpg';
import './MovieDetails.css';
import video1 from '../../assets/video1.mp4';
import profile1 from '../../assets/profile.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfAlt, faStar as farStar } from '@fortawesome/free-solid-svg-icons';

const MovieDetails = () => {
  const [product, setProduct] = useState({
    name: '',
    genre: '',
    description: '',
    imageSrc: ''
  });

  const [backgroundImage, setBackgroundImage] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const data = {
        name: 'Sample Movie',
        genre: 'DRAMA - CRIME - DRUGS',
        description: 'This is a sample movie description. This is a sample movie description. This is a sample movie description. This is a sample movie description.',
        imageSrc: imgg1,
        backgroundImage: imgg2
      };
      setProduct(data);
      setBackgroundImage(data.backgroundImage);
    };

    fetchData();
  }, []);

  const handleRating = (rate) => {
    setRating(rate);
    console.log(rate);
  };

  return (
    <div className="Movied">
      <img src={backgroundImage} alt="Background" className="background-image" />
      <div className="moviedetail">
        <div className="detail">
          <div className="image">
            <img src={product.imageSrc} alt={product.name} />
          </div>
          <div className="content">
            <h1 className="name">{product.name}</h1>
            <div className="genre">{product.genre}</div>
            <div className="description">{product.description}</div>
          
            <div className="production">
              <p>Production Company : NETFLIX</p>
            </div>
            <div className="country">
              <p>Country : England</p>
            </div>
            <div className="language">
              <p>Spoken Language : English</p>
            </div>
            <div className="release-date">
              <h3 >
                2023-09-12
              </h3>
            </div>
            <div className="rating">
              {[...Array(5)].map((_, index) => {
                const ratingValue = (index + 1) ;
                return (
                  <FontAwesomeIcon
                    key={index}
                    icon={ratingValue <= (hoverRating || rating) ? faStar : farStar}
                    className="star"
                    onClick={() => handleRating(ratingValue)}
                    onMouseEnter={() => setHoverRating(ratingValue)}
                    onMouseLeave={() => setHoverRating(0)}
                    color={ratingValue <= rating || ratingValue <= hoverRating ? '#ffc107' : '#e4e5e9'}
                  />
                );
              })} <small>(3.5 / 200)</small>
            </div>
          </div>
        </div>
        <div className="Cast">
          <h1 className="title">CASTS</h1>
          <div className="listProduct">
            <div className="item">
              <img src={profile1} alt="Robert Green" />
              <div className="name">Robert Green</div>
            </div>
            <div className="item">
              <img src={profile1} alt="Robert Green" />
              <div className="name">Robert Green</div>
            </div>
            <div className="item">
              <img src={profile1} alt="Robert Green" />
              <div className="name">Robert Green</div>
            </div>
            <div className="item">
              <img src={profile1} alt="Robert Green" />
              <div className="name">Robert Green</div>
            </div>
          </div>
        </div>
        <div className="trailer">
          <video className="trailer-video">
            <source src={video1} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
