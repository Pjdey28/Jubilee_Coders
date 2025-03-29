import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/movies.css';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [topMovies, setTopMovies] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // OMDb API configuration
  const API_KEY = '5715dd08';
  const BASE_URL = 'http://www.omdbapi.com';

  useEffect(() => {
    fetchTopMovies();
    handleSearch(null, 'Marvel');
  }, []);

  const fetchTopMovies = async () => {
    setLoading(true);
    try {
      // First, fetch a larger pool of popular movies
      const popularMovies = await axios.get(
        `${BASE_URL}/?apikey=${API_KEY}&s=movie&type=movie&r=json`
      );

      if (popularMovies.data.Response === 'True') {
        // Fetch detailed info for each movie
        const detailedMoviePromises = popularMovies.data.Search
          .slice(0, 20) // Get first 20 movies to ensure we have enough after filtering
          .map(movie => 
            axios.get(`${BASE_URL}/?apikey=${API_KEY}&i=${movie.imdbID}`)
          );

        const detailedResponses = await Promise.all(detailedMoviePromises);
        const detailedMovies = detailedResponses.map(res => res.data);

        // Sort by IMDB rating and get top 10
        const topTenMovies = detailedMovies
          .filter(movie => movie.imdbRating !== 'N/A')
          .sort((a, b) => parseFloat(b.imdbRating) - parseFloat(a.imdbRating))
          .slice(0, 10);

        setTopMovies(topTenMovies);
      }
    } catch (error) {
      console.error('Error fetching top movies:', error);
      setError('Failed to fetch top movies');
    }
    setLoading(false);
  };

  const handleRefreshTopMovies = () => {
    fetchTopMovies();
  };

  const handleSearch = async (e, initialQuery) => {
    if (e) e.preventDefault();
    const searchQuery = initialQuery || search;
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${BASE_URL}/?apikey=${API_KEY}&s=${encodeURIComponent(searchQuery)}`
      );
      
      if (response.data.Response === 'False') {
        setError('No movies found');
        setMovies([]);
      } else {
        setMovies(response.data.Search);
      }
    } catch (error) {
      console.error('Error searching movies:', error);
      setError('Failed to fetch movies. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="movies-container min-h-screen bg-gray-900 text-white p-6">
      {/* Top Movies Section */}
      <div className="top-movies-section max-w-7xl mx-auto mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Top 10 Movies</h2>
          <button 
            onClick={handleRefreshTopMovies}
            className="bg-blue-500 px-4 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <span>🔄</span> Refresh
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {topMovies.map((movie, index) => (
            <div 
              key={movie.imdbID}
              className="bg-gray-800 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all relative"
            >
              <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded-md text-sm">
                #{index + 1}
              </div>
              <a
                href={`https://www.imdb.com/title/${movie.imdbID}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <img
                  src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Image'}
                  alt={movie.Title}
                  className="w-full h-64 object-cover"
                  loading="lazy"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-sm mb-1">{movie.Title}</h3>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>⭐ {movie.imdbRating}</span>
                    <span>{movie.Year}</span>
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Search Section */}
      <div className="search-section max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">🎬 Movie Search</h1>
        <form onSubmit={handleSearch} className="flex gap-4 mb-8 justify-center">
          <input
            type="text"
            placeholder="Search for movies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 rounded-md flex-1 max-w-lg text-black"
          />
          <button 
            type="submit" 
            className="bg-blue-500 px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* Search Results Section */}
      {loading ? (
        <div className="loading text-center py-8">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-400 py-8">{error}</div>
      ) : (
        <ul className="movies-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {movies.map((movie) => (
            <li key={movie.imdbID} className="movie-item bg-gray-800 p-4 rounded-lg hover:transform hover:scale-105 transition-all">
              <a 
                href={`https://www.imdb.com/title/${movie.imdbID}`}
                target="_blank"
                rel="noopener noreferrer"
                className="movie-link flex items-start gap-4"
              >
                <img
                  src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Image'}
                  alt={movie.Title}
                  className="w-24 h-36 object-cover rounded-md"
                  loading="lazy"
                />
                <div>
                  <h2 className="text-lg font-semibold mb-2">{movie.Title}</h2>
                  <p className="text-gray-400 text-sm mb-1">📅 {movie.Year}</p>
                  <p className="text-gray-400 text-sm">🎭 {movie.Type}</p>
                </div>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Movies;


