import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "../services/axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

function Recommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userPreferences, setUserPreferences] = useState(null);
  const [isAIGenerated, setIsAIGenerated] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/watchlist/recommendations", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setRecommendations(response.data.recommendations || []);
        setUserPreferences(response.data.userPreferences);
        // Check if recommendations have the AI-generated structure
        setIsAIGenerated(
          response.data.recommendations &&
            response.data.recommendations.length > 0 &&
            response.data.recommendations[0].personalizedReason
        );
      }
    } catch (error) {
      console.error("Failed to fetch recommendations:", error);
      toast.error("Failed to load recommendations");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 pt-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {isAIGenerated
                ? "AI is analyzing your taste..."
                : "Analyzing your taste..."}
            </h2>
            <p className="text-gray-400">
              {isAIGenerated
                ? "Our AI is crafting personalized recommendations just for you"
                : "Preparing personalized recommendations based on your watchlist"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 pt-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-700/50 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              No Recommendations Yet
            </h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Add some anime to your watchlist to get personalized AI
              recommendations based on your taste!
            </p>
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Add Anime to Watchlist
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            AI-Powered Recommendations
          </h1>
          <p className="text-gray-400 text-lg mb-6">
            Personalized anime suggestions based on your watchlist
          </p>

          {/* AI Status Indicator */}
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-full mb-6">
            <svg
              className="w-5 h-5 text-purple-400 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
            <span className="text-purple-300 font-medium">
              {isAIGenerated ? "AI Generated" : "Curated Recommendations"}
            </span>
          </div>

          {/* User Preferences Analysis */}
          {userPreferences && (
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">
                Your Anime Profile
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">
                    {userPreferences.totalAnime}
                  </div>
                  <div className="text-sm text-gray-400">Total Anime</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {userPreferences.completedCount}
                  </div>
                  <div className="text-sm text-gray-400">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">
                    {userPreferences.watchingCount}
                  </div>
                  <div className="text-sm text-gray-400">Watching</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">
                    {userPreferences.planToWatchCount}
                  </div>
                  <div className="text-sm text-gray-400">Plan to Watch</div>
                </div>
              </div>
              <div className="mt-4 text-center">
                <span className="text-sm text-gray-400">
                  Favorite status:{" "}
                  <span className="text-purple-400 font-medium capitalize">
                    {userPreferences.favoriteStatus}
                  </span>
                </span>
              </div>
            </div>
          )}

          <button
            onClick={fetchRecommendations}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Get New Recommendations
          </button>
        </div>

        {/* Recommendations Grid */}
        <div className="grid gap-8">
          {recommendations.map((anime, index) => (
            <div
              key={index}
              className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/30 rounded-xl p-6 hover:bg-gray-800/50 hover:border-purple-500/30 transition-all duration-300"
            >
              <div className="flex items-start gap-6">
                {/* Anime Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-2xl font-bold text-white">
                      {anime.title}
                    </h3>
                    <span className="px-3 py-1 bg-purple-600/20 text-purple-300 text-sm rounded-full border border-purple-500/30">
                      {anime.type}
                    </span>
                  </div>

                  {/* Main Reason */}
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    {anime.reason}
                  </p>

                  {/* Personalized Reason */}
                  {anime.personalizedReason && (
                    <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4 mb-4">
                      <div className="flex items-start gap-3">
                        <svg
                          className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <p className="text-purple-200 text-sm">
                          <span className="font-semibold">
                            Why you'll love this:{" "}
                          </span>
                          {anime.personalizedReason}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  <p className="text-gray-400 text-sm mb-4">
                    {anime.description}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <Link
                      to={`/search?q=${encodeURIComponent(anime.title)}`}
                      className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-sm font-medium rounded-lg transition-all duration-300 transform hover:scale-105"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                      Search for Details
                    </Link>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(anime.title);
                        toast.success("Anime title copied to clipboard!");
                      }}
                      className="inline-flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-all duration-300"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                      Copy Title
                    </button>
                  </div>
                </div>

                {/* Recommendation Number */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    #{index + 1}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-gray-700/50">
          <p className="text-gray-400 text-sm">
            {isAIGenerated
              ? "Recommendations are generated using Google Gemini AI analysis of your watchlist preferences."
              : "Recommendations are curated based on your watchlist preferences."}
            <br />
            Click "Get New Recommendations" to refresh and get different
            suggestions.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Recommendations;
