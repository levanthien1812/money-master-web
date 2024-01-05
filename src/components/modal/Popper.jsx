import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import React from "react";

function Popper({ children, top = "top-0", left = "left-0", onClose }) {
  return (
    <motion.div
      className={`absolute ${left} ${top} bg-purple-100 rounded-lg shadow-md z-30`}
      initial={{ scaleX: 0, scaleY: 0, opacity: 0 }}
      animate={{ scaleX: 1, scaleY: 1, opacity: 1 }}
    >
      <div className="relative p-3 pr-6">
        {children}
        <button
          className="absolute top-1 right-2 text-gray-400 hover:text-gray-500"
          onClick={onClose}
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <div className="absolute -bottom-4 left-4 w-0 h-0 border-l-8 border-t-8 border-l-purple-100 border-t-purple-100 border-r-8 border-r-transparent  border-b-8 border-b-transparent"></div>
      </div>
    </motion.div>
  );
}

export default Popper;
