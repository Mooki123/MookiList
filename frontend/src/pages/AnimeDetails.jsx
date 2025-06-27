// pages/AnimeDetails.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getAnimeDetails } from "../services/jikan";
import axios from "../services/axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

function AnimeDetails() {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);
  const { token } = useAuth();
  // Comments state
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const [commentsLoading, setCommentsLoading] = useState(true);

  useEffect(() => {
    fetchAnimeDetails();
    fetchComments();
  }, [id]);

  const fetchAnimeDetails = async () => {
    try {
      setLoading(true);
      console.log("Fetching anime details for ID:", id); // Debug log
      const data = await getAnimeDetails(id);
      console.log("Anime details received:", data); // Debug log
      setAnime(data);
    } catch (error) {
      console.error("Failed to fetch anime details:", error);
      console.error("Error details:", error.response?.data || error.message);
      toast.error("Failed to load anime details");
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      setCommentsLoading(true);
      const res = await axios.get(`/comments/${id}`);
      setComments(res.data);
    } catch {
      setComments([]);
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    try {
      const res = await axios.post(
        `/comments/${id}`,
        { content: commentInput },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setComments([...comments, res.data]);
      setCommentInput("");
      toast.success("Comment added successfully!");
    } catch (error) {
      console.error("Failed to add comment:", error);
      toast.error("Failed to add comment");
    }
  };

  const handleAddToList = async () => {
    try {
      await axios.post(
        "/watchlist",
        {
          animeId: anime.mal_id,
          title: anime.title,
          image: anime.images.jpg.large_image_url || anime.images.jpg.image_url,
          status: "plan to watch",
          score: 0,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Anime added to watchlist!");
    } catch (error) {
      console.error("Failed to add anime:", error);
      toast.error("Failed to add anime to watchlist");
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "currently airing":
        return "bg-[#00BCD4]";
      case "finished airing":
        return "bg-[#66BB6A]";
      case "not yet aired":
        return "bg-[#7C4DFF]";
      default:
        return "bg-[#90A4AE]";
    }
  };

  const getRatingColor = (rating) => {
    if (rating >= 8) return "text-[#66BB6A]";
    if (rating >= 7) return "text-[#FFC107]";
    if (rating >= 6) return "text-[#FF9800]";
    return "text-[#F44336]";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#FFC107] mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-[#E0E0E0] mb-2">Loading...</h2>
          <p className="text-[#90A4AE]">Fetching anime details</p>
        </div>
      </div>
    );
  }

  if (!anime) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#E0E0E0] mb-4">
            Anime not found
          </h2>
          <Link
            to="/search"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#FFC107] to-[#FFD600] hover:from-[#FFD600] hover:to-[#FFA000] text-[#1E1E1E] font-semibold rounded-xl transition-all duration-300"
          >
            Back to Search
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212]">
      {/* Hero Section */}
      <div className="relative h-96 md:h-[500px] overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${anime.images.jpg.large_image_url})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/80 to-transparent"></div>
        </div>

        {/* Content Overlay */}
        <div className="relative h-full flex items-end">
          <div className="container mx-auto px-6 pb-8">
            <div className="flex flex-col md:flex-row items-end gap-8">
              {/* Anime Poster */}
              <div className="flex-shrink-0">
                <img
                  src={anime.images.jpg.large_image_url}
                  alt={anime.title}
                  className="w-48 h-72 md:w-64 md:h-96 object-cover rounded-2xl shadow-2xl border-4 border-white/10"
                />
              </div>

              {/* Anime Info */}
              <div className="flex-1 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      anime.status
                    )}`}
                  >
                    {anime.status}
                  </span>
                  <span className="px-3 py-1 bg-[#7C4DFF] rounded-full text-xs font-semibold">
                    {anime.type}
                  </span>
                  {anime.episodes && (
                    <span className="px-3 py-1 bg-[#2979FF] rounded-full text-xs font-semibold">
                      {anime.episodes} Episodes
                    </span>
                  )}
                </div>

                <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight text-[#E0E0E0]">
                  {anime.title}
                </h1>

                {anime.title_english && anime.title_english !== anime.title && (
                  <p className="text-xl text-[#B0BEC5] mb-4">
                    {anime.title_english}
                  </p>
                )}

                <div className="flex items-center gap-6 mb-6">
                  {anime.score && (
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-[#FFC107]"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span
                        className={`text-xl font-bold ${getRatingColor(
                          anime.score
                        )}`}
                      >
                        {anime.score}/10
                      </span>
                    </div>
                  )}
                  {anime.scored_by && (
                    <span className="text-[#B0BEC5]">
                      {anime.scored_by.toLocaleString()} votes
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={handleAddToList}
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#FFC107] to-[#FFD600] hover:from-[#FFD600] hover:to-[#FFA000] text-[#1E1E1E] font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
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
                    Add to Watchlist
                  </button>

                  {anime.trailer?.url && (
                    <button
                      onClick={() => setShowTrailer(true)}
                      className="inline-flex items-center px-6 py-3 bg-[#F44336] hover:bg-[#D32F2F] text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
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
                          d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Watch Trailer
                    </button>
                  )}

                  <Link
                    to={`/search?q=${encodeURIComponent(anime.title)}`}
                    className="inline-flex items-center px-6 py-3 bg-[#303030] hover:bg-[#404040] text-[#E0E0E0] font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
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
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    Search Similar
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Synopsis and Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Synopsis */}
            <div className="bg-[#1E1E1E]/50 backdrop-blur-sm border border-[#303030]/50 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-[#E0E0E0] mb-4 flex items-center">
                <svg
                  className="w-6 h-6 mr-3 text-[#FFC107]"
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
                Synopsis
              </h2>
              <p className="text-[#B0BEC5] leading-relaxed text-lg">
                {anime.synopsis || "No synopsis available."}
              </p>
            </div>

            {/* Additional Details */}
            <div className="bg-[#1E1E1E]/50 backdrop-blur-sm border border-[#303030]/50 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-[#E0E0E0] mb-6 flex items-center">
                <svg
                  className="w-6 h-6 mr-3 text-[#FFC107]"
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
                Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {anime.aired?.from && (
                  <div>
                    <h3 className="text-sm font-semibold text-[#90A4AE] uppercase tracking-wide mb-2">
                      Aired
                    </h3>
                    <p className="text-[#E0E0E0]">
                      {new Date(anime.aired.from).toLocaleDateString()}
                    </p>
                  </div>
                )}

                {anime.duration && (
                  <div>
                    <h3 className="text-sm font-semibold text-[#90A4AE] uppercase tracking-wide mb-2">
                      Duration
                    </h3>
                    <p className="text-[#E0E0E0]">{anime.duration}</p>
                  </div>
                )}

                {anime.rating && (
                  <div>
                    <h3 className="text-sm font-semibold text-[#90A4AE] uppercase tracking-wide mb-2">
                      Rating
                    </h3>
                    <p className="text-[#E0E0E0]">{anime.rating}</p>
                  </div>
                )}

                {anime.source && (
                  <div>
                    <h3 className="text-sm font-semibold text-[#90A4AE] uppercase tracking-wide mb-2">
                      Source
                    </h3>
                    <p className="text-[#E0E0E0]">{anime.source}</p>
                  </div>
                )}

                {anime.season && (
                  <div>
                    <h3 className="text-sm font-semibold text-[#90A4AE] uppercase tracking-wide mb-2">
                      Season
                    </h3>
                    <p className="text-[#E0E0E0]">
                      {anime.season} {anime.year}
                    </p>
                  </div>
                )}

                {anime.broadcast?.string && (
                  <div>
                    <h3 className="text-sm font-semibold text-[#90A4AE] uppercase tracking-wide mb-2">
                      Broadcast
                    </h3>
                    <p className="text-[#E0E0E0]">{anime.broadcast.string}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Genres */}
            {anime.genres && anime.genres.length > 0 && (
              <div className="bg-[#1E1E1E]/50 backdrop-blur-sm border border-[#303030]/50 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-[#E0E0E0] mb-6 flex items-center">
                  <svg
                    className="w-6 h-6 mr-3 text-[#FFC107]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                  Genres
                </h2>
                <div className="flex flex-wrap gap-3">
                  {anime.genres.map((genre) => (
                    <span
                      key={genre.mal_id}
                      className="px-4 py-2 bg-gradient-to-r from-[#FFC107] to-[#FFD600] text-[#1E1E1E] text-sm font-semibold rounded-full hover:from-[#FFD600] hover:to-[#FFA000] transition-all duration-300 transform hover:scale-105"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Comments Section */}
            <div className="bg-[#1E1E1E]/50 backdrop-blur-sm border border-[#303030]/50 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-[#E0E0E0] mb-6 flex items-center">
                <svg
                  className="w-6 h-6 mr-3 text-[#FFC107]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                Comments ({comments.length})
              </h2>

              {/* Add Comment Form */}
              {token && (
                <form onSubmit={handleAddComment} className="mb-6">
                  <div className="flex gap-3">
                    <textarea
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      placeholder="Share your thoughts about this anime..."
                      className="flex-1 bg-[#303030]/50 border border-[#404040]/50 rounded-xl p-3 text-[#E0E0E0] placeholder-[#90A4AE] focus:outline-none focus:ring-2 focus:ring-[#FFC107] focus:border-transparent resize-none"
                      rows="3"
                    />
                    <button
                      type="submit"
                      disabled={!commentInput.trim()}
                      className="px-6 py-3 bg-gradient-to-r from-[#FFC107] to-[#FFD600] hover:from-[#FFD600] hover:to-[#FFA000] text-[#1E1E1E] rounded-xl font-medium transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      Post
                    </button>
                  </div>
                </form>
              )}

              {/* Comments List */}
              <div className="space-y-4">
                {commentsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FFC107] mx-auto"></div>
                    <p className="text-[#90A4AE] mt-2">Loading comments...</p>
                  </div>
                ) : comments.length > 0 ? (
                  comments.map((comment) => (
                    <div
                      key={comment._id}
                      className="bg-[#303030]/30 backdrop-blur-sm border border-[#404040]/30 rounded-xl p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-[#FFC107] to-[#FFD600] rounded-full flex items-center justify-center text-[#1E1E1E] font-semibold text-sm flex-shrink-0">
                          {comment.user?.username?.charAt(0).toUpperCase() ||
                            "U"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-[#E0E0E0]">
                              {comment.user?.username || "Unknown User"}
                            </span>
                            <span className="text-xs text-[#90A4AE]">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-[#B0BEC5] leading-relaxed">
                            {comment.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-[#303030]/50 rounded-full flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-[#90A4AE]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-[#B0BEC5] mb-2">
                      No comments yet
                    </h3>
                    <p className="text-[#90A4AE]">
                      {token
                        ? "Be the first to share your thoughts!"
                        : "Sign in to leave a comment"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Stats and Links */}
          <div className="space-y-8">
            {/* Statistics */}
            <div className="bg-[#1E1E1E]/50 backdrop-blur-sm border border-[#303030]/50 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-[#E0E0E0] mb-6 flex items-center">
                <svg
                  className="w-6 h-6 mr-3 text-[#FFC107]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                Statistics
              </h2>

              <div className="space-y-4">
                {anime.rank && (
                  <div className="flex justify-between items-center">
                    <span className="text-[#B0BEC5]">Rank</span>
                    <span className="text-[#E0E0E0] font-semibold">
                      #{anime.rank}
                    </span>
                  </div>
                )}

                {anime.popularity && (
                  <div className="flex justify-between items-center">
                    <span className="text-[#B0BEC5]">Popularity</span>
                    <span className="text-[#E0E0E0] font-semibold">
                      #{anime.popularity}
                    </span>
                  </div>
                )}

                {anime.members && (
                  <div className="flex justify-between items-center">
                    <span className="text-[#B0BEC5]">Members</span>
                    <span className="text-[#E0E0E0] font-semibold">
                      {anime.members.toLocaleString()}
                    </span>
                  </div>
                )}

                {anime.favorites && (
                  <div className="flex justify-between items-center">
                    <span className="text-[#B0BEC5]">Favorites</span>
                    <span className="text-[#E0E0E0] font-semibold">
                      {anime.favorites.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* External Links */}
            <div className="bg-[#1E1E1E]/50 backdrop-blur-sm border border-[#303030]/50 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-[#E0E0E0] mb-6 flex items-center">
                <svg
                  className="w-6 h-6 mr-3 text-[#FFC107]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                Links
              </h2>

              <div className="space-y-3">
                <a
                  href={anime.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between w-full px-4 py-3 bg-[#2979FF] hover:bg-[#1565C0] text-white rounded-lg transition-colors duration-300"
                >
                  <span>MyAnimeList</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>

                {anime.trailer?.url && (
                  <button
                    onClick={() => setShowTrailer(true)}
                    className="flex items-center justify-between w-full px-4 py-3 bg-[#F44336] hover:bg-[#D32F2F] text-white rounded-lg transition-colors duration-300"
                  >
                    <span>Watch Trailer</span>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trailer Modal */}
      {showTrailer && anime.trailer?.url && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-4xl">
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute -top-12 right-0 text-white hover:text-[#B0BEC5] transition-colors duration-300"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div className="relative w-full h-0 pb-[56.25%]">
              <iframe
                src={anime.trailer.url.replace("watch?v=", "embed/")}
                className="absolute inset-0 w-full h-full rounded-2xl"
                allowFullScreen
                title={`${anime.title} Trailer`}
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AnimeDetails;
