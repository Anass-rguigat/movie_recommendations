import React, { useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as fasStar, faStar as farStar } from '@fortawesome/free-solid-svg-icons';
import './Movierating.css';

const MovieRating = ({ movies , setCountRating }) => {
    const [ratings, setRatings] = useState({});
    const [hoverRating, setHoverRating] = useState(0);
    const [currentMovieIndex, setCurrentMovieIndex] = useState(0);
    const [count ,setCount] = useState(0);


    const handleRatingChange = async (movieId, ratingValue) => {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                popup: 'custom-swal-popup',
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger'
            },
            buttonsStyling: false
        });

        const result = await swalWithBootstrapButtons.fire({
            title: 'Are you sure?',
            text: `Do you want to rate this movie ${ratingValue} stars?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, rate it!',
            cancelButtonText: 'No, cancel!',
            reverseButtons: true
        });

        if (result.isConfirmed) {
            // Reset rating for the current movie before setting the new rating
            setRatings(prevRatings => ({
                ...prevRatings,
                [movies[currentMovieIndex].id]: 0 // Reset the rating of the current movie
            }));

            // Update the rating for the selected movie
            setRatings(prevRatings => ({
                ...prevRatings,
                [movieId]: ratingValue
            }));

            // Move to the next movie
            setCurrentMovieIndex((prevIndex) => (prevIndex + 1) % movies.length);

            const userId = localStorage.getItem('userId');
            if (!userId) {
                console.error('User ID not found in local storage');
                return;
            }
            console.log("user id : " + userId);
            console.log("movie id : "+ movieId);
            console.log("rating : " + ratingValue);

            const ratingData = {
                userId: parseInt(userId, 10),
                movieId: movieId,
                rating: ratingValue
            };
            try {
                const response = await axios.post('http://localhost:5000/add-rating', ratingData);

                console.log('Rating response:', response.data);

                if(response.data == 200){
                    setCount(count+1)
                    setCountRating(count);
                }
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

    return (
        <div className='rating-card'>
            {movies.map((movie, index) => (
                <div
                className={`movie_card ${index === currentMovieIndex ? 'active' : ''}`}
                key={movie.movieId}  
            >
                    <div className="info_section">
                        <div className="movie_header">
                            <img className="locandina" src="https://movieplayer.net-cdn.it/t/images/2017/12/20/bright_jpg_191x283_crop_q85.jpg" alt={`${movie.title} Poster`} />
                            <h1>{movie.title}</h1>
                            <p className="type">{movie.genres}</p>
                        </div>
                        <div className="movie_desc">
                            <p className="text">Lorem ipsum dolor sit, amet consectetur adipisicing elit...</p>
                            <div className="rating">
                                {[...Array(5)].map((_, index) => {
                                    const ratingValue = index + 1;
                                    return (
                                        <FontAwesomeIcon
                                            key={index}
                                            icon={ratingValue <= (ratings[movie.id] || hoverRating) ? fasStar : farStar}
                                            className="star"
                                            onClick={() => handleRatingChange(movie.movieId, ratingValue)}
                                            onMouseEnter={() => setHoverRating(ratingValue)}
                                            onMouseLeave={() => setHoverRating(ratings[movie.id])}
                                            color={ratingValue <= (ratings[movie.id] || hoverRating) ? '#ffc107' : 'rgb(171, 165, 165)'}
                                        />
                                    );
                                })}
                                <small>( {movie.ratings_mean ? movie.ratings_mean.toFixed(2) : 'N/A'} / {movie.vote_count} )</small>
                            </div>
                        </div>
                    </div>
                    <div className="blur_back bright_back"></div>
                </div>
            ))}
        </div>
    );
};

export default MovieRating;
