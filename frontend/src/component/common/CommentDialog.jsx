import { useState } from "react";
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
} from "@mui/material";
import { FaUser, FaTimes, FaRegHeart } from "react-icons/fa";
import { formatDistanceToNowStrict } from "date-fns";

export default function CommentDialog({ open, onClose, tweet }) {
  const [newComment, setNewComment] = useState("");
  const [commentsLocal, setComments] = useState(tweet.comments);
  const handleAddComment = () => {
    if (newComment.trim() === "") {
      return;
    }
    const comment = {
      id: commentsLocal.length + 1,
      user: "CurrentUser", // Replace with logged-in user's username
      content: newComment,
    };
    setComments([...commentsLocal, comment]);
    setNewComment("");
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        style: {
          backgroundColor: "#111827", // Match the background color
          color: "#fff", // Text color
        },
      }}
    >
      {/* Dialog Header */}
      <DialogTitle
        sx={{
          padding: "10px 20px",
        }}
      >
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
              <FaUser className="text-gray-400" />
            </Avatar>
            <div className="flex items-center gap-3">
              <div>
                <div className="font-bold">{tweet.fullname}</div>
                <div className="text-gray-400 text-sm">@{tweet.username}</div>
              </div>
              <span className="text-gray-400 text-sm">
                · {formatDistanceToNowStrict(new Date(tweet.createdAt))} ago
              </span>
            </div>
          </div>
          <div className="mt-2">
            <div className="text-gray-200">{tweet.content}</div>
            {tweet.images && (
              <img
                src={
                  typeof tweet.images === "string"
                    ? tweet.images
                    : URL.createObjectURL(tweet.images)
                }
                alt="Tweet"
                className="w-full h-32 md:h-48 object-cover rounded-lg mt-2"
              />
            )}
          </div>
          {/* Label to indicate this is the original post */}
          <div className="mt-2 text-sm text-gray-500">Original Post</div>
        </div>

        {/* Comments List */}
        <List>
          {commentsLocal.length === 0 ? (
                <div className="text-gray-400 text-center py-4">There are no comments yet</div>
           ) : (
            commentsLocal.map((comment, id) => (
              <ListItem
                key={id}
                style={{
                  padding: "12px 0",
                  borderBottom: "1px solid #374151", // Add a subtle border between comments
                }}
              >
                <ListItemAvatar>
                  <Avatar style={{ backgroundColor: "#3b82f6" }}>
                    {" "}
                    {/* Blue avatar */}
                    <FaUser className="text-white" />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-white">
                        {comment.user?.username}
                      </span>
                      <span className="text-gray-400 text-sm">· 2h</span>{" "}
                      {/* Timestamp */}
                    </div>
                  }
                  secondary={
                    <span className="text-gray-300">{comment.text}</span>
                  }
                  style={{ margin: 0 }} // Remove default margin
                />
                {/* Like Button for Comments */}
                <IconButton
                  size="small"
                  style={{ color: "#9ca3af" }} // Gray color for the icon
                  onClick={() => console.log("Liked comment", comment.id)}
                >
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
            sx={{
              input: {
                color: "#fff",
                backgroundColor: "#1f2937",
                borderRadius: "8px",
                padding: "10px 15px",
              },
              fieldset: {
                borderColor: "#374151 !important", // Keeps border visible
              },
              "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                {
                  borderColor: "#3b82f6 !important", // Change border on hover
                },
            }}
          />

          <Button
            variant="contained"
            onClick={handleAddComment}
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
            Post
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
}
