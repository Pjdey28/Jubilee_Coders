import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const BASE_URL = "https://api.themeparks.wiki/v1";
const API_HEADERS = { Accept: "application/json" };

function ThemeParkDetails() {
  const { id } = useParams();
  const [parkDetails, setParkDetails] = useState(null);
  const [liveData, setLiveData] = useState([]);
  const [children, setChildren] = useState([]);
  const [image, setImage] = useState(""); // State for the park image
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParkDetails = async () => {
      try {
        // Fetch park details
        const response = await fetch(`${BASE_URL}/entity/${id}`, { headers: API_HEADERS });
        const data = await response.json();
        setParkDetails(data);

        // Fetch live data
        const liveResponse = await fetch(`${BASE_URL}/entity/${id}/live`, { headers: API_HEADERS });
        const liveData = await liveResponse.json();
        setLiveData(liveData.liveData || []);

        // Fetch children (attractions and rides)
        const childrenResponse = await fetch(`${BASE_URL}/entity/${id}/children`, { headers: API_HEADERS });
        const childrenData = await childrenResponse.json();
        setChildren(childrenData.children || []);

        // Fetch image from Wikipedia
        const formattedName = data.name.replace(/ /g, "_");
        const wikiResponse = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${formattedName}`
        );
        const wikiData = await wikiResponse.json();
        setImage(wikiData.thumbnail?.source || "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg");
      } catch (error) {
        console.error("Error fetching park details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchParkDetails();
  }, [id]);

  if (loading) {
    return <p className="text-center text-gray-400">Loading...</p>;
  }

  if (!parkDetails) {
    return <p className="text-center text-gray-400">Park details not found.</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-blue-900 text-white px-4 py-8">
      <h1 className="text-5xl font-extrabold text-center mb-8 bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text">
        {parkDetails.name}
      </h1>
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-lg p-6">
        <img
          src={image}
          alt={parkDetails.name}
          className="w-full h-auto object-contain rounded-md mb-6"
        />
        <a
          href={`https://en.wikipedia.org/wiki/${parkDetails.name.replace(/ /g, "_")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-blue-500 text-center mt-4 hover:underline"
        >
          🔗 Wikipedia
        </a>
      </div>

      {/* Live Data Section */}
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-lg p-6 mt-6">
        <h2 className="text-2xl font-bold text-blue-400 mb-4">📡 Live Status</h2>
        {liveData.length > 0 ? (
          <ul className="list-disc pl-5 text-gray-300">
            {liveData.map((ride) => (
              <li key={ride.id} className="mb-2">
                <strong>{ride.name}</strong> - Status: {ride.status}
                <br />
                ⏱ Last Updated: {new Date(ride.lastUpdated).toLocaleString()}
                <br />
                ⏳ Wait Time: {ride.queue?.STANDBY?.waitTime || "N/A"} min
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No live data available.</p>
        )}
      </div>

      {/* Attractions & Rides Section */}
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-lg p-6 mt-6">
        <h2 className="text-2xl font-bold text-blue-400 mb-4">🎠 Attractions & Rides</h2>
        {children.length > 0 ? (
          <ul className="list-disc pl-5 text-gray-300">
            {children.map((child) => (
              <li key={child.id} className="mb-2">
                {child.name} - {child.entityType}
                <br />
                📍 Latitude: {child.location?.latitude || "N/A"}
                <br />
                📍 Longitude: {child.location?.longitude || "N/A"}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No attractions found.</p>
        )}
      </div>
    </div>
  );
}

export default ThemeParkDetails;