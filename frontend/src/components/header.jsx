const Header = ({ isGuideOpen, setGuideOpen }) => {
  return (
    <header className="bg-[#121212] h-[20vh] flex items-center justify-between px-4 sm:px-12 md:px-20">
      <span className="text-gradient-mint text-2xl sm:text-3xl md:text-4xl font-semibold">
        Dropf
      </span>
      <button
        className="text-gray-200 text-sm sm:text-base md:text-lg cursor-pointer"
        onClick={() => setGuideOpen(!isGuideOpen)}
      >
        Guide
      </button>
    </header>
  );
};

export default Header;
