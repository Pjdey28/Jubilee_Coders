import React, { useEffect, useState } from "react";

export default function MemePage() {
  const [memes, setMemes] = useState([]);

  useEffect(() => {
    fetch("https://www.reddit.com/r/memes+IndiaTech/new.json?limit=200")
      .then((res) => res.json())
      .then((data) =>
        setMemes(
          data.data.children.map((post) => ({
            id: post.data.id,
            title: post.data.title,
            url: post.data.url,
          }))
        )
      )
      .catch((error) => console.error("Error fetching memes:", error));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-blue-900 text-white flex flex-col items-center px-4 py-8">
      <h1 className="text-5xl font-extrabold mb-8 text-center bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text">
        Meme Gallery
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {memes.map((meme) => (
          <div
            key={meme.id}
            className="bg-gray-800 shadow-lg rounded-lg overflow-hidden border border-gray-700 hover:scale-105 transition-transform duration-300"
          >
            <div className="w-full bg-gray-900 flex items-center justify-center">
              <img
                src={meme.url}
                alt={meme.title}
                className="w-full max-h-64 object-contain"
              />
            </div>
            <div className="p-4 bg-gray-700 text-center text-sm font-medium text-gray-200 rounded-b-lg">
              {meme.title}
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="mt-8 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:from-purple-600 hover:to-blue-500 transition-all duration-300"
      >
        Back to Top
      </button>
    </div>
  );
}