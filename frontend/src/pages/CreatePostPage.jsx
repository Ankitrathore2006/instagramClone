import { useState } from "react";
import { Camera } from "lucide-react";
import { usePostStore } from "../store/usePostStore";
import toast from "react-hot-toast";
import { redirect } from "react-router-dom";

const CreatePostPage = () => {
  const { createPost, isCreating } = usePostStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");

  // Handle image selection
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      setSelectedImg(reader.result);
    };
  };

  // Handle post submission
  const handleSubmit = async () => {
    if (!selectedImg) {
      toast.error("Please select an image");
      return;
    }

    const data = {
      imageUrl: selectedImg,
      caption,
      location,
    };

    await createPost(data);
    setSelectedImg(null);
    setCaption("");
    setLocation("");

    // toast.success("Post created successfully");
     
    // redirect("/");
  };

  return (
    <div className="h-screen pt-20 bg-base-100">
      <div className="max-w-4xl mx-auto p-4 py-8">
        <div className="bg-base-200 rounded-xl p-6 space-y-6 shadow-md">
          <h1 className="text-2xl font-semibold text-center">Create New Post</h1>

          {/* Image Upload */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedImg || "./placeholder.jpeg"}
                alt="Selected"
                className="w-64 h-64 object-cover rounded-md border border-zinc-300"
              />
              <label
                htmlFor="image-upload"
                className="absolute bottom-2 right-2 bg-base-content p-2 rounded-full cursor-pointer hover:scale-105 transition-transform duration-200"
              >
                <Camera className="w-5 h-5 text-white" />
                <input
                  type="file"
                  id="image-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">Click the camera icon to select an image</p>
          </div>

          {/* Caption Input */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-zinc-400">Caption</label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full px-4 py-2.5 bg-base-100 rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Write something..."
              rows={4}
            />
          </div>
          {/* Location Input */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-zinc-400">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-2.5 bg-base-100 rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter location"
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isCreating}
            className={`w-full py-2 rounded-lg font-medium text-white ${
              isCreating ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {isCreating ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostPage;
