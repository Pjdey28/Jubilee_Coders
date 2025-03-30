import React, { useState, useEffect } from "react";

const API_URL = "https://uselessfacts.jsph.pl/random.json?language=en";

const FactOrFiction = () => {
  const [question, setQuestion] = useState("");
  const [isFact, setIsFact] = useState(null);
  const [userGuess, setUserGuess] = useState(null);
  const [feedback, setFeedback] = useState("");

  const fakeFacts = [
    "Goldfish can live for 100 years.",
    "The Eiffel Tower can grow taller in the winter.",
    "Bananas grow on trees.",
    "Sharks are mammals.",
    "You can see the Great Wall of China from space.",
    "Humans have more bones as adults than at birth.",
    "Elephants can jump.",
    "Penguins can fly if they flap hard enough.",
    "The moon is made of chocolate.",
    "A day on Mars is shorter than a day on Earth.",
    "Lightning never strikes the same place twice.",
    "If you drop a penny from a tall building, it can crack the sidewalk.",
    "Carrots improve your night vision to superhero levels.",
    "Bats are completely blind.",
    "Ostriches bury their heads in the sand when scared.",
    "Eating before swimming causes cramps.",
    "The Earth is the only planet with water.",
    "Cows sleep standing up.",
    "Napoleon was extremely short.",
    "Bulls get angry when they see the color red.",
    "Humans only use 10% of their brains.",
    "A duck’s quack doesn’t echo.",
    "Touching a toad gives you warts."
  ];

  const fetchQuestion = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      let fact = data.text || "No fact found.";
      let realFact = true;

      if (Math.random() < 0.5) {
        fact = fakeFacts[Math.floor(Math.random() * fakeFacts.length)];
        realFact = false;
      }

      setQuestion(fact);
      setIsFact(realFact);
      setUserGuess(null);
      setFeedback("");
    } catch (error) {
      console.error("Error fetching fact:", error);
      setQuestion("Failed to load fact. Check API.");
      setIsFact(null);
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, []);

  const handleGuess = (guess) => {
    setUserGuess(guess);
    setFeedback(guess === isFact ? "✅ Correct!" : "❌ Wrong!");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-gray-200 mb-4">Fact or Fiction?</h2>
        <p className="text-lg font-semibold text-gray-300">{question || "Loading..."}</p>
        <div className="mt-4 space-x-4">
          <button 
            onClick={() => handleGuess(true)} 
            className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition">
            Fact
          </button>
          <button 
            onClick={() => handleGuess(false)} 
            className="px-6 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition">
            Fiction
          </button>
        </div>
        {userGuess !== null && (
          <p className="mt-4 text-lg font-semibold text-gray-300">{feedback}</p>
        )}
        <button 
          onClick={fetchQuestion} 
          className="mt-6 px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition">
          Get New Fact
        </button>
      </div>
    </div>
  );
};

export default FactOrFiction;
