import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const BASE_URL = "https://api.themeparks.wiki/v1";
const API_HEADERS = { Accept: "application/json" };

function ThemePark() {
  const [parks, setParks] = useState([]);
  const [filteredParks, setFilteredParks] = useState([]);
  const [search, setSearch] = useState("");
  const [parkImages, setParkImages] = useState({});

  useEffect(() => {
    const fetchParks = async () => {
      try {
        const response = await fetch(`${BASE_URL}/destinations`, { headers: API_HEADERS });
        const data = await response.json();
        setParks(data.destinations || []);
        setFilteredParks(data.destinations || []);
      } catch (error) {
        console.error("Error fetching parks:", error);
      }
    };
    fetchParks();
  }, []);

  const fetchWikipediaImage = async (parkName) => {
    const formattedName = parkName.replace(/ /g, "_");
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${formattedName}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      return data.thumbnail ? data.thumbnail.source : "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg";
    } catch (error) {
      console.error("Error fetching Wikipedia image:", error);
      return "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg";
    }
  };

  useEffect(() => {
    parks.forEach((park) => {
      if (!parkImages[park.name]) {
        fetchWikipediaImage(park.name).then((imageUrl) => {
          setParkImages((prev) => ({ ...prev, [park.name]: imageUrl }));
        });
      }
    });
  }, [parks]);

  useEffect(() => {
    const filtered = parks.filter((park) =>
      park.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredParks(filtered);
  }, [search, parks]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-blue-900 text-white px-4 py-8">
      <h1 className="text-5xl font-extrabold text-center mb-8 bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text">
        🎢 Theme Parks
      </h1>
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <input
          type="text"
          placeholder="🔍 Search Parks"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-800 text-gray-200 placeholder-gray-400"
        />
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredParks.length > 0 ? (
          filteredParks.map((park) => (
            <li
              key={park.id}
              className="bg-gray-800 shadow-lg rounded-lg p-4 border border-gray-700 hover:scale-105 transition-transform duration-300"
            >
              <Link to={`/themepark/${park.id}`} className="cursor-pointer">
                <div className="w-full bg-gray-900 flex items-center justify-center">
                  <img
                    src={parkImages[park.name] || "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"}
                    alt={park.name}
                    className="w-full h-auto object-contain rounded-md"
                  />
                </div>
                <strong className="block text-lg font-semibold text-center text-blue-400 mt-4">
                  {park.name}
                </strong>
              </Link>
            </li>
          ))
        ) : (
          <p className="text-center text-gray-400">No parks found.</p>
        )}
      </ul>
    </div>
  );
}

export default ThemePark;