import { useEffect, useState } from "react";
import axios from "../services/axios";
import { useAuth } from "../context/AuthContext";
import SearchAnime from "../components/SearchAnime";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Watchlist() {
  const [editingAnimeId, setEditingAnimeId] = useState(null);
  const [editData, setEditData] = useState({ status: "", score: "" });
  const { token } = useAuth();
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("title");
  const navigate = useNavigate();

  const fetchWatchlist = async () => {
    try {
      const res = await axios.get("/watchlist", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnimeList(res.data.watchlist);
      console.log(res.data.watchlist);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch watchlist:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const handleDelete = async (animeId) => {
    try {
      await axios.delete(`/watchlist/${animeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchWatchlist();
      toast.success("Anime removed from watchlist");
    } catch (err) {
      console.error("Failed to delete anime:", err);
      toast.error("Failed to remove anime");
    }
  };

  const handleUpdate = async (animeId) => {
    try {
      await axios.put(
        `/watchlist/${animeId}`,
        { status: editData.status, score: editData.score },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingAnimeId(null);
      fetchWatchlist();
      toast.success("Anime updated successfully");
    } catch (err) {
      console.error("Failed to update anime:", err);
      toast.error("Failed to update anime");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "watching":
        return "bg-[#00BCD4]";
      case "completed":
        return "bg-[#66BB6A]";
      case "dropped":
        return "bg-[#9575CD]";
      case "plan to watch":
        return "bg-[#7C4DFF]";
      default:
        return "bg-[#90A4AE]";
    }
  };

  const getStatusText = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Filter and sort anime
  const filteredAndSortedAnime = animeList
    .filter((anime) => statusFilter === "all" || anime.status === statusFilter)
    .sort((a, b) => {
      switch (sortBy) {
        case "rating-high":
          return b.score - a.score;
        case "rating-low":
          return a.score - b.score;
        case "title":
          return a.title.localeCompare(b.title);
        case "status":
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

  const statusCounts = {
    all: animeList.length,
    watching: animeList.filter((a) => a.status === "watching").length,
    completed: animeList.filter((a) => a.status === "completed").length,
    dropped: animeList.filter((a) => a.status === "dropped").length,
    "plan to watch": animeList.filter((a) => a.status === "plan to watch")
      .length,
  };

  return (
    <div className="min-h-screen bg-[#121212]">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#2979FF]/20 to-[#7C4DFF]/20"></div>
        <div className="relative z-10 px-8 py-16 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold text-[#FFC107] mb-6 mt-4 pt-4 drop-shadow-[0_2px_12px_rgba(255,193,7,0.25)]">
            My Watchlist
          </h1>
          <p className="text-xl text-[#B0BEC5] max-w-2xl mx-auto mb-10">
            Track your anime journey and manage your personal collection
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="bg-gradient-to-r from-[#FFC107] to-[#FFD600] text-[#1E1E1E] px-8 py-3 rounded-xl font-extrabold transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:from-[#FFD600] hover:to-[#FFA000]"
            >
              {showSearch ? "Hide Search" : "Add New Anime"}
            </button>
            <Link
              to="/recommendations"
              className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-[#FFC107] to-[#FFD600] text-[#1E1E1E] rounded-xl font-extrabold transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:from-[#FFD600] hover:to-[#FFA000]"
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
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
              AI Recommendations
            </Link>
          </div>
          <div className="w-24 h-1 bg-gradient-to-r from-[#90A4AE] to-[#B0BEC5] mx-auto mt-8 rounded-full"></div>
        </div>
      </div>

      {/* Search Section */}
      {showSearch && (
        <div className="px-8 pb-16">
          <div className="max-w-4xl mx-auto">
            <div className="bg-[#1E1E1E]/50 backdrop-blur-sm rounded-2xl p-8 border border-[#303030]/50 shadow-2xl">
              <SearchAnime onAdd={fetchWatchlist} />
            </div>
          </div>
        </div>
      )}

      {/* Watchlist Section */}
      <div className="px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#90A4AE] mx-auto mb-4"></div>
              <p className="text-xl text-[#B0BEC5]">
                Loading your watchlist...
              </p>
            </div>
          ) : animeList.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-32 h-32 mx-auto mb-6 bg-[#303030]/50 rounded-full flex items-center justify-center">
                <svg
                  className="w-16 h-16 text-[#90A4AE]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-[#B0BEC5] mb-2">
                Your watchlist is empty
              </h3>
              <p className="text-[#90A4AE] mb-6">
                Start by adding some anime to your collection
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => setShowSearch(true)}
                  className="bg-gradient-to-r from-[#FFC107] to-[#FFD600] text-[#1E1E1E] px-6 py-3 rounded-lg font-extrabold transition-all duration-300 hover:from-[#FFD600] hover:to-[#FFA000]"
                >
                  Add Your First Anime
                </button>
                <Link
                  to="/recommendations"
                  className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-[#FFC107] to-[#FFD600] text-[#1E1E1E] rounded-lg font-extrabold transition-all duration-300 hover:from-[#FFD600] hover:to-[#FFA000]"
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
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                  Get AI Recommendations
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Filters and Stats */}
              <div className="mb-8">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-[#B0BEC5] mb-4 mt-7">
                      Your Collection ({filteredAndSortedAnime.length} of{" "}
                      {animeList.length})
                    </h2>
                    <div className="flex flex-wrap gap-4 text-sm text-[#90A4AE] mb-2">
                      <span>
                        {
                          animeList.filter((a) => a.status === "completed")
                            .length
                        }{" "}
                        completed
                      </span>
                      <span>
                        {
                          animeList.filter((a) => a.status === "watching")
                            .length
                        }{" "}
                        watching
                      </span>
                      <span>
                        {
                          animeList.filter((a) => a.status === "plan to watch")
                            .length
                        }{" "}
                        plan to watch
                      </span>
                    </div>
                  </div>

                  {/* Filter and Sort Controls */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Status Filter */}
                    <div className="relative">
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="appearance-none bg-[#1E1E1E]/50 border border-[#303030]/50 text-[#B0BEC5] px-4 py-2 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C4DFF] focus:border-transparent backdrop-blur-sm"
                      >
                        <option value="all">
                          All Status ({statusCounts.all})
                        </option>
                        <option value="watching">
                          Watching ({statusCounts.watching})
                        </option>
                        <option value="completed">
                          Completed ({statusCounts.completed})
                        </option>
                        <option value="dropped">
                          Dropped ({statusCounts.dropped})
                        </option>
                        <option value="plan to watch">
                          Plan to Watch ({statusCounts["plan to watch"]})
                        </option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <svg
                          className="w-4 h-4 text-[#90A4AE]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Sort Options */}
                    <div className="relative">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="appearance-none bg-[#1E1E1E]/50 border border-[#303030]/50 text-[#B0BEC5] px-4 py-2 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C4DFF] focus:border-transparent backdrop-blur-sm"
                      >
                        <option value="title">Sort by Title</option>
                        <option value="rating-high">
                          Sort by Rating (High to Low)
                        </option>
                        <option value="rating-low">
                          Sort by Rating (Low to High)
                        </option>
                        <option value="status">Sort by Status</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <svg
                          className="w-4 h-4 text-[#90A4AE]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Filter Pills */}
                <div className="flex flex-wrap gap-2">
                  {Object.entries(statusCounts).map(([status, count]) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                        statusFilter === status
                          ? "bg-gradient-to-r from-[#7C4DFF] to-[#2979FF] text-[#B0BEC5] shadow-lg"
                          : "bg-[#303030]/50 text-[#90A4AE] hover:bg-[#404040]/50"
                      }`}
                    >
                      {status === "all" ? "All" : getStatusText(status)} (
                      {count})
                    </button>
                  ))}
                </div>
              </div>

              {/* Anime Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredAndSortedAnime.map((anime) => (
                  <div
                    key={anime._id}
                    className="group relative bg-[#1E1E1E]/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-[#303030]/50 hover:border-[#7C4DFF]/50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl cursor-pointer"
                    onClick={(e) => {
                      if (
                        e.target.closest("button") ||
                        e.target.closest("select") ||
                        e.target.closest("input") ||
                        e.target.closest("textarea")
                      ) {
                        return;
                      }
                      if (anime.animeId) {
                        navigate(`/anime/${anime.animeId}`);
                      } else {
                        toast.error("Unable to navigate to anime details");
                      }
                    }}
                  >
                    {/* Background Image */}
                    <div
                      className="absolute inset-0 bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity duration-300"
                      style={{ backgroundImage: `url(${anime.image})` }}
                    />

                    {/* Content */}
                    <div className="relative z-10 p-6 h-full flex flex-col">
                      {/* Anime Image */}
                      <div className="relative mb-4">
                        <img
                          src={anime.image}
                          alt={anime.title}
                          className="w-full h-48 object-cover rounded-xl shadow-lg"
                        />
                        <div className="absolute top-2 right-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium text-[#B0BEC5] ${getStatusColor(
                              anime.status
                            )}`}
                          >
                            {getStatusText(anime.status)}
                          </span>
                        </div>
                      </div>

                      {/* Title and Score */}
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-[#B0BEC5] mb-2 line-clamp-2 group-hover:text-[#7C4DFF] transition-colors">
                          {anime.title}
                        </h3>
                        <div className="flex items-center gap-2 mb-4">
                          <div className="flex items-center gap-1">
                            <svg
                              className="w-4 h-4 text-[#7C4DFF]"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="text-[#90A4AE]">
                              {anime.score}/10
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Edit Form or Action Buttons */}
                      {editingAnimeId === anime._id ? (
                        <div className="space-y-3">
                          <select
                            value={editData.status}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                status: e.target.value,
                              })
                            }
                            className="w-full p-2 rounded-lg bg-[#303030] text-[#B0BEC5] border border-[#404040] focus:outline-none focus:ring-2 focus:ring-[#7C4DFF]"
                          >
                            <option value="watching">Watching</option>
                            <option value="completed">Completed</option>
                            <option value="dropped">Dropped</option>
                            <option value="plan to watch">Plan to Watch</option>
                          </select>
                          <input
                            type="number"
                            min="0"
                            max="10"
                            value={editData.score}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                score: e.target.value,
                              })
                            }
                            className="w-full p-2 rounded-lg bg-[#303030] text-[#B0BEC5] border border-[#404040] focus:outline-none focus:ring-2 focus:ring-[#7C4DFF]"
                            placeholder="Score (0-10)"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUpdate(anime._id);
                              }}
                              className="flex-1 bg-[#7C4DFF] hover:bg-[#9575CD] text-[#B0BEC5] px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                              Save
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingAnimeId(null);
                              }}
                              className="flex-1 bg-[#303030] hover:bg-[#404040] text-[#B0BEC5] px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingAnimeId(anime._id);
                              setEditData({
                                status: anime.status,
                                score: anime.score,
                              });
                            }}
                            className="flex-1 bg-white hover:bg-[#E0E0E0] text-black px-3 py-2 rounded-2xl text-sm font-bold transition-all duration-300 transform hover:scale-105"
                          >
                            Edit
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(anime._id);
                            }}
                            className="flex-1 bg-gradient-to-r from-[#EF5350] to-[#D32F2F] hover:from-[#D32F2F] hover:to-[#EF5350] text-white px-3 py-2 rounded-2xl text-sm font-medium transition-all duration-300 transform hover:scale-105"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* No Results Message */}
              {filteredAndSortedAnime.length === 0 && animeList.length > 0 && (
                <div className="text-center py-16">
                  <div className="w-24 h-24 mx-auto mb-4 bg-[#303030]/50 rounded-full flex items-center justify-center">
                    <svg
                      className="w-12 h-12 text-[#90A4AE]"
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
                  </div>
                  <h3 className="text-xl font-semibold text-[#B0BEC5] mb-2">
                    No anime found
                  </h3>
                  <p className="text-[#90A4AE] mb-4">
                    Try adjusting your filters
                  </p>
                  <button
                    onClick={() => setStatusFilter("all")}
                    className="bg-gradient-to-r from-[#7C4DFF] to-[#2979FF] text-[#B0BEC5] px-6 py-3 rounded-lg font-medium transition-all duration-300"
                  >
                    Show All Anime
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-[#7C4DFF]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#2979FF]/10 rounded-full blur-3xl"></div>
    </div>
  );
}

export default Watchlist;
