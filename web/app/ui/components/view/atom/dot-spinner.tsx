const DotSpinner = () => (
  <div className="flex items-center justify-center space-x-2">
    <div className="h-1 w-1 animate-ping rounded-full bg-black"></div>
    <div className="h-1 w-1 animate-ping rounded-full bg-black delay-150 "></div>
    <div className="h-1 w-1 animate-ping rounded-full bg-black delay-300"></div>
  </div>
);

export default DotSpinner;
