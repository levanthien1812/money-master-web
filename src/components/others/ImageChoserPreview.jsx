import React, { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { motion } from "framer-motion";

function ImageChoserPreview({
  image,
  setImage,
  errors,
  setErrors,
  defaultPreview = "",
  required,
}) {
  const [preview, setPreview] = useState(defaultPreview);

  const handleFileChange = (file) => {
    // CLEAR ANY PHOTO STATE BEFORE
    setImage(null);

    setErrors((prev) => {
      if (prev && prev.image) delete prev.image;
      return prev;
    });

    if (file) {
      const fileName = file.name;
      const fileExtension = fileName.split(".").pop().toLowerCase();
      const imageExtensions = ["jpg", "jpeg", "png", "gif"];

      if (!imageExtensions.includes(fileExtension)) {
        setPreview(null);
        setErrors((prev) => {
          return { ...prev, image: "Must be an image!" };
        });
        return;
      }

      setImage(file);

      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    }
  };

  const handleClearImage = () => {
    setImage(null);
    setPreview(null);
  };

  return (
    <>
      <div className="mb-3">
        <label htmlFor={"image"} className="flex items-center">
          Image <span className="text-red-600 text-2xl">{required && "*"}</span>
        </label>

        <div className="w-full overflow-hidden">
          <FileUploader
            multiple={false}
            handleChange={handleFileChange}
            name="image"
            types={["JPG", "JPEG", "PNG", "GIF"]}
          />
        </div>

        <p className="text-red-500 text-end italic text-sm mt-1">
          {errors && errors.image}
        </p>

        <p className="text-xs">
          {image ? `File name: ${image.name}` : "No files uploaded yet"}
        </p>
      </div>

      {/* PHOTO PREVIEW */}
      {preview && (
        <div className="overflow-hidden mb-3 flex justify-center relative">
          <div className="absolute top-0 p-2">
            <motion.button
              className="bg-slate-300 text-slate-600 text-xs uppercase px-2 rounded-full py-1 bg-opacity-70 hover:bg-opacity-80 hover:font-bold"
              onClick={handleClearImage}
            >
              Clear
            </motion.button>
          </div>
          <img
            src={preview}
            alt=""
            className="object-cover max-h-56 w-72 rounded-lg"
          />
        </div>
      )}
    </>
  );
}

export default ImageChoserPreview;
