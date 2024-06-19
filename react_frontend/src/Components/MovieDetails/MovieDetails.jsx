import { useState, useEffect , useRef } from 'react';
import axios from 'axios'; 
import './MovieDetails.css';
import video1 from '../../assets/video1.mp4';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfAlt, faStar as farStar } from '@fortawesome/free-solid-svg-icons';
// -=-=-==- 
// import { faStar as fasStar, faStarHalfAlt, faStar as farStar } from '@fortawesome/free-solid-svg-icons';
// import { faStar as fasStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons';
import { faStar as farStarr } from '@fortawesome/free-regular-svg-icons';
import Swal from 'sweetalert2';


const MovieDetails = ({movie}) => {

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [actors, setActors] = useState([]); 
  const [displayedActors, setDisplayedActors] = useState(4); // State to keep track of the number of displayed actors
  const [trailer, setTrailer] = useState(null);

  const [increment, setIncrement] = useState(4); // for increment number of actors showing
  
  // for hide and show background image 
  const backgroundRef = useRef(null);
  const backImage = useRef(null);
  const [isBackgroundVisible, setIsBackgroundVisible] = useState(true);

  const divBackgroundRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch actors data
        const actorResponse = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=82630e4c1f743f98068c95b3a28f8d6c&language=en-US`);
        setActors(actorResponse.data.cast);

        // Fetch trailer data
        const trailerResponse = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=82630e4c1f743f98068c95b3a28f8d6c&language=en-US`);
        setTrailer(trailerResponse.data.results);

        const backgroundDiv = backgroundRef.current;
        if (backgroundDiv) {
          backgroundDiv.style.visibility = 'visible';
        }

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    

    fetchData();
  }, []);

  // const handleShowMoreActors = () => {
  //   setDisplayedActors(displayedActors + increment);
  //   let numberActors = displayedActors + 4
  //   console.log("number is -=-=-=- : "+ displayedActors);

  //   const divBackground = divBackgroundRef.current;

  //   if (numberActors == 8) {
  //       divBackground.style.backgroundImage = `linear-gradient(to top, #000000 59%, rgb(0, 0, 0) 70%, rgba(0, 0, 0, 0.816) 73%, rgba(0, 0, 0, 0.601) 75%, rgba(0, 0, 0, 0.599) 80%,  rgba(0, 0, 0, 0.258)100% )`;
  //   }else if(numberActors == 12){
  //     divBackground.style.backgroundImage = `linear-gradient(to top, #000000 59%, rgb(0, 0, 0) 70%, rgba(0, 0, 0, 0.952) 73%, rgba(0, 0, 0, 0.601) 75%, rgba(0, 0, 0, 0.599) 80%,  rgba(0, 0, 0, 0.258)100%)`;
  //   }else if(numberActors == 16){
  //     divBackground.style.backgroundImage = `linear-gradient(to top, #000000 59%, rgb(0, 0, 0) 70%, rgb(0, 0, 0) 73%, rgba(0, 0, 0, 0.892) 75%, rgba(0, 0, 0, 0.599) 80%, rgba(0, 0, 0, 0.258)100%)`;
  //   }else if(numberActors == 20){
  //     divBackground.style.backgroundImage = `linear-gradient(to top, #000000 59%, rgb(0, 0, 0) 70%, rgb(0, 0, 0) 73%, rgb(0, 0, 0) 75%, rgba(0, 0, 0, 0.89) 80%, rgba(0, 0, 0, 0.258)100% )`;
  //   }
  // };
  // const handleShowLessActors = () => {
  //   setDisplayedActors(displayedActors - increment);

  //   let numberActors = displayedActors - 4
  //   const divBackground = divBackgroundRef.current;

  //   if (numberActors == 8) {
  //       divBackground.style.backgroundImage = `linear-gradient(to top, #000000 59%, rgb(0, 0, 0) 70%, rgba(0, 0, 0, 0.816) 73%, rgba(0, 0, 0, 0.601) 75%, rgba(0, 0, 0, 0.599) 80%, rgba(0, 0, 0, 0.258)100% )`;
  //   }else if(numberActors == 12){
  //     divBackground.style.backgroundImage = `linear-gradient(to top, #000000 59%, rgb(0, 0, 0) 70%, rgba(0, 0, 0, 0.952) 73%, rgba(0, 0, 0, 0.601) 75%, rgba(0, 0, 0, 0.599) 80%, rgba(0, 0, 0, 0.258)100% )`;
  //   }else if(numberActors == 16){
  //     divBackground.style.backgroundImage = `linear-gradient(to top, #000000 59%, rgb(0, 0, 0) 70%, rgb(0, 0, 0) 73%, rgba(0, 0, 0, 0.892) 75%, rgba(0, 0, 0, 0.599) 80%, rgba(0, 0, 0, 0.258)100% )`;
  //   }else if(numberActors == 20){
  //     divBackground.style.backgroundImage = `linear-gradient(to top, #000000 59%, rgb(0, 0, 0) 70%, rgb(0, 0, 0) 73%, rgb(0, 0, 0) 75%, rgba(0, 0, 0, 0.89) 80%, rgba(0, 0, 0, 0.258)100% )`;
  //   }
    
  // };

  // const handleRating = async (rate) => {
  //   // const confirmRating = window.confirm(`Are you sure you want to give this movie a rating of ${rate} stars?`);
  //   const confirmRating = false
  
    
  //   if (confirmRating) {
  //     setRating(rate);
  //     console.log(rate);
  
  //     // Get the user ID from local storage
  //     const userId = localStorage.getItem('userId');
  //     if (!userId) {
  //       console.error('User ID not found in local storage');
  //       return;
  //     }
  
  //     // Prepare the data to send
  //     const ratingData = {
  //       userId: parseInt(userId, 10),  // Ensure userId is a number
  //       movieId: movie.id,
  //       rating: rate
  //     };
  
  //     try {
  //       // Send the rating data to the API
  //       const response = await axios.post('http://localhost:5000/add-rating', ratingData);
  //       console.log('Rating response:', response.data);
  //     } catch (error) {
  //       console.error('Error sending rating data:', error);
  //     }
  //   }
  // };



const handleRating = async (rate) => {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      popup: 'custom-swal-popup',
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger"
    },
    buttonsStyling: false
  });

  const result = await swalWithBootstrapButtons.fire({
    title: "Are you sure?",
    text: `Do you want to rate this movie ${rate} stars?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, rate it!",
    cancelButtonText: "No, cancel!",
    reverseButtons: true
  });

  if (result.isConfirmed) {
    setRating(rate);

    // Get the user ID from local storage
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.log(userId)
      console.error('User ID not found in local storage');
      return;
    }

    // Prepare the data to send
    const ratingData = {
      userId: parseInt(userId, 10),  // Ensure userId is a number
      movieId: movie.id,
      rating: rate
    };

    try {
      // Send the rating data to the API
      const response = await axios.post('http://localhost:5000/add-rating', ratingData);
      console.log('Rating response:', response.data);
    } catch (error) {
      console.error('Error sending rating data:', error);
    }

    swalWithBootstrapButtons.fire(
      'Rated!',
      'Your rating has been recorded.',
      'success'
    );
  } else if (result.dismiss === Swal.DismissReason.cancel) {
    swalWithBootstrapButtons.fire(
      'Cancelled',
      'Your rating was not recorded.',
      'error'
    );
  }
};


  const handleBackgroundVisibility = () => {
    const backgroundDiv = backgroundRef.current;
    const backImg = backImage.current;

    if (backgroundDiv) {
      if (isBackgroundVisible) {
        backgroundDiv.style.visibility = 'hidden';
        backImg.style.zIndex = '1';
        backImg.style.transform = 'scale(1.05)';
      } else {
        backgroundDiv.style.visibility = 'visible';
        backImg.style.zIndex = '-1';
        backImg.style.transform = 'scale(1)';
      }
      setIsBackgroundVisible(!isBackgroundVisible);
    } 
  };


  return (
    <div className="Movied" ref={divBackgroundRef}>
      <img src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`} alt="Background" ref={backImage} className="background-image" />
      
      <label className="hamburger">
        <input type="checkbox" onClick={handleBackgroundVisibility}/>
        <svg viewBox="0 0 32 32">
            <path className="line line-top-bottom" d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"></path>
            <path className="line" d="M7 16 27 16"></path>
        </svg>
      </label>
      
      <div className="moviedetail"  >

        <div ref={backgroundRef} className='ad-contentUpBackground'>
          <div className="detail" >
            <div className="image">
              <img src={`https://image.tmdb.org/t/p/original${movie.poster_path}`} alt={movie.title} />
            </div>
              
            <div className="content" >
              <h1 className="name">
                {movie.title.length > 24 ? (
                    <>
                      {movie.title.substring(0, 20)}<span className="pointsTitle">...</span><span className="full-title">{movie.title.substring(20)}</span>
                    </>
                  ) : (
                    movie.title
                  )}
              </h1>
              <div className="genre">{movie.genres.map(genre => genre.name).join(" - ")}</div>
              <div className="description">{movie.overview}</div>
            
              <div className="production">
                <p style={{'color' : 'gray'}}>Production Company : <span style={{'color' : 'white'}}>{movie.production_companies.map(companie => companie.name).join(" - ")}</span></p>
              </div>
              <div className="country">
                <p style={{'color' : 'gray'}}>Country : <span style={{'color' : 'white'}}>{movie.production_countries.map(countries => countries.name).join(" - ")}</span></p>
              </div>
              <div className="language">
                <p style={{'color' : 'gray'}}>Spoken Language : <span style={{'color' : 'white'}}>{movie.spoken_languages.map(language => language.name).join(" - ")}</span></p>
              </div>
              <div className="release-date">
                <h3 >
                  {movie.release_date}
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
                      // color={ratingValue <= rating || ratingValue <= hoverRating ? '#ffc107' : '#cdc9c9'}
                      color={ratingValue <= rating || ratingValue <= hoverRating ? '#ffc107' : 'rgb(171 165 165)'}
                    />
                  );
                })}
                
                {/* <small><span style={{'color' : '#cdc9c9'}}>(</span> {movie.ratings_mean} <span style={{'color' : '#cdc9c9'}}>/</span> {movie.vote_count} <span style={{'color' : '#cdc9c9'}}>)</span></small> */}
                <small><span style={{'color' : '#cdc9c9'}}>( </span> 
                {/* {movie.ratings_mean.toFixed(2)}  */}
                {movie.ratings_mean !== undefined && movie.ratings_mean !== null 
                ? movie.ratings_mean.toFixed(2) 
                : movie.average_rating !== undefined && movie.average_rating !== null 
                  ? movie.average_rating.toFixed(2) 
                  : 'N/A'}
                    
                    <FontAwesomeIcon icon={farStarr} className="star" color="#ffc107" style={{ marginLeft: '3px' }} />
                    {/* <FontAwesomeIcon icon={fasStar} className="star" color="#ffc107" style={{ marginLeft: '5px' }} /> */}
                <span style={{'color' : '#cdc9c9'}}> / </span> {movie.vote_count} <span style={{'color' : '#cdc9c9'}}>)</span></small>
              </div>
            </div>
          </div>
        </div>

        <div className="Cast">
          <h1 className="title">CASTS</h1>
          <div className="listProduct">

            {actors.slice(0, displayedActors).map(actor => (
              <div className="item" key={actor.id}>
                <img src={`https://image.tmdb.org/t/p/original${actor.profile_path}`} alt={actor.name} />
                <div className="name">{actor.name}</div>
              </div>
            ))}
          </div>
          {/* {displayedActors < actors.length && (
            <div className='btns'>
              <button className="button" onClick={handleShowMoreActors}>Show More</button>
              <button className="button" onClick={handleShowLessActors}>Show Less</button>
            </div>
          )} */}
        </div>
      

        <div className='Cast'>
          <h1 className="title">THRILLER</h1>
        </div>
        
        <div className="trailer">
          {trailer && trailer.length > 0 ? (
              <iframe
              className="trailer-video"
              src={`https://www.youtube.com/embed/${trailer[0].key}?autoplay=1&loop=1&controls=1&showinfo=0&modestbranding=1`}
              frameBorder="0"
              allow="accelerometer;  clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
            ></iframe>
            
            ) : (
              <video className="trailer-video" controls>
                <source src={video1} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
