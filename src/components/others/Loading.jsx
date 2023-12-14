import React from "react";
import { MoonLoader } from "react-spinners";

function Loading({ size = "large" }) {
  return (
    <div
      className={
        "w-full flex items-center gap-2 " +
        (size === "large" ? "flex-col py-6 justify-center" : "justify-start")
      }
    >
      <MoonLoader
        color="#A855F7"
        size={size === "large" ? 80 : 12}
        loading={true}
        aria-label="Loading..."
        speedMultiplier={0.7}
      />
      <p
        className={
          "text-center mt-3 font-bold text-purple-500 " +
          (size === "large" ? "text-md" : "text-sm")
        }
      >
        Loading...
      </p>
    </div>
  );
}

export default Loading;
