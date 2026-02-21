import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import BlackLoader from "./BlackLoader";

import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentWorkingId } from "../redux/Slice/authSlice";
import { useNavigate } from "react-router-dom";

function SearchBar({
  className = "",
  chats,
  setChats,
  aiLoading,
  setAiLoading,
  query,
  setQuery,
}) {
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const currentWorkingid = useSelector((state) => state.auth.currentWorkingId);
  const handleSearch = async () => {
    if (!query.trim()) return;
    console.log("Searching:", query);

    let q = query.trim();
    setQuery("");
    try {
      setAiLoading(true);
      let History = [...chats, { from: "user", message: query }];
      setChats((prevChats) => [...prevChats, { from: "user", message: query }]);

      const aiRes = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/chat`,
        {
          chat: query,
          history: History,
          chatId: currentWorkingid || null,
        },
        {
          withCredentials: true,
        },
      );
    } catch (error) {
      console.log(error);
      setChats((prev) =>
        prev.map((d) => ({
          from: d.from,
          message: d.message,
          code: null,
          videoUrl: d.videoUrl || null,
        })),
      );
      setChats((prev) => {
        return [
          ...prev,
          {
            from: "system",
            message: "Something went wrong. Please try again.",
            code: null,
            videoUrl: null,
          },
        ];
      });
    } finally {
      setAiLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        handleSearch();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      <div className="flex items-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-full px-6 py-4 shadow-2xl hover:shadow-white/10 transition duration-300">
        {/* Icon */}
        <Search className="text-white/70 mr-3" size={22} />

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          placeholder="Ask anything..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent outline-none text-white placeholder-white/60 text-lg"
        />

        {/* Button */}
        {aiLoading ? (
          <div className="ml-4 bg-white text-black px-6 py-2 rounded-full font-medium hover:bg-gray-200 transition duration-300">
            <BlackLoader />
          </div>
        ) : (
          <button
            onClick={handleSearch}
            className="ml-4 bg-white text-black px-6 py-2 rounded-full font-medium hover:bg-gray-200 transition duration-300"
          >
            Ask
          </button>
        )}
      </div>
    </div>
  );
}

export default SearchBar;
