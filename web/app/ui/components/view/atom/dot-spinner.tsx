const DotSpinner = () => (
  <div className="flex items-center justify-center space-x-2">
    <div className=" relative flex h-2 w-2 ">
      <span className=" absolute inline-flex h-full w-full animate-ping rounded-full bg-black"></span>
      <span className=" relative inline-flex h-2 w-2 rounded-full bg-gray-500"></span>
    </div>
    <div className=" relative flex h-2 w-2 ">
      <span className=" absolute inline-flex h-full w-full animate-ping rounded-full bg-black delay-150"></span>
      <span className=" relative inline-flex h-2 w-2 rounded-full bg-gray-500"></span>
    </div>
    <div className=" relative flex h-2 w-2 ">
      <span className=" absolute inline-flex h-full w-full animate-ping rounded-full bg-black delay-150"></span>
      <span className=" relative inline-flex h-2 w-2 rounded-full bg-gray-500"></span>
    </div>
  </div>
);

export default DotSpinner;
