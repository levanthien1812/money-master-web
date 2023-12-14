import { motion } from "framer-motion";
import { createPortal } from "react-dom";

export default function ModalWithNothing({ onClose, children, width }) {
  return createPortal(
    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 outline-none focus:outline-none z-40">
      <motion.div
        className={"relative my-6 mx-auto max-w-3xl z-50 " + width}
        initial={{ scaleX: 0, opacity: 0.5 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
        }}
      >
        <div className="border-0 rounded-xl shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
          {children}
        </div>
      </motion.div>
      <div
        className={"opacity-50 fixed inset-0 bg-black z-40"}
        onClick={onClose}
      ></div>
    </div>,
    document.getElementById("modal")
  );
}
