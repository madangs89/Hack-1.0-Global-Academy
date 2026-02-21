import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import axios from "axios";
import { Search } from "lucide-react";
import Cursor from "../componenets/Cursor";
import WhiteLoader from "../componenets/WhiteLoader";
import BlackLoader from "../componenets/BlackLoader";

const Roadmap = () => {
  const bgRef = useRef(null);
  const navRef = useRef(null);
  const headingRef = useRef(null);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.from(bgRef.current, {
      scale: 1.05,
      opacity: 0,
      duration: 1.2,
    })
      .from(navRef.current, { y: 50, opacity: 0, duration: 1 }, "-=0.8")
      .from(headingRef.current, { y: 80, opacity: 0, duration: 1.2 }, "-=0.6");
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleGenerate = async () => {
    if (!query.trim()) return;

    const userInput = query.trim();
    setQuery("");

    setMessages((prev) => [...prev, { type: "user", content: userInput }]);

    try {
      setLoading(true);

      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/llm/roadMap`,
        { topic: userInput, messages },
        { withCredentials: true },
      );

      if (data.success) {
        if (data.normalText) {
          setMessages((prev) => [
            ...prev,
            { type: "text", content: data.normalText },
          ]);
        }

        if (data.roadmap) {
          setMessages((prev) => [
            ...prev,
            { type: "roadmap", content: data.roadmap },
          ]);
        }
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { type: "text", content: "Something went wrong." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleGenerate();
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black cursor-none font-['Manrope']">
      <img
        ref={bgRef}
        src="https://karim-saab.com/images/Frame-4_1.avif"
        className="absolute inset-0 w-full h-full object-cover"
        alt=""
      />

      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-none"></div>

      <Cursor />

      <div className="relative z-20 min-h-screen flex flex-col">
        <nav
          ref={navRef}
          className="flex justify-between items-center px-10 py-6"
        >
          <h1 className="text-2xl font-semibold text-white tracking-wide">
            AI <span className="text-gray-400">Roadmap</span>
          </h1>
        </nav>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 pb-32">
          <div className="max-w-4xl overflow-y-scroll h-[70vh] mx-auto space-y-10">
            {messages.length === 0 && (
              <div
                ref={headingRef}
                className="flex flex-col items-center justify-center text-center mt-20"
              >
                <h1 className="text-4xl md:text-6xl font-semibold text-white leading-tight">
                  Build Your <br /> Learning Roadmap
                </h1>

                <p className="text-white/60 mt-6 max-w-xl">
                  Ask for a roadmap, study plan, or structured learning path.
                </p>
              </div>
            )}

            {/* MESSAGE RENDERING */}
            {messages.map((msg, index) => {
              // USER
              if (msg.type === "user") {
                return (
                  <div key={index} className="text-right">
                    <div className="inline-block bg-white text-black px-6 py-3 rounded-2xl">
                      {msg.content}
                    </div>
                  </div>
                );
              }

              // TEXT
              if (msg.type === "text") {
                return (
                  <div key={index} className="text-left">
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 px-6 py-4 rounded-2xl text-white">
                      {msg.content}
                    </div>
                  </div>
                );
              }

              if (msg.type === "roadmap") {
                const roadmap = msg.content;

                const levelGroups = {
                  1: roadmap.nodes.filter((n) => n.level === 1),
                  2: roadmap.nodes.filter((n) => n.level === 2),
                  3: roadmap.nodes.filter((n) => n.level === 3),
                };

                return (
                  <div key={index} className="space-y-16">
                    {/* Title */}
                    <div className="text-center space-y-2">
                      <h2 className="text-4xl font-bold text-white">
                        {roadmap.title}
                      </h2>
                      <p className="text-white/60">
                        {roadmap.difficulty} • {roadmap.estimated_duration}
                      </p>
                    </div>

                    {/* Levels */}
                    {[1, 2, 3].map(
                      (level) =>
                        levelGroups[level].length > 0 && (
                          <div key={level} className="space-y-8">
                            {/* Level Header */}
                            <div className="flex items-center gap-4">
                              <div className="w-3 h-3 bg-white rounded-full"></div>
                              <h3 className="text-2xl font-semibold text-white">
                                Level {level}
                              </h3>
                            </div>

                            {/* Nodes */}
                            <div className="grid md:grid-cols-2 gap-6">
                              {levelGroups[level].map((node) => (
                                <div
                                  key={node.id}
                                  className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl p-6 hover:bg-white/20 transition duration-300"
                                >
                                  <h4 className="text-lg font-semibold text-white">
                                    {node.label}
                                  </h4>

                                  <p className="text-white/50 text-sm mt-2 capitalize">
                                    {node.type}
                                  </p>

                                  {node.dependsOn.length > 0 && (
                                    <div className="mt-4 text-xs text-white/40">
                                      <span className="block mb-1">
                                        Depends on:
                                      </span>
                                      {node.dependsOn.map((dep) => (
                                        <span
                                          key={dep}
                                          className="inline-block mr-2 mb-1 px-2 py-1 bg-white/10 rounded-full"
                                        >
                                          {dep}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ),
                    )}
                  </div>
                );
              }

              return null;
            })}

            {loading && (
              <div className="flex justify-center mt-10">
                <BlackLoader />
              </div>
            )}
          </div>
        </div>

        {/* CUSTOM SEARCH BAR */}
        <div className="absolute bottom-10 w-full flex justify-center px-6">
          <div className="w-full max-w-4xl">
            <div className="flex items-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-full px-6 py-4 shadow-2xl">
              <Search className="text-white/70 mr-3" size={22} />

              <input
                ref={inputRef}
                type="text"
                placeholder="Ask for a roadmap..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent outline-none text-white placeholder-white/60 text-lg"
              />

              {loading ? (
                <div className="ml-4 bg-white text-black px-6 py-2 rounded-full">
                  <WhiteLoader />
                </div>
              ) : (
                <button
                  onClick={handleGenerate}
                  className="ml-4 bg-white text-black px-6 py-2 rounded-full font-medium hover:bg-gray-200 transition"
                >
                  Generate
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Roadmap;
