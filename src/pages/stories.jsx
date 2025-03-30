import React, { useEffect, useState, createContext, useContext } from "react";

const StoriesContext = createContext();

const StoriesProvider = ({ children }) => {
  const [stories, setStories] = useState([]);
  const [search, setSearch] = useState("");
  const [sortType, setSortType] = useState("hot");

  const fetchStories = async () => {
    try {
      const response = await fetch(
        `https://www.reddit.com/r/conspiracytheories+stories/${sortType}.json?limit=200`
      );
      const data = await response.json();
      const filteredStories = data.data.children
        .map((post) => ({
          title: post.data.title,
          text: post.data.selftext.trim(),
        }))
        .filter((story) => story.text.length > 0);
      setStories(filteredStories);
    } catch (error) {
      console.error("Error fetching stories:", error);
    }
  };

  useEffect(() => {
    fetchStories();
  }, [sortType]);

  return (
    <StoriesContext.Provider value={{ stories, search, setSearch, setSortType }}>
      {children}
    </StoriesContext.Provider>
  );
};

const StoriesList = () => {
  const { stories, search, setSearch, setSortType } = useContext(StoriesContext);
  const [selectedStory, setSelectedStory] = useState(null); // State to track the selected story
  const filteredStories = stories.filter((story) =>
    story.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleReadMore = (story) => {
    setSelectedStory(story); // Set the selected story to display full text
  };

  const handleClose = () => {
    setSelectedStory(null); // Close the full story view
  };

  return (
    <div className="relative max-w-7xl mx-auto px-4 py-8">
      {/* Search and Sort */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <input
          type="text"
          placeholder="🔍 Search stories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4 md:mb-0 bg-gray-800 text-gray-200 placeholder-gray-400"
        />
        <select
          onChange={(e) => setSortType(e.target.value)}
          className="w-full md:w-1/4 px-4 py-2 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-800 text-gray-200"
        >
          <option value="hot">Hot</option>
          <option value="new">New</option>
          <option value="top">Top</option>
        </select>
      </div>

      {/* Stories List */}
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${
          selectedStory ? "opacity-20 pointer-events-none" : "opacity-100"
        }`}
      >
        {filteredStories.length > 0 ? (
          filteredStories.map((story, index) => (
            <div
              key={index}
              className="bg-gray-800 shadow-lg rounded-lg p-6 border border-gray-700 hover:scale-105 transition-transform duration-300"
            >
              <h2 className="text-xl font-bold mb-2 text-blue-400">{story.title}</h2>
              <p className="text-gray-300">
                {story.text.length > 100
                  ? `${story.text.substring(0, 100)}...`
                  : story.text}
              </p>
              {story.text.length > 100 && (
                <button
                  onClick={() => handleReadMore(story)}
                  className="text-blue-500 hover:underline mt-2"
                >
                  Read More
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400">No stories found.</p>
        )}
      </div>

      {/* Full Story Modal */}
      {selectedStory && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="max-w-3xl w-full bg-gray-800 rounded-lg shadow-lg p-6 text-white overflow-y-auto max-h-[90vh]">
            <h2 className="text-2xl font-bold mb-4 text-blue-400">{selectedStory.title}</h2>
            <p className="text-gray-300 mb-6">{selectedStory.text}</p>
            <button
              onClick={handleClose}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const App = () => {
  return (
    <StoriesProvider>
      <div className="bg-gradient-to-b from-black via-gray-900 to-blue-900 min-h-screen text-white">
        <h1 className="text-5xl font-extrabold text-center py-8 bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text">
          Reddit Conspiracy Theories and Stories
        </h1>
        <StoriesList />
      </div>
    </StoriesProvider>
  );
};

export default App;