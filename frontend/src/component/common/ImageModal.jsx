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

  // Close the modal when clicking outside the image
  const handleClickOutside = (e) => {
    if (e.target.id === "modal-background") {
      onClose();
    }
  };

  return (
    <div
      id="modal-background"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 !mt-0"
      onClick={handleClickOutside}
    >
      {/* Modal Container */}
      <div
        id="modal-content"
        className="relative p-4 bg-transparent flex justify-center items-center"
      >
        {/* Image */}
        <img
          src={imageUrl}
          alt="Full Screen"
          className="max-w-full max-h-full object-contain rounded-lg shadow-2xl border-4 border-white"
        />

        {/* Close Button inside the Image */}
        <IconButton
          onClick={onClose}
          className="absolute top-2 right-3 z-10"
          sx={{
            position: "absolute",
            color: "grey", 
            boxShadow: "0 0px 5px 0px rgba(0, 0, 0, 0.5)", // Add a subtle shadow to enhance visibility
            borderRadius: "50%", // Rounded button for better aesthetics
            padding: "6px", // Add padding to make the button larger and more clickable
            "&:hover": {
              color: "gray.400", // Slightly lighter gray for hover effect
              backgroundColor: "rgba(0, 0, 0, 0.3)", // Semi-transparent dark background for hover effect
            },
          }}
        >
          <CloseIcon fontSize="large"/>
        </IconButton>
      </div>
    </div>
  );
}
