import axios from 'axios';

const flaskApi = axios.create({
  baseURL: 'http://localhost:5000',
});

const tmdbApi = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: {
    api_key: '82630e4c1f743f98068c95b3a28f8d6c',
  },
});

export const getHybridRecommendations = async () => {
  try {

    // Get the user ID from local storage
    const userId = localStorage.getItem('userId');
    if (!userId) {
      throw new Error('User ID not found in local storage');
    }

    // Use a POST request and send user_id in the body with value 1 or any value of id not important
    const response = await flaskApi.post('/recommendations-hybrid', { user_id: userId });
    const recommendations = response.data;

    // Fetch detailed movie info from TMDB for each recommended movie
    const detailedRecommendations = await Promise.all(
      recommendations.map(async (movie) => {
        const tmdbResponse = await tmdbApi.get(`/movie/${movie.tmdbId}`);
        return { ...movie, ...tmdbResponse.data };
      })
    );
    // console.log(detailedRecommendations);

    return detailedRecommendations;
  } catch (error) {
    throw new Error('Failed to fetch hybrid recommendations: ' + error.message);
  }
};

export default {
    getHybridRecommendations,
};