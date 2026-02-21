import React from "react";

const WhiteLoader = () => {
  return (
    <div className="flex z-[10000000] items-center justify-center">
      {" "}
      <div
        className={`w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin`}
      ></div>
    </div>
  );
};

export default WhiteLoader;
