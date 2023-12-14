import React from "react";

function Popover({ top = 0, left = 0, children }) {
  return (
    <div
      style={{ top: top, left: left }}
      className="absolute bg-white p-4 rounded-md shadow-lg"
    >
      {children}
    </div>
  );
}

export default Popover;
