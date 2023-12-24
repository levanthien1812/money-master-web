import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";

function Input({
  type,
  name,
  onChange = null,
  onBlur = null,
  value = "",
  label,
  error,
  style = "",
  size = "medium",
  placeholder = "",
  accept = "*",
  required = null,
  disable = false,
  mb = "mb-3",
  helperText = null,
}) {
  const [appear, setAppear] = useState(false);

  const sizeStyle =
    size === "medium"
      ? "rounded-lg py-2 px-4 text-xl ring-2"
      : "rounded-md py-1.5 px-3 text-sm ring-1";

  const handleToggleEye = (e) => {
    e.preventDefault();
    setAppear(!appear);
  };

  return (
    <div className={mb}>
      {label && (
        <label htmlFor={name} className={`flex items-center ${size === "medium" ? "text-md" : "text-sm"}`}>
          {label}{" "}
          <span className="text-red-600 text-2xl">{required && "*"}</span>
        </label>
      )}

      <div className="relative flex items-center">
        <input
          type={type === "password" && appear ? "text" : type}
          name={name}
          onChange={onChange}
          onBlur={onBlur}
          value={value}
          accept={accept}
          className={
            "block border-gray-300 ring-inset ring-gray-300 focus:ring-purple-400 w-full outline-none shadow-sm " +
            sizeStyle +
            " " +
            style +
            " " +
            (error ? "ring-red-500" : "ring-gray-300")
          }
          placeholder={placeholder}
          disabled={disable}
        />
        {type === "password" && value.length > 0 && (
          <button
            className="absolute right-2 bg-gray-200 w-6 h-6 rounded-full p-2 flex justify-center items-center"
            onClick={handleToggleEye}
          >
            <FontAwesomeIcon
              icon={appear ? faEye : faEyeSlash}
              className={`scale-75 ${
                !appear ? "text-gray-500" : "text-black"
              } hover:text-black`}
            />
          </button>
        )}
      </div>

      {helperText && (
        <p className="text-gray-500 text-end italic text-sm">{helperText}</p>
      )}

      <p className="text-red-500 text-end italic text-sm">{error}</p>
    </div>
  );
}

export default Input;
