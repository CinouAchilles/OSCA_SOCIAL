import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  IconButton,
  Box,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";
import { FaTimes } from "react-icons/fa";

export default function EditProfileDialog({ open, onClose, user }) {
  const [formData, setFormData] = useState({
    username: user.username || "",
    fullName: user.name || "",
    email: user.email || "",
    oldPassword: "",
    newPassword: "",
    profileImg: null,
    coverImg: null,
    bio: user.bio || "",
    link: user.link || "",
  });

  const [loading, setLoading] = useState(false);

  // Handle changes in form input
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prevData) => ({
        ...prevData,
        [name]: files[0], // for file inputs (profileImg, coverImg)
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    setLoading(true);

    // Here, you would normally make an API call to save the changes.
    setTimeout(() => {
      setLoading(false);
      onClose(); // Close the dialog after submission
    }, 2000); // Simulating an API call delay
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        style: {
          backgroundColor: "#1a202c", // Darker background to match the theme
          color: "white", // Text color
          borderRadius: "8px", // Slightly rounded corners for the dialog
        },
      }}
    >
      <DialogTitle>
        <div className="flex justify-between items-center">
          <span className="text-xl font-semibold">Edit Profile</span>
          <IconButton onClick={onClose} style={{ color: "#f7fafc" }}>
            <FaTimes />
          </IconButton>
        </div>
      </DialogTitle>

      <DialogContent>
        <form noValidate autoComplete="off">
          {/* Username */}
          <TextField
            label="Username"
            fullWidth
            name="username"
            value={formData.username}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            inputProps={{
              style: {
                backgroundColor: "#2d3748",
                borderRadius: "4px",
                color: "white",
              },
            }}
            InputLabelProps={{ style: { color: "#cbd5e0" } }}
          />

          {/* Full Name */}
          <TextField
            label="Full Name"
            fullWidth
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            inputProps={{
              style: {
                backgroundColor: "#2d3748",
                borderRadius: "4px",
                color: "white",
              },
            }}
            InputLabelProps={{ style: { color: "#cbd5e0" } }}
          />

          {/* Email */}
          <TextField
            label="Email"
            fullWidth
            name="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            inputProps={{
              style: {
                backgroundColor: "#2d3748",
                borderRadius: "4px",
                color: "white",
              },
            }}
            InputLabelProps={{ style: { color: "#cbd5e0" } }}
          />

          {/* Old Password */}
          <TextField
            label="Old Password"
            fullWidth
            name="oldPassword"
            type="password"
            value={formData.oldPassword}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            inputProps={{
              style: {
                backgroundColor: "#2d3748",
                borderRadius: "4px",
                color: "white",
              },
            }}
            InputLabelProps={{ style: { color: "#cbd5e0" } }}
          />

          {/* New Password */}
          <TextField
            label="New Password"
            fullWidth
            name="newPassword"
            type="password"
            value={formData.newPassword}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            inputProps={{
              style: {
                backgroundColor: "#2d3748",
                borderRadius: "4px",
                color: "white",
              },
            }}
            InputLabelProps={{ style: { color: "#cbd5e0" } }}
          />

          <TextField
            label="Bio"
            fullWidth
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            rows={4}
            multiline
            inputProps={{
              style: {
                backgroundColor: "#2d3748",
                borderRadius: "4px",
                color: "white",
              },
              maxLength: 100, // Limit to 100 characters
            }}
            InputLabelProps={{ style: { color: "#cbd5e0" } }}
            helperText={`${formData.bio.length}/100`} // Display the character count
            FormHelperTextProps={{
              style: {
                color: formData.bio.length === 100 ? "red" : "#cbd5e0", // Highlight when at max length
                fontSize: "0.875rem",
              },
            }}
          />

          {/* Link */}
          <TextField
            label="Link"
            fullWidth
            name="link"
            value={formData.link}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            inputProps={{
              style: {
                backgroundColor: "#2d3748",
                borderRadius: "4px",
                color: "white",
              },
            }}
            InputLabelProps={{ style: { color: "#cbd5e0" } }}
          />

          {/* Profile Image */}
          <Box marginY={2}>
            <input
              type="file"
              name="profileImg"
              accept="image/*"
              onChange={handleChange}
              style={{ display: "none" }}
              id="profile-img-input"
            />
            <label htmlFor="profile-img-input">
              <Button
                variant="outlined"
                component="span"
                fullWidth
                style={{
                  backgroundColor: "#2b6cb0", // Color for buttons
                  color: "#fff",
                  border: "1px solid #2b6cb0",
                }}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "#3182ce")
                }
                onMouseOut={(e) => (e.target.style.backgroundColor = "#2b6cb0")}
              >
                Change Profile Image
              </Button>
            </label>
          </Box>

          {/* Cover Image */}
          <Box marginY={2}>
            <input
              type="file"
              name="coverImg"
              accept="image/*"
              onChange={handleChange}
              style={{ display: "none" }}
              id="cover-img-input"
            />
            <label htmlFor="cover-img-input">
              <Button
                variant="outlined"
                component="span"
                fullWidth
                style={{
                  backgroundColor: "#2b6cb0", // Color for buttons
                  color: "#fff",
                  border: "1px solid #2b6cb0",
                }}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "#3182ce")
                }
                onMouseOut={(e) => (e.target.style.backgroundColor = "#2b6cb0")}
              >
                Change Cover Image
              </Button>
            </label>
          </Box>
        </form>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={onClose}
          color="secondary"
          style={{
            backgroundColor: "#f56565", // Red for cancel
            color: "#fff",
            borderRadius: "4px",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#e53e3e")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#f56565")}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          disabled={loading}
          startIcon={loading && <CircularProgress size={20} />}
          style={{
            backgroundColor: "#38a169", // Green for save
            color: "#fff",
            borderRadius: "4px",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#2f855a")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#38a169")}
        >
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
