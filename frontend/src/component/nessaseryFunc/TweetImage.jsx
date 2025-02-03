export default function TweetImage({ image, onImageClick }) {
    if (!image) return null;
  
    // Check if the image is already a URL (string) or a File object
    const imageUrl = typeof image === "string" ? image : URL.createObjectURL(image);
  
    return (
      <div className="mt-2 cursor-pointer" onClick={() => onImageClick(imageUrl)}>
        <img
          src={imageUrl}
          alt="Tweet"
          className="w-full h-32 md:h-48 object-cover rounded-lg"
        />
      </div>
    );
  }
  