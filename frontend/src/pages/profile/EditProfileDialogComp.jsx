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
  Avatar,
} from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaTimes } from "react-icons/fa";

export default function EditProfileDialog({ open, onClose, user, onUpdateProfile, isUpdating }) {
  const [profilePreview, setProfilePreview] = useState(user?.profileImg || "https://placehold.co/200x200");
  const [coverPreview, setCoverPreview] = useState(user?.coverImg || null);
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    username: user?.username || "",
    fullname: user?.fullname || "",
    email: user?.email || "",
    oldPassword: "",
    newPassword: "",
    profileImg: user?.profileImg || null,
    coverImg: user?.coverImg || null,
    bio: user?.bio || "",
    link: user?.link || "",
  });

  // Reset form data when user changes
  useEffect(() => {
    setFormData({
      username: user?.username || "",
      fullname: user?.fullname || "",
      email: user?.email || "",
      oldPassword: "",
      newPassword: "",
      profileImg: user?.profileImg || null,
      coverImg: user?.coverImg || null,
      bio: user?.bio || "",
      link: user?.link || "",
    });
    setProfilePreview(user?.profileImg || "https://placehold.co/200x200");
    setCoverPreview(user?.coverImg || null);
  }, [user]);

  // Handle Text Inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Image Uploads (with Preview)
  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) {
      toast.error("No file selected.", { style: { background: "#333", color: "#fff" } });
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file.", { style: { background: "#333", color: "#fff" } });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === "profile") {
        setProfilePreview(reader.result);
        setFormData((prev) => ({ ...prev, profileImg: reader.result }));
      } else {
        setCoverPreview(reader.result);
        setFormData((prev) => ({ ...prev, coverImg: reader.result }));
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.username || !formData.fullname || !formData.email) {
      toast.error("Please fill out all required fields.", { style: { background: "#333", color: "#fff" } });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address.", { style: { background: "#333", color: "#fff" } });
      return;
    }

    // Update profile
    onUpdateProfile(formData, { onSuccess: onClose });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        style: {
          backgroundColor: "#1a202c",
          color: "white",
          borderRadius: "8px",
        },
      }}
    >
      <DialogTitle>
        <div className="flex justify-between items-center">
          <span className="text-xl font-semibold">Edit Profile</span>
          <IconButton onClick={onClose} style={{ color: "#f7fafc" }} aria-label="Close">
            <FaTimes />
          </IconButton>
        </div>
      </DialogTitle>

      <DialogContent>
        <form onSubmit={handleSubmit} noValidate autoComplete="off">
          {/* Profile Image Preview */}
          <Box display="flex" justifyContent="center" my={2}>
            <Avatar src={profilePreview} sx={{ width: 80, height: 80 }} />
          </Box>

          {/* Profile Image Upload */}
          <Box marginY={2}>
            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "profile")} hidden id="profile-img-input" />
            <label htmlFor="profile-img-input">
              <Button variant="outlined" component="span" fullWidth
                style={{ backgroundColor: "#2b6cb0", color: "#fff", border: "1px solid #2b6cb0" }}
                onMouseOver={(e) => (e.target.style.backgroundColor = "#3182ce")}
                onMouseOut={(e) => (e.target.style.backgroundColor = "#2b6cb0")}
              >
                Change Profile Image
              </Button>
            </label>
          </Box>

          {/* Cover Image Preview */}
          <Box display="flex" justifyContent="center" my={2}>
            {coverPreview && <img src={coverPreview} alt="Cover Preview" style={{ width: "100%", borderRadius: "8px" }} />}
          </Box>

          {/* Cover Image Upload */}
          <Box marginY={2}>
            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "cover")} hidden id="cover-img-input" />
            <label htmlFor="cover-img-input">
              <Button variant="outlined" component="span" fullWidth
                style={{ backgroundColor: "#2b6cb0", color: "#fff", border: "1px solid #2b6cb0" }}
                onMouseOver={(e) => (e.target.style.backgroundColor = "#3182ce")}
                onMouseOut={(e) => (e.target.style.backgroundColor = "#2b6cb0")}
              >
                Change Cover Image
              </Button>
            </label>
          </Box>

          {/* Username */}
          <TextField label="@Username" fullWidth name="username" value={formData.username} onChange={handleChange} margin="normal" variant="outlined"
            inputProps={{ style: { backgroundColor: "#2d3748", borderRadius: "4px", color: "white" } }}
            InputLabelProps={{ style: { color: "#cbd5e0" } }}
          />

          {/* Full Name */}
          <TextField label="Full Name" fullWidth name="fullname" value={formData.fullname} onChange={handleChange} margin="normal" variant="outlined"
            inputProps={{ style: { backgroundColor: "#2d3748", borderRadius: "4px", color: "white" } }}
            InputLabelProps={{ style: { color: "#cbd5e0" } }}
          />

          {/* Email */}
          <TextField label="Email" fullWidth name="email" value={formData.email} onChange={handleChange} margin="normal" variant="outlined"
            inputProps={{ style: { backgroundColor: "#2d3748", borderRadius: "4px", color: "white" } }}
            InputLabelProps={{ style: { color: "#cbd5e0" } }}
          />

          {/* Bio */}
          <TextField label="Bio" fullWidth name="bio" value={formData.bio} onChange={handleChange} margin="normal" variant="outlined" rows={4} multiline
            inputProps={{ style: { backgroundColor: "#2d3748", borderRadius: "4px", color: "white" }, maxLength: 100 }}
            InputLabelProps={{ style: { color: "#cbd5e0" } }}
            helperText={`${formData.bio.length}/100`}
            FormHelperTextProps={{ style: { color: formData.bio.length === 100 ? "#f56565" : "#cbd5e0", fontSize: "0.875rem" } }}
          />
        </form>
      </DialogContent>

      <DialogActions>
        <Button onClick={(e) => {
          onClose();
          setProfilePreview(user?.profileImg || "https://placehold.co/200x200");
        }} color="secondary"
          style={{ backgroundColor: "#f56565", color: "#fff", borderRadius: "4px" }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#e53e3e")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#f56565")}
        >
          Cancel
        </Button>
        <Button type="submit" onClick={handleSubmit} color="primary" disabled={isUpdating}
          startIcon={isUpdating && <CircularProgress size={20} />}
          style={{ backgroundColor: "#38a169", color: "#fff", borderRadius: "4px" }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#2f855a")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#38a169")}
        >
          {isUpdating ? "Saving..." : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}