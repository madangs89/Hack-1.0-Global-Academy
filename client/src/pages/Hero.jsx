import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import SearchBar from "../componenets/SearchBar";
import Cursor from "../componenets/Cursor";
import AnimatedButton from "../componenets/AnimatedButton";
import { useDispatch, useSelector } from "react-redux";
import GirlImage from "../assets/Frame-352_1.webp";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import HistoryModel from "../componenets/modals/HistoryModel";
import axios from "axios";
import toast from "react-hot-toast";
import BlackLoader from "../componenets/BlackLoader";
import WhiteLoader from "../componenets/WhiteLoader";
import { setCurrentWorkingId, setUser } from "../redux/Slice/authSlice";
import { io } from "socket.io-client";
import { setSocket } from "../redux/Slice/socketSlice";
import SkeletonLoader from "../componenets/SkeletonLoader";
import AIOrb from "../componenets/AIOrb";

const Hero = () => {
  const imageRef = useRef(null);
  const overlayRef = useRef(null);
  const navRef = useRef(null);
  const headingRef = useRef(null);
  const buttonsRef = useRef([]);
  const searchRef = useRef(null);
  const chatsRef = useRef(null);
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");
  const params = useParams();

  const [heroLoading, setHeroLoading] = useState(false);

  const [showHistory, setShowHistory] = useState(false);

  const [aiLoading, setAiLoading] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const authSlice = useSelector((state) => state.auth);

  const socket = useSelector((state) => state.socket.socket);

  const [chats, setChats] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const profileRef = useRef(null);
  const socketSlice = useSelector((state) => state.socket);

  useEffect(() => {
    if (!authSlice.isAuth && location.pathname === "/home") {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    (async () => {
      const activeId = params.id || authSlice.currentWorkingId;

      if (!activeId) return;
      if (authSlice.currentWorkinId || params.id) {
        try {
          setHeroLoading(true);

          if (params.id) {
            dispatch(setCurrentWorkingId(params.id));
          }
          const chatHistoryData = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/chat/${authSlice.currentWorkinId || params.id}`,
            {
              withCredentials: true,
            },
          );

          if (chatHistoryData.data.success) {
            setChats(chatHistoryData.data.data.messages);
          }
        } catch (error) {
          console.log(error);
          toast.error("Failed to fetch chat history. Please try again.");
        } finally {
          setHeroLoading(false);
        }
      }
    })();
  }, [params.id]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (chatsRef.current) {
      chatsRef.current.scrollTop = chatsRef.current.scrollHeight;
    }
  }, [chats]);

  useEffect(() => {
    const tl = gsap.timeline();

    // Initial States
    gsap.set(imageRef.current, { scale: 1.05 });
    gsap.set(overlayRef.current, {
      backdropFilter: "blur(40px)",
      backgroundColor: "rgba(0,0,0,0)",
    });

    gsap.set(navRef.current, { y: -40, opacity: 0 });
    gsap.set(headingRef.current, { y: 50, opacity: 0 });
    gsap.set(buttonsRef.current, { y: 40, opacity: 0 });
    gsap.set(searchRef.current, { y: 40, opacity: 0 });

    tl.to(imageRef.current, {
      scale: 1,
      duration: 1.2,
      ease: "power3.out",
    })

      // Navbar enters first
      .to(navRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power3.out",
      })

      // Heading
      .to(headingRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
      })

      // Buttons stagger
      .to(buttonsRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.15,
        ease: "power3.out",
      })

      // Blur overlay happens WHILE content is visible
      .to(
        overlayRef.current,
        {
          backdropFilter: "blur(14px)",
          backgroundColor: "rgba(0,0,0,0.45)",
          duration: 1.2,
          ease: "power3.out",
        },
        "-=1", // starts before buttons fully finish
      )

      // Search last
      .to(searchRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power3.out",
      });
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleUpdate = (data) => {
      console.log("Received llmUpdates:", data);

      setChats((prev) => [
        ...prev,
        {
          from: "system",
          message: data.message,
          code: null,
          isVideoCall: data.isVideoCall,
          videoUrl: data.videoUrl,
        },
      ]);
    };

    socket.on("llmUpdates", handleUpdate);

    socket.on("url", (data) => {
      const { videoUrl, chatId } = data;
      setChats((prev) => {
        const oldData = [...prev];
        oldData[oldData.length - 1].videoUrl = videoUrl;
        oldData[oldData.length - 1].isVideoCall = false;

        return [...oldData];
      });
    });

    return () => {
      socket.off("llmUpdates", handleUpdate);
      socket.off("url", (data) => {
        const { videoUrl, chatId } = data;
        setChats((prev) => {
          const oldData = [...prev];
          oldData[oldData.length - 1].videoUrl = videoUrl;
          return [...oldData];
        });
      });
    };
  }, [socket]);

  useEffect(() => {
    if (!authSlice.user?._id) return;
    if (!socketSlice.socket) {
      const socket = io(import.meta.env.VITE_BACKEND_URL, {
        auth: {
          id: authSlice.user?._id,
        },
      });
      socket.on("connect", () => {
        console.log("Connected to server");
        dispatch(setSocket(socket));
      });
    }
  }, [authSlice.isAuth, socketSlice.socket, authSlice.user?._id, dispatch]);

  const handleLogout = async () => {
    try {
      const logoutRes = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`,
        {},
        {
          withCredentials: true,
        },
      );
      if (logoutRes.data.success) {
        dispatch(setUser(null));
        dispatch(setCurrentWorkingId(null));
        setChats([]);
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden  font-['Manrope']">
      <Cursor />

      {/* Background Image (CLEAR at start) */}
      <img
        ref={imageRef}
        src={GirlImage}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlay (Starts clear, becomes blurred) */}
      <div
        ref={overlayRef}
        className="absolute inset-0"
        style={{
          backdropFilter: "blur(0px)",
          WebkitBackdropFilter: "blur(0px)",
        }}
      ></div>

      {/* Navbar */}
      <nav
        ref={navRef}
        className="relative z-20 w-full flex justify-between items-center px-10 py-6"
      >
        <h1 className="text-3xl font-bold text-white tracking-wider">HACK</h1>

        <div className="space-x-4 hidden md:flex">
          <div
            onClick={() => {
              dispatch(setCurrentWorkingId(null));
              setChats([]);
              navigate("/home", { replace: true });
            }}
            className=""
          >
            <AnimatedButton onClick={() => {}} text={"New"} px={6} py={2} />
          </div>
          <div
            onClick={() => {
              setShowHistory(true);
            }}
            className=""
          >
            <AnimatedButton onClick={() => {}} text={"History"} px={6} py={2} />
          </div>

          <div
            onClick={() => {
              navigate("/roadmap");
            }}
            className=""
          >
            <AnimatedButton onClick={() => {}} text={"Roadmap"} px={6} py={2} />
          </div>
          <div ref={profileRef} className="relative">
            <div
              onClick={() => setShowProfile((prev) => !prev)}
              className="w-10 h-10 cursor-pointer rounded-full border border-white/30 overflow-hidden flex items-center justify-center"
            >
              <img
                src={authSlice.user?.avatar}
                className="object-cover w-full h-full"
                alt="avatar"
              />
            </div>

            {/* Dropdown */}
            <div
              className={`absolute z-[1000] right-0 mt-3 w-64 transition-all duration-300 ${
                showProfile
                  ? "opacity-100 translate-y-0 pointer-events-auto"
                  : "opacity-0 translate-y-4 pointer-events-none"
              }`}
            >
              <div className="backdrop-blur-2xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-5">
                <p className="text-white font-semibold text-sm">
                  {authSlice.user?.username}
                </p>

                <p className="text-white/60 text-xs mt-1">
                  {authSlice.user?.email}
                </p>

                <div className="h-px bg-white/20 my-4" />

                <button
                  onClick={() => {
                    handleLogout();
                  }}
                  className="w-full cursor-pointer text-left text-red-400 hover:text-red-300 text-sm transition"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Center Content */}
      {heroLoading ? (
        <div className="fixed inset-0 flex items-center justify-center w-full h-full bg-black/35 backdrop-blur-lg">
          <WhiteLoader />
        </div>
      ) : chats.length > 0 ? (
        <div className="flex flex-col overflow-hidden h-[89vh] mx-auto w-full relative z-[10] px-6 pb-6">
          {/* Chat Container */}
          <div
            ref={chatsRef}
            className="flex-1 overflow-y-auto max-w-4xl w-full mx-auto mt-10 space-y-6"
          >
            {chats.map((chat, index) => {
              const isVedioCallTrue = chat?.isVideoCall || false;
              return (
                <div
                  key={index}
                  className={`flex ${
                    chat.from === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-lg px-6 py-4 rounded-2xl backdrop-blur-xl border ${
                      chat.from === "user"
                        ? "bg-white text-black border-white/40"
                        : "bg-white/10 text-white border-white/20"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{chat.message}</p>

                    {/* Optional Media */}
                    {chat.videoUrl && (
                      <video
                        controls
                        src={chat.videoUrl}
                        alt=""
                        className="mt-3 rounded-xl w-full object-cover"
                      />
                    )}
                    {isVedioCallTrue &&
                      !chat.videoUrl &&
                      chat.from != "user" && <SkeletonLoader />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Search Bar */}
          <div className="mt-6 max-w-4xl w-full mx-auto">
            <SearchBar
              chats={chats}
              setChats={setChats}
              aiLoading={aiLoading}
              query={query}
              setQuery={setQuery}
              setAiLoading={setAiLoading}
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center px-6 flex-1 relative z-[10]">
          {/* Heading */}

          <AIOrb />
          <h1
            ref={headingRef}
            className="text-4xl md:text-6xl font-semibold text-white leading-tight max-w-4xl"
          >
            Hey, I'm{" "}
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-blue-400">
              Nathalie!
            </span>
            <br />
            What can I do for you today?
          </h1>

          {/* Service Buttons */}
          <div className="mt-12 flex flex-wrap gap-6 justify-center max-w-5xl">
            {[
              "Concept Explanation",
              "Stepwise Breakdown",
              "Visual Demo",
              "Real World Example",
              "Practice Problem",
            ].map((btn, i) => (
              <button
                onClick={() => setQuery((prev) => prev + " " + btn)}
                ref={(el) => (buttonsRef.current[i] = el)}
                key={btn}
                className="px-6 py-3 rounded-full border border-white/30 text-white hover:bg-white hover:text-black transition duration-300"
              >
                {btn}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div ref={searchRef} className="mt-12 w-full flex justify-center">
            <SearchBar
              chats={chats}
              setChats={setChats}
              aiLoading={aiLoading}
              setAiLoading={setAiLoading}
              query={query}
              setQuery={setQuery}
            />
          </div>
        </div>
      )}

      <div
        className={`absolute w-[30%] h-full ${showHistory ? "translate-x-0" : "translate-x-full"} top-0 right-0 transition-transform duration-500 ease-in-out z-30`}
      >
        <HistoryModel
          showHistory={showHistory}
          chats={chats}
          onClose={() => setShowHistory(false)}
        />
      </div>
    </div>
  );
};

export default Hero;
