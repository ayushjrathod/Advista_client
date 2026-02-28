const HeroButton = () => {
  return (
    <div className="relative group">
      <button className="relative inline-block p-px font-semibold leading-6 shadow-lg shadow-[#5f07f7] text-white bg-zinc-900 cursor-pointer rounded-2xl transition-all duration-300 ease-in-out active:scale-95 group-hover:text-zinc-900">
        <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#5f07f7] via-[#8b5cf6] to-[#5f07f7] p-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
        <span className="relative z-10 block px-6 py-3 rounded-2xl bg-zinc-950 transition-colors duration-300 group-hover:bg-white">
          <div className="relative z-10 flex items-center space-x-3">
            <span>
              Start Research
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-7 h-7"
            >
              <path d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"></path>
            </svg>
          </div>
        </span>
      </button>
    </div>
  );
};

export default HeroButton;
