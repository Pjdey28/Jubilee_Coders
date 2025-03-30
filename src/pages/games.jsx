import React from "react";
import { useNavigate } from "react-router-dom";

export default function Games() {
  const navigate = useNavigate();

  const games = [
    { name: "Guess the Flag", path: "/games/guess-the-flag", description: "Test your geography skills by identifying country flags!" },
    { name: "Fact or Fiction", path: "/games/fact-or-fiction", description: "Can you tell if a statement is true or false?" },
    { name: "Hangman", path: "/games/hangman", description: "Guess the hidden word before you run out of attempts!" },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">🎮 Choose a Game</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game, index) => (
          <div
            key={index}
            className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 hover:bg-indigo-600 hover:cursor-pointer transition transform duration-200"
            onClick={() => navigate(game.path)}
          >
            <h2 className="text-xl font-semibold">{game.name}</h2>
            <p className="text-gray-400 mt-2">{game.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
