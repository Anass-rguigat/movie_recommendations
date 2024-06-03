import './Background.css';
import video1 from '../../assets/video1.mp4';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Background = ({ heroData, playStatus, heroCount }) => {
    const [trailer, setTrailer] = useState(null);

    useEffect(() => {
        const fetchMovieData = async () => {
            try {
                const trailerResponse = await axios.get(`https://api.themoviedb.org/3/movie/${heroData.tmdbId}/videos?api_key=82630e4c1f743f98068c95b3a28f8d6c&language=en-US`);
                setTrailer(trailerResponse.data);
            } catch (error) {
                console.error('Error fetching movie data:', error);
            }
        };

        if (heroData) {
            fetchMovieData();
        }
    }, [heroData]);

    if (playStatus) {
        if (trailer && trailer.results && trailer.results.length > 0) {
            const videoKey = trailer.results[0].key;
            return (
                <iframe
                className='background fade-in'
                src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&loop=1&controls=0&showinfo=0`}
                frameBorder="0"
                allowFullScreen
            ></iframe>
            );
        } else {
            // Handle the case when trailer is not available
            return null;
        }
    } else if (heroData && heroData.backdrop_path) {
        return <img src={`https://image.tmdb.org/t/p/original${heroData.backdrop_path}`} className='background fade-in' alt='' />;
    } else {
        return null;
    }
};

export default Background;
