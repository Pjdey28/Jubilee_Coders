import React, { useEffect, useState } from "react";

export default function GuessTheFlag() {
  const [countries, setCountries] = useState([]);
  const [currentFlag, setCurrentFlag] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchCountries() {
      try {
        const res = await fetch("https://restcountries.com/v3.1/all");
        const data = await res.json();

        const formattedData = data.map((country) => ({
          name: country.name.common,
          flag: country.flags.png,
        }));

        setCountries(formattedData);
        pickRandomCountry(formattedData);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    }

    fetchCountries();
  }, []);

  const pickRandomCountry = (countryList) => {
    if (countryList.length === 0) return;

    const randomCountry = countryList[Math.floor(Math.random() * countryList.length)];
    setCurrentFlag(randomCountry);

    const otherOptions = [...countryList]
      .filter((c) => c.name !== randomCountry.name)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    setOptions([randomCountry, ...otherOptions].sort(() => 0.5 - Math.random()));
  };

  const handleGuess = (selectedName) => {
    if (selectedName === currentFlag.name) {
      setMessage("✅ Correct!");
      setScore(score + 1);
    } else {
      setMessage(`❌ Wrong! It was ${currentFlag.name}`);
    }

    setTimeout(() => {
      pickRandomCountry(countries);
      setMessage("");
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold mb-4 flex items-center gap-2">
        Guess the Flag! 
      </h1>

      {/* Score Counter */}
      <div className="bg-indigo-700 text-white px-6 py-2 rounded-full text-lg font-semibold shadow-lg border border-indigo-500">
        Score: <span className="font-bold">{score}</span>
      </div>

      {currentFlag && (
        <div className="mt-6 flex flex-col items-center">
          {/* Flag Display */}
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-600">
            <img
              src={currentFlag.flag}
              alt="Country Flag"
              className="w-72 h-48 object-cover border border-gray-500 rounded-lg"
            />
          </div>

          {/* Options */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            {options.map((country, index) => (
              <button
                key={index}
                className="px-6 py-3 bg-gray-700 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-600 hover:scale-105 transition transform duration-200 border border-indigo-400"
                onClick={() => handleGuess(country.name)}
              >
                {country.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Message Display */}
      {message && (
        <p className="mt-6 text-lg font-semibold bg-gray-700 text-white px-4 py-2 rounded-lg shadow-md border border-gray-500">
          {message}
        </p>
      )}
    </div>
  );
}
