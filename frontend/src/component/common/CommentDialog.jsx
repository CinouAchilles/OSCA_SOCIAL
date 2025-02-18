import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { FaUser, FaTimes, FaRegHeart } from "react-icons/fa";
import { formatDistanceToNowStrict } from "date-fns";
import toast, { Toaster } from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";

export default function CommentDialog({ open, onClose, tweet }) {
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState("");
  const [commentsLocal, setComments] = useState(tweet.comments || []);
  // Sync local comments with tweet updates
  useEffect(() => {
    setComments(tweet.comments || []);
  }, [tweet.comments]);

  // Mutation for posting a comment
  const { mutate: commentPost, isPending } = useMutation({
    mutationFn: async (commentText) => {
      try {
        const res = await fetch(
          `/api/posts/comment/${tweet.id || tweet._id}`,
          {
            method: "POST",
            body: JSON.stringify({ text: commentText }),
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Something went wrong!");
        return data;
      } catch (error) {
        throw new Error(error.message || "Network error");
      }
    },

    onSuccess: (data) => {
      if (!data.comment || !data.comment.user) {
        console.error("Invalid API response:", data);
        toast.error("Failed to post comment.", {
          style: { background: "#333", color: "#fff" },
        });
        return;
      }

      setComments((prev) => [...prev, data.comment]);
      setNewComment("");
      queryClient.invalidateQueries({ queryKey: ["tweets"] });
      queryClient.invalidateQueries({ queryKey: ["savedPosts"] });
    },

    onError: (error) => {
      toast.error(error.message || "Failed to post comment.", {
        style: { background: "#333", color: "#fff" },
      });
    },
  });

  const handleAddComment = (e) => {
    e.preventDefault();
    if (isPending || !newComment.trim()) {
      toast.error("Comments can't be empty!", {
        style: { background: "#333", color: "#fff" },
      });
      return;
    }
    commentPost(newComment);
  };

  // Reusable styles
  const dialogStyles = { backgroundColor: "#111827", color: "#fff" };
  const inputStyles = {
    input: {
      color: "#fff",
      backgroundColor: "#1f2937",
      borderRadius: "8px",
      padding: "10px 15px",
    },
    fieldset: { borderColor: "#374151 !important" },
    "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#3b82f6 !important",
    },
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{ style: dialogStyles }}
    >
      <Toaster/>
      {/* Dialog Header */}
      <DialogTitle sx={{ padding: "10px 20px" }}>
        <div className="flex items-center justify-between">
          <span>Comments</span>
          <IconButton onClick={onClose} style={{ color: "#fff" }}>
            <FaTimes />
          </IconButton>
        </div>
      </DialogTitle>

      {/* Dialog Content */}
      <DialogContent dividers style={{ backgroundColor: "#111820" }}>
        {/* Tweet Content */}
        <div className="mb-4 p-4 bg-gray-900 rounded-lg border border-gray-700">
          <div className="flex items-center space-x-3">
            <Avatar style={{ backgroundColor: "#1f2937" }}>
              {/* <FaUser className="text-gray-400" /> */}
              <div
                style={{
                  backgroundImage: `url(${
                    tweet.profileImg || tweet.user?.profileImg || "https://placehold.co/150"
                  })`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  backgroundColor: "#374151",
                  zIndex: 10,
                }}
              ></div>
            </Avatar>
            <div className="flex items-center gap-3">
              <div>
                <Link
                  to={`/profile/${
                    tweet.username || tweet.user.username || "test"
                  }`}
                >
                  <div className="font-bold hover:underline cursor-pointer">
                    {tweet.fullname || tweet.user.fullname}
                  </div>
                </Link>
                <div className="text-gray-400 text-sm">
                  @{tweet.username || tweet.user.username}
                </div>
              </div>
              <span className="text-gray-400 text-sm">
                ·{" "}
                {tweet.createdAt
                  ? formatDistanceToNowStrict(new Date(tweet.createdAt))
                  : "Just now"}{" "}
                ago
              </span>
            </div>
          </div>
          <div className="mt-2 text-gray-200">
            {tweet.content || tweet.text}
          </div>
          {(tweet.images || tweet.img) && (
            <img
              src={
                typeof (tweet.images || tweet.img) !== "object"
                  ? tweet.images || tweet.img
                  : URL.createObjectURL(tweet.images || tweet.img)
              }
              alt="Tweet"
              className="w-full h-32 md:h-48 object-cover rounded-lg mt-2"
            />
          )}
          <div className="mt-2 text-sm text-gray-500">Original Post</div>
        </div>

        {/* Comments List */}
        <List>
          {commentsLocal.length === 0 ? (
            <div className="text-gray-400 text-center py-4">
              There are no comments yet
            </div>
          ) : (
            commentsLocal.map((comment) => (
              <ListItem
                key={comment._id || Math.random()}
                style={{ padding: "12px 0", borderBottom: "1px solid #374151" }}
              >
                <ListItemAvatar>
                  <Avatar style={{ backgroundColor: "#3b82f6" }}>
                    {/* <FaUser className="text-white" /> */}
                    <div
                      style={{
                        backgroundImage: `url(${
                          comment.profileImg || comment.user?.profileImg || ""
                        })`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        width: "100%",
                        height: "100%",
                        borderRadius: "50%",
                        backgroundColor: "#374151",
                        zIndex: 10,
                      }}
                    ></div>
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/profile/${
                          comment.username || comment.user?.username || "test"
                        }`}
                      >
                        <span className="font-bold text-white hover:underline cursor-pointer">
                          {comment.user?.username || "Unknown User"}
                        </span>
                      </Link>
                      <span className="text-gray-400 text-sm">
                        ·{" "}
                        {comment.createdAt
                          ? formatDistanceToNowStrict(
                              new Date(comment.createdAt)
                            ) + " ago"
                          : "Unknown time"}
                      </span>
                    </div>
                  }
                  secondary={
                    <span className="text-gray-300">{comment.text}</span>
                  }
                />
                {/* Like Button */}
                <IconButton size="small" style={{ color: "#9ca3af" }}>
                  <FaRegHeart className="w-4 h-4" />
                </IconButton>
              </ListItem>
            ))
          )}
        </List>
      </DialogContent>

      {/* Add Comment Section */}
      <DialogActions style={{ backgroundColor: "#111827", padding: "10px" }}>
        <div className="flex items-center w-full p-2">
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            sx={inputStyles}
          />

          <Button
            variant="contained"
            onClick={handleAddComment}
            disabled={isPending}
            className="transition-all duration-200"
            style={{
              backgroundColor: "#2563eb",
              color: "#fff",
              padding: "8px 14px",
              fontWeight: "500",
              textTransform: "none",
              borderRadius: "0 10px 10px 0",
            }}
          >
            {isPending ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Post"
            )}
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
}
