import React, { useEffect, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import Input from "../elements/Input";

function ImageChoserPreview({
  image,
  setImage,
  errors,
  setErrors,
  defaultPreview = "",
  clearPreview = false,
  required,
}) {
  const [preview, setPreview] = useState(defaultPreview);
  const { t } = useTranslation();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
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
          return { ...prev, image: t("error.must_image") };
        });
        return;
      }

      setImage(file);

      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    }
  };

  useEffect(() => {
    if (clearPreview) {
      setPreview(null);
    }
  }, [clearPreview]);

  const handleClearImage = () => {
    setImage(null);
    setPreview(null);
  };

  return (
    <>
      <div className="mb-3">
        <Input
          type="file"
          name="image"
          style={`w-full file:mr-4 file:py-1 file:border-0 file:bg-purple-50 file:hover:bg-purple-100 file:text-purple-500 file:px-4 file:rounded-lg cursor-pointer`}
          onChange={handleFileChange}
          accept=".png,.jpg,.jpeg,.gif"
          multiple={false}
          size="md"
          label={t("input.image")}
        />

        <p className="text-red-500 text-end italic text-sm mt-1">
          {errors && errors.image}
        </p>

        <p className="text-xs">
          {image ? `File name: ${image.name}` : t("info.no_file")}
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
              {t("action.clear")}
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
