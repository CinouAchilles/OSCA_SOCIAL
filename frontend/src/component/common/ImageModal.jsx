import { useEffect } from "react";
import { IconButton } from "@mui/material"; // Import MUI components
import CloseIcon from "@mui/icons-material/Close"; // Import Close icon

export default function ImageModal({ imageUrl, onClose }) {
  // Close the modal when pressing the Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
      {/* Close Button */}
      <IconButton
        onClick={onClose}
        className="absolute top-4 right-4"
        sx={{
          color: "white",
          "&:hover": {
            color: "gray.400", 
          },
        }}
      >
        <CloseIcon fontSize="large" /> 
      </IconButton>

      <img
        src={imageUrl}
        alt="Full Screen"
        className="max-w-full max-h-full object-contain"
      />
    </div>
  );
}