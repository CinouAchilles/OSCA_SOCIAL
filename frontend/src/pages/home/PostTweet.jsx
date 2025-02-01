import { useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { FaImage } from "react-icons/fa";
import { BsEmojiSmile } from "react-icons/bs";
import Picker from "@emoji-mart/react";
import emojiData from "@emoji-mart/data";

export default function PostTweet({ onPostTweet }) {
  const [tweet, setTweet] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const characterLimit = 1000; // Max characters

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handlePostTweet = () => {
    if (tweet.trim() === "" && !image) {
      alert("Tweet cannot be empty!");
      return;
    }

    onPostTweet(tweet, image);
    setTweet("");
    setImage(null);
    setImagePreview(null);
  };

  const handleEmojiSelect = (emoji) => {
    setTweet((prevTweet) => prevTweet + emoji.native);
  };

  return (
    <div className="mb-6 bg-gray-900 p-4 rounded-lg shadow-md">
      {/* Textarea for Tweet */}
      <textarea
        className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
        rows="3"
        placeholder="What's happening?"
        value={tweet}
        onChange={(e) => setTweet(e.target.value)}
        maxLength={characterLimit}
        style={{
          wordBreak: "break-all", // 🔥 Forces breaking even in long words
          overflowWrap: "break-word", // Wraps normally when possible
          overflowY: "auto", // Enables scrolling for long tweets
        }}
      />

      {/* Character Limit Indicator */}
      <div className="text-right text-sm text-gray-400 mt-1">
        {tweet.length}/{characterLimit}
      </div>

      {/* Image Preview */}
      {imagePreview && (
        <div className="mt-4 relative">
          <img
            src={imagePreview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg shadow-md"
          />
          <button
            onClick={() => {
              setImage(null);
              setImagePreview(null);
            }}
            className="absolute top-2 right-2 p-2 bg-gray-900 text-white rounded-full hover:bg-gray-700 transition"
          >
            &times;
          </button>
        </div>
      )}

      {/* Bottom Section */}
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center space-x-4">
          {/* Image Upload Button */}
          <label className="cursor-pointer p-2 text-blue-500 hover:text-blue-600 transition">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
            <FaImage className="w-5 h-5" />
          </label>

          {/* Emoji Picker Button */}
          <div className="relative">
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2 text-yellow-400 hover:text-yellow-500 transition"
            >
              <BsEmojiSmile className="w-5 h-5" />
            </button>

            {showEmojiPicker && (
              <div className="absolute z-10 bottom-10 left-0">
                <Picker data={emojiData} onEmojiSelect={handleEmojiSelect} />
              </div>
            )}
          </div>
        </div>

        {/* Tweet Button */}
        <button
          onClick={handlePostTweet}
          className={`flex items-center space-x-2 px-4 py-2 text-white font-semibold rounded-lg transition ${
            tweet.length > characterLimit
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
          disabled={tweet.length > characterLimit}
        >
          <AiOutlinePlus className="w-5 h-5" />
          <span>Tweet</span>
        </button>
      </div>
    </div>
  );
}
