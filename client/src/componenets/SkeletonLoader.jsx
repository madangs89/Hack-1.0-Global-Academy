const SkeletonLoader = () => {
  return (
    <div className="relative rounded-3xl mt-7 p-6 w-[300px] mx-auto border h-[350px] border-gray-200 overflow-hidden">
      
      {/* Base background */}
      <div className="h-full w-full  rounded-xl" />

      {/* Shimmer overlay */}
      <div className="absolute inset-0 shimmer" />
      
    </div>
  );
};

export default SkeletonLoader;