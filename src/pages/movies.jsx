import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [topMovies, setTopMovies] = useState([]);
  const [topTvShows, setTopTvShows] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [moviesLoading, setMoviesLoading] = useState(false);
  const [showsLoading, setShowsLoading] = useState(false);

  // OMDb API configuration
  const API_KEY = '5715dd08';
  const BASE_URL = 'http://www.omdbapi.com';

  // Add this helper function at the top of your component
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  useEffect(() => {
    fetchTopMovies();
    fetchTopTvShows();
    handleSearch(null, 'Marvel');
  }, []);

  const fetchTopMovies = async () => {
    setMoviesLoading(true);
    try {
      // Fetch with different search terms each time
      const searchTerms = ['action', 'drama', 'comedy', 'thriller', 'adventure'];
      const randomTerm = searchTerms[Math.floor(Math.random() * searchTerms.length)];
      
      const popularMovies = await axios.get(
        `${BASE_URL}/?apikey=${API_KEY}&s=${randomTerm}&type=movie&r=json`
      );

      if (popularMovies.data.Response === 'True') {
        // Shuffle the results before slicing
        const shuffledMovies = shuffleArray([...popularMovies.data.Search]);
        
        const detailedMoviePromises = shuffledMovies
          .slice(0, 20)
          .map(movie => 
            axios.get(`${BASE_URL}/?apikey=${API_KEY}&i=${movie.imdbID}`)
          );

        const detailedResponses = await Promise.all(detailedMoviePromises);
        const detailedMovies = detailedResponses.map(res => res.data);

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
    setMoviesLoading(false);
  };

  const fetchTopTvShows = async () => {
    setShowsLoading(true);
    try {
      // Fetch with different search terms each time
      const searchTerms = ['series', 'show', 'tv', 'drama', 'comedy'];
      const randomTerm = searchTerms[Math.floor(Math.random() * searchTerms.length)];
      
      const popularShows = await axios.get(
        `${BASE_URL}/?apikey=${API_KEY}&s=${randomTerm}&type=series&r=json`
      );

      if (popularShows.data.Response === 'True') {
        // Shuffle the results before slicing
        const shuffledShows = shuffleArray([...popularShows.data.Search]);
        
        const detailedShowPromises = shuffledShows
          .slice(0, 20)
          .map(show => 
            axios.get(`${BASE_URL}/?apikey=${API_KEY}&i=${show.imdbID}`)
          );

        const detailedResponses = await Promise.all(detailedShowPromises);
        const detailedShows = detailedResponses.map(res => res.data);

        const topTenShows = detailedShows
          .filter(show => show.imdbRating !== 'N/A')
          .sort((a, b) => parseFloat(b.imdbRating) - parseFloat(a.imdbRating))
          .slice(0, 10);

        setTopTvShows(topTenShows);
      }
    } catch (error) {
      console.error('Error fetching top TV shows:', error);
      setError('Failed to fetch top TV shows');
    }
    setShowsLoading(false);
  };

  const handleRefreshTopMovies = () => {
    fetchTopMovies();
  };

  const handleRefreshTvShows = () => {
    fetchTopTvShows();
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
            disabled={moviesLoading}
            className={`bg-blue-500 px-4 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2 ${
              moviesLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <span className={moviesLoading ? 'animate-spin' : ''}>🔄</span>
            {moviesLoading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {moviesLoading ? (
            <div className="col-span-full text-center py-8">Loading movies...</div>
          ) : (
            topMovies.map((movie, index) => (
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
            ))
          )}
        </div>
      </div>

      {/* Top TV Shows Section */}
      <div className="top-shows-section max-w-7xl mx-auto mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Top 10 TV Shows</h2>
          <button 
            onClick={handleRefreshTvShows}
            disabled={showsLoading}
            className={`bg-blue-500 px-4 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2 ${
              showsLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <span className={showsLoading ? 'animate-spin' : ''}>🔄</span>
            {showsLoading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {showsLoading ? (
            <div className="col-span-full text-center py-8">Loading TV shows...</div>
          ) : (
            topTvShows.map((show, index) => (
              <div 
                key={show.imdbID}
                className="bg-gray-800 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all relative"
              >
                <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded-md text-sm">
                  #{index + 1}
                </div>
                <a
                  href={`https://www.imdb.com/title/${show.imdbID}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <img
                    src={show.Poster !== 'N/A' ? show.Poster : 'https://via.placeholder.com/300x450?text=No+Image'}
                    alt={show.Title}
                    className="w-full h-64 object-cover"
                    loading="lazy"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-sm mb-1">{show.Title}</h3>
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>⭐ {show.imdbRating}</span>
                      <span>{show.Year}</span>
                    </div>
                  </div>
                </a>
              </div>
            ))
          )}
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


