import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const AIOrb = () => {
  const orbRef = useRef();
  const lightRef = useRef();
  const eyesRef = useRef();

  useEffect(() => {
    const orb = orbRef.current;
    const light = lightRef.current;
    const eyes = eyesRef.current;

    const move = (e) => {
      const rect = orb.getBoundingClientRect();

      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      // Light movement
      gsap.to(light, {
        x: x * 0.15,
        y: y * 0.15,
        duration: 0.4,
        ease: "power3.out",
      });

      // Eyes slight follow
      gsap.to(eyes, {
        x: x * 0.08,
        y: y * 0.08,
        duration: 0.4,
        ease: "power3.out",
      });
    };

    window.addEventListener("mousemove", move);

    // Breathing effect
    gsap.to(orb, {
      scale: 1.05,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    // Blinking animation
    gsap.to(eyes.children, {
      scaleY: 0.5,
      transformOrigin: "center",
      duration: 0.15,
      repeat: -1,
      repeatDelay: 3,
      yoyo: true,
      ease: "power1.inOut",
    });

    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div className="relative flex items-center justify-center mb-12">
      {/* Glow */}
      <div className="absolute w-48 h-48 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full blur-3xl opacity-30"></div>

      {/* Orb */}
      <div
        ref={orbRef}
        className="relative w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 shadow-[0_0_50px_rgba(255,0,200,0.5)] overflow-hidden flex items-center justify-center"
      >
        {/* Moving Light */}
        <div
          ref={lightRef}
          className="absolute w-20 h-20 bg-white/20 rounded-full blur-xl"
        ></div>

        {/* Glass */}
        <div className="absolute inset-0 rounded-full bg-white/10 backdrop-blur-md"></div>

        {/* 🔥 Realistic Eyes */}
        <div ref={eyesRef} className="flex gap-3 z-10">
          {/* Left Eye */}
          <div className="relative flex items-center justify-center">
            <div className="w-[4px] h-6 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.9)]"></div>
            <div className="absolute w-[6px] h-8 bg-white/30 blur-md rounded-full"></div>
          </div>

          {/* Right Eye */}
          <div className="relative flex items-center justify-center">
            <div className="w-[4px] h-6 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.9)]"></div>
            <div className="absolute w-[6px] h-8 bg-white/30 blur-md rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIOrb;
