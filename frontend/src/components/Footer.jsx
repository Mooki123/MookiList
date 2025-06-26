import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

export default function Footer() {
  return (
    <footer
      className="bg-black pt-10 pb-8 border-t-4 border-transparent relative"
      style={{ borderImage: "linear-gradient(to right, #a78bfa, #ec4899) 1" }}
    >
      {/* Gradient fade for smooth transition */}
      <div className="absolute -top-4 left-0 w-full h-4 bg-gradient-to-t from-black to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
        {/* Info Section */}
        <div className="text-center md:text-left">
          <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mb-1 drop-shadow-lg">
            Anime Watchlist
          </h2>
          <p className="text-sm text-white">
            Track, manage, and get AI-powered recommendations for your anime
            journey.
          </p>
          <p className="text-xs mt-2 text-gray-300">
            &copy; {new Date().getFullYear()} Lakshay Saharan. All rights
            reserved.
          </p>
        </div>

        {/* Dummy Links */}
        <div className="flex flex-col items-center gap-2">
          <span className="font-semibold text-white mb-1">Quick Links</span>
          <div className="flex gap-4">
            <a
              href="#"
              className="hover:text-purple-400 transition font-medium text-white"
            >
              About
            </a>
            <a
              href="#"
              className="hover:text-pink-400 transition font-medium text-white"
            >
              Contact
            </a>
            <a
              href="#"
              className="hover:text-purple-300 transition font-medium text-white"
            >
              Blog
            </a>
            <a
              href="#"
              className="hover:text-pink-300 transition font-medium text-white"
            >
              FAQ
            </a>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex flex-col items-center gap-2">
          <span className="font-semibold text-white mb-1">Connect</span>
          <div className="flex gap-4 text-2xl">
            <a
              href="https://www.linkedin.com/in/lakshay-saharan-30b904287/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-purple-400 transition text-white drop-shadow-lg"
              title="LinkedIn"
            >
              <FaLinkedin />
            </a>
            <a
              href="mailto:lakshaysaharan769@gmail.com"
              className="hover:text-pink-400 transition text-white drop-shadow-lg"
              title="Email"
            >
              <FaEnvelope />
            </a>
            <a
              href="https://github.com/Mooki123"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-purple-300 transition text-white drop-shadow-lg"
              title="GitHub"
            >
              <FaGithub />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
