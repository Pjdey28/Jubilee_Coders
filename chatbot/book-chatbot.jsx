import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";

function BookChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [prompt, setPrompt] = useState("");
    const [loading, setLoading] = useState(false);
    const [disable, setDisable] = useState(false);
    const [chatHistory, setChatHistory] = useState([]);
    const messagesEndRef = useRef(null);
    const chatContainerRef = useRef(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [chatHistory]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (chatContainerRef.current && !chatContainerRef.current.contains(event.target) && isOpen) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    function getDefaultResponse() {
        return `I couldn't generate a proper response. Here are some things you could ask about:
      - Books similar to [your favorite book]
      - Information about [author]
      - Summary of [book title]
      - Upcoming books by [author]
      - Reviews for [book title]`;
    }

    async function getResponse(e) {
        e.preventDefault();

        if (!prompt.trim()) {
            return;
        }

        setChatHistory(prev => [...prev, { type: 'user', text: prompt }]);
        setLoading(true);
        setDisable(true);

        try {
            const res = await fetch("https://books-bot-7qqy.onrender.com/api/ServiceHubAI", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt }),
            });

            let aiResponse = "";
            
            if (res.ok) {
                const data = await res.json();
                aiResponse = data?.response?.trim() || getDefaultResponse();
            } else {
                aiResponse = getDefaultResponse();
            }

            setChatHistory(prev => [...prev, { type: 'ai', text: aiResponse }]);
        } catch (error) {
            console.error("Error fetching response:", error);
            setChatHistory(prev => [...prev, { type: 'ai', text: getDefaultResponse() }]);
        } finally {
            setLoading(false);
            setDisable(false);
            setPrompt("");
        }
    }

    return (
        <div className="relative z-50">
            {isOpen && (
                <div
                    ref={chatContainerRef}
                    className="fixed bottom-4 right-4 w-80 sm:w-96 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl flex flex-col overflow-hidden"
                    style={{ height: "80vh", maxHeight: "80vh", width: "24rem" }}
                >
                    <div className="bg-gray-800 p-4 border-b border-gray-700">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-white">Book Assistant</h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <span className="text-lg">✕</span>
                            </button>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">Ask me about books and authors!</p>
                    </div>

                    <div className="flex-1 p-4 overflow-y-auto bg-gray-950">
                        {chatHistory.length === 0 ? (
                            <div className="text-center text-gray-500 my-4 p-6">
                                <div className="text-5xl mb-4">📚</div>
                                <p className="font-medium text-gray-400">Welcome to Book Assistant!</p>
                                <p className="text-sm mt-2">Ask me about books, authors, recommendations, or reviews.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {chatHistory.map((message, index) => (
                                    <div key={index} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                                        <div
                                            className={`rounded-lg p-3 ${
                                                message.type === "user"
                                                    ? "bg-blue-600 text-white rounded-tr-none max-w-xs"
                                                    : "bg-gray-800 text-gray-200 rounded-tl-none max-w-xs"
                                            }`}
                                            style={{ minWidth: "200px", maxWidth: "250px" }}
                                        >
                                            {message.type === "ai" ? (
                                                <div className="prose prose-invert prose-sm max-w-none">
                                                    <ReactMarkdown>{message.text}</ReactMarkdown>
                                                </div>
                                            ) : (
                                                <p>{message.text}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                        )}
                    </div>

                    <form onSubmit={getResponse} className="p-3 border-t border-gray-800 bg-gray-850 bg-opacity-50 backdrop-blur-sm">
                        <div className="flex gap-2 bg-gray-800 rounded-lg p-1 border border-gray-700">
                            <input
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Ask about books..."
                                className="flex-1 bg-transparent border-none p-2 text-gray-800 placeholder-gray-400 focus:outline-none"
                                disabled={disable}
                            />
                            <button
                                type="submit"
                                className={`p-2 rounded-lg transition ${
                                    disable ? "bg-gray-700 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"
                                }`}
                                disabled={loading || disable}
                            >
                                {loading ? (
                                    <span className="block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                ) : (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <line x1="22" y1="2" x2="11" y2="13"></line>
                                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                    </svg>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {!isOpen && (
                <button onClick={() => setIsOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg flex items-center justify-center w-12 h-12 transition-all duration-200 hover:scale-105">
                    📚
                </button>
            )}
        </div>
    );
}

export default BookChatbot;
