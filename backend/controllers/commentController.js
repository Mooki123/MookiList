const Comment = require("../models/Comment");

// Get all comments for an anime
const getComments = async (req, res) => {
  try {
    const { animeId } = req.params;
    const comments = await Comment.find({ animeId })
      .populate("user", "username avatar")
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Failed to fetch comments" });
  }
};

// Add a comment for an anime
const addComment = async (req, res) => {
  try {
    const { animeId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;
    if (!content) {
      return res.status(400).json({ message: "Comment content is required" });
    }
    const comment = new Comment({
      animeId,
      user: userId,
      content,
    });
    await comment.save();
    const populated = await Comment.findById(comment._id).populate(
      "user",
      "username avatar"
    );
    res.status(201).json(populated);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Failed to add comment" });
  }
};

module.exports = { getComments, addComment };
