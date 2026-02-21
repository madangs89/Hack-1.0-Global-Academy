import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setCurrentWorkingId } from "../../redux/Slice/authSlice";

const HistoryModel = ({ onClose, showHistory }) => {
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [chats, setChats] = useState([]);

  useEffect(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power3.out",
      },
    );
  }, []);

  useEffect(() => {
    (async () => {
      if (!showHistory) return;
      try {
        const allHistory = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/history`,
          {
            withCredentials: true,
          },
        );
        if (allHistory.data.success) {
          setChats(allHistory.data.history);
        }
      } catch (error) {
        toast.error("Failed to fetch chat history");
      }
    })();
  }, [showHistory]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex flex-col backdrop-blur-2xl bg-black/60 border border-white/10 rounded-md overflow-hidden"
    >
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-white/10">
        <h2 className="text-xl font-semibold text-white">Chat History</h2>

        <button
          onClick={onClose}
          className="text-white/60 hover:text-white transition"
        >
          ✕
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {chats.length === 0 ? (
          <p className="text-white/50 text-sm">No chats available.</p>
        ) : (
          chats.map((chat) => (
            <div
              key={chat._id}
              onClick={() => {
                dispatch(setCurrentWorkingId(chat._id));
                navigate(`/home/${chat._id}`);
                onClose();
              }}
              className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer transition duration-300"
            >
              <h3 className="text-white font-medium">
                {chat.title || "Untitled Chat"}
              </h3>

              <p className="text-white/50 text-sm mt-1 truncate">
                {chat.messages?.[chat.messages.length - 1]?.message ||
                  "No messages yet"}
              </p>

              <p className="text-white/30 text-xs mt-2">
                {new Date(chat.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HistoryModel;
