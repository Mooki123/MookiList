// services/jikan.js
import axios from "axios";

const BASE_URL = "https://api.jikan.moe/v4";

// Enhanced search function with filters
export const searchAnime = async (params) => {
  try {
    const response = await axios.get(`${BASE_URL}/anime`, {
      params,
      timeout: 10000, // 10 second timeout
    });
    return response.data.data;
  } catch (error) {
    if (error.response?.status === 429) {
      throw new Error(
        "Rate limit exceeded. Please wait a moment before searching again."
      );
    }
    if (error.code === "ECONNABORTED") {
      throw new Error("Request timed out. Please try again.");
    }
    throw new Error(`Search failed: ${error.message}`);
  }
};

// Advanced search with filters
export const advancedSearchAnime = async (query, filters = {}) => {
  const params = {
    q: query,
    sfw: true,
    order_by: "popularity",
    sort: "desc",
    limit: 20,
  };

  // Add filters if provided
  if (filters.status) {
    params.status = filters.status;
  }
  if (filters.type) {
    params.type = filters.type;
  }
  if (filters.genre) {
    params.genres = filters.genre;
  }
  if (filters.rating) {
    params.rating = filters.rating;
  }

  return searchAnime(params);
};

export const getAnimeDetails = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/anime/${id}`, {
      timeout: 10000,
    });
    return response.data.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error("Anime not found");
    }
    throw new Error(`Failed to fetch anime details: ${error.message}`);
  }
};

// Get top anime (for recommendations)
export const getTopAnime = async (type = "tv", page = 1) => {
  try {
    const response = await axios.get(`${BASE_URL}/top/anime`, {
      params: { type, page },
      timeout: 10000,
    });
    return response.data.data;
  } catch (error) {
    throw new Error(`Failed to fetch top anime: ${error.message}`);
  }
};

// Get seasonal anime
export const getSeasonalAnime = async (year, season) => {
  try {
    const response = await axios.get(`${BASE_URL}/seasons/${season}/${year}`, {
      timeout: 10000,
    });
    return response.data.data;
  } catch (error) {
    throw new Error(`Failed to fetch seasonal anime: ${error.message}`);
  }
};
