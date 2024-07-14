import React from "react";

const Button = ({
  className = "",
  loading = false,
  children,
  size = "medium",
  variant = "primary",
  ...props
}) => {
  return (
    <button
      className={`${
        variant === "primary" &&
        "bg-purple-500 text-white active:bg-purple-400 hover:bg-purple-600"
      } ${
        variant === "secondary" &&
        "text-purple-500 bg-white active:bg-purple-50 hover:bg-purple-100"
      } ${
        variant === "warning" &&
        "bg-yellow-500 text-white active:bg-yellow-400 hover:bg-yellow-600"
      } ${
        variant === "danger" &&
        "bg-red-500 text-white active:bg-red-400 hover:bg-red-600"
      } ${
        variant === "link" &&
        "bg-transparent text-purple-500 active:bg-purple-400 hover:text-purple-600 hover:underline"
      } ${size === "small" && "px-4 py-0.5 rounded-md text-xs"} ${
        size === "medium" && "px-6 py-1 rounded-lg text-sm"
      } ${size === "large" && "px-8 py-1.5 rounded-xl text-md"}
      } shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150 disabled:opacity-60 ${className}`}
      {...{ ...props, disabled: props.disabled || loading }}
    >
      {children}
    </button>
  );
};

export default Button;
