import React, { useState } from "react";
import ReactMarkdown from 'react-markdown';

function Chatbot() {
    const [prompt, setPrompt] = useState("");
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState("");
    const [disable, setDisable] = useState(false);

    async function getResponse(e) {
        e.preventDefault();

        if (!prompt.trim()) {
            setResponse("");
            return;
        }

        setLoading(true);
        setResponse("");
        setDisable(true);

        try {
            const res = await fetch("https://generic-bot.onrender.com/api/LeisureBuddyAI", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt }),
            });

            const data = await res.json();
            setResponse(data.response);
        } catch (error) {
            console.error("Error fetching response:", error);
            setResponse("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
            setDisable(false);
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center px-6 py-10 bg-black">
            <section className="bg-[#111] shadow-xl rounded-lg p-8 w-full max-w-3xl border border-[#222]">
                <h1 className="text-3xl font-bold text-center text-white mb-2">Chat with AI</h1>
                <p className="text-center text-gray-400 mb-6">Ask anything and get instant responses!</p>

                <form onSubmit={getResponse} className="flex flex-col gap-4">
                    <input
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Type your question..."
                        id="webwizAI"
                        name="prompt"
                        className="bg-[#000] border border-gray-700 rounded-lg p-3 text-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    />
                    <button
                        type="submit"
                        className={`h-12 rounded-lg font-semibold text-lg transition ${
                            disable ? "bg-gray-700 cursor-not-allowed" : "bg-gray-900 hover:bg-gray-800 text-white"
                        }`}
                        disabled={loading || disable}
                    >
                        {loading ? "Thinking..." : "Ask AI"}
                    </button>
                </form>

                {response && (
                    <div className="bg-[#111] border border-gray-700 rounded-xl py-4 px-6 mt-6 shadow-md">
                        <h2 className="text-lg font-semibold text-white">Response:</h2>
                        <div className="mt-2 border border-gray-700 rounded-md text-white max-h-60 overflow-y-auto">
                            <div className="prose prose-invert max-w-none p-3">
                                <ReactMarkdown>{response}</ReactMarkdown>
                            </div>
                        </div>
                    </div>
                )}
            </section>

            <section className="bg-[#111] shadow-xl rounded-lg p-6 w-full max-w-4xl border border-[#222] mt-10">
                <h2 className="text-2xl font-bold text-center text-white mb-4">What Can You Ask the Chat Bot?</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-white p-6">
                    {[
                        { title: "Dad Jokes", desc: "Get classic dad jokes that are so bad, they’re good! Perfect for sharing with friends or making someone groan with laughter." },
                        { title: "Savage Roasts", desc: "Need a quick-witted comeback? Get hilarious, sarcastic, and playful roasts that are sharp but never mean-spirited." },
                        { title: "Riddle Master", desc: "Challenge yourself with mind-bending riddles that test your logic and creativity. Need a hint? I’ve got you covered!" },
                        { title: "Would You Rather?", desc: "Answer bizarre, funny, and thought-provoking 'Would You Rather' questions. Pick wisely – some choices are tougher than they seem!" },
                        { title: "AI Storyteller", desc: "Get short, engaging, and AI-generated stories in different genres. Whether you want humor, horror, or adventure, I’ll create something fun for you!" },
                        { title: "Lighthearted Insults", desc: "Looking for a fun, playful roast? Get non-offensive, silly, and creative insults designed just for laughs—nothing mean, just pure fun!" },
                        { title: "Movies & Shows", desc: "Get personalized recommendations for movies, TV shows, and web series based on your favorite genres and mood." },
                        { title: "Books & Comics", desc: "Explore must-read books, comics, and audiobooks, whether you're into thrilling adventures, gripping mysteries, or heartwarming tales." },
                        { title: "Fun Activities & Games", desc: "Feeling bored? Discover fun activities, puzzles, and online games to keep yourself entertained anytime, anywhere!" }
                    ].map((item, index) => (
                        <div 
                            key={index} 
                            className="bg-[#000] border border-[#222] p-6 rounded-xl shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-xl"
                        >
                            <h3 className="font-semibold text-xl mb-2">{item.title}</h3>
                            <p className="text-gray-400 text-sm">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default Chatbot;
