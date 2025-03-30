import React, { useState, useEffect } from "react";

const API_URL = "https://random-word-api.vercel.app/api?words=1";

const Hangman = () => {
  const [word, setWord] = useState("");
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [incorrectGuesses, setIncorrectGuesses] = useState(0);
  const maxAttempts = 8;

  const fetchWord = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      const newWord = data[0].toLowerCase();
      setWord(newWord);
      setGuessedLetters([]);
      setIncorrectGuesses(0);
    } catch (error) {
      console.error("Error fetching word:", error);
      setWord("error");
    }
  };

  useEffect(() => {
    fetchWord();
  }, []);

  const handleGuess = (letter) => {
    if (!word.includes(letter)) {
      setIncorrectGuesses((prev) => prev + 1);
    }
    setGuessedLetters((prev) => [...prev, letter]);
  };

  const displayWord = word
    .split("")
    .map((letter) => (guessedLetters.includes(letter) ? letter : "_"))
    .join(" ");

  const isGameOver = incorrectGuesses >= maxAttempts;
  const isWordGuessed = word && !displayWord.includes("_");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-5">
      <h2 className="text-4xl font-bold text-gray-200 mb-5">Hangman Game</h2>

      <p className="text-3xl font-semibold mb-3">
        {isGameOver ? `Game Over! The word was "${word}"` : displayWord}
      </p>

      <p className="text-lg text-red-400 font-bold mb-4">
        Incorrect Guesses: {incorrectGuesses} / {maxAttempts}
      </p>

      <div className="grid grid-cols-9 gap-2 max-w-lg">
        {"abcdefghijklmnopqrstuvwxyz".split("" ).map((letter) => (
          <button
            key={letter}
            onClick={() => handleGuess(letter)}
            disabled={guessedLetters.includes(letter) || isGameOver || isWordGuessed}
            className={`p-3 rounded-md text-lg font-semibold transition-all ${
              guessedLetters.includes(letter)
                ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-700 text-white"
            }`}
          >
            {letter}
          </button>
        ))}
      </div>

      {(isGameOver || isWordGuessed) && (
        <button
          onClick={fetchWord}
          className="mt-6 px-5 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg text-lg"
        >
          Play Again
        </button>
      )}
    </div>
  );
};

export default Hangman;