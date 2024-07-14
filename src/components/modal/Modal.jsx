import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import Button from "../elements/Button";

export default function Modal({
  title,
  onAccept,
  onClose,
  children,
  width,
  action = "yesno",
  processing = false,
}) {
  const { t } = useTranslation();

  return createPortal(
    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 outline-none focus:outline-none z-40">
      <div className={"relative my-6 mx-auto max-w-3xl z-50 " + width}>
        {/*content*/}
        <motion.div
          initial={{ scaleX: 0, opacity: 0.5 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
          className="border-0 rounded-xl shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none"
        >
          {/*header*/}
          <div className="flex items-start justify-between md:px-5 md:py-3 py-2 px-4 border-b border-solid border-slate-200 rounded-t">
            <h3 className="text-2xl md:text-start text-center w-full">
              {title}
            </h3>
            <button
              className="p-1 ml-auto bg-transparent border-0 float-right text-2xl text-gray-400 leading-none font-semibold outline-none focus:outline-none sm:block hidden"
              onClick={onClose}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
          {/*body*/}
          <div
            className="relative sm:p-6 p-3 flex-auto overflow-y-scroll"
            style={{ maxHeight: 600 }}
          >
            {children}
          </div>
          {/*footer*/}
          <div className="flex items-center justify-end px-6 md:px-5 md:py-3 py-2 border-t border-solid border-slate-200 rounded-b gap-2">
            {action.includes("no") && (
              <Button onClick={onClose} variant="secondary">
                {t("action.cancel")}
              </Button>
            )}
            {action.includes("yes") && (
              <Button onClick={onAccept} variant="primary" loading={processing}>
                {processing ? t("action.processing") : t("action.ok")}
              </Button>
            )}
          </div>
        </motion.div>
      </div>
      <div
        className={"opacity-50 fixed inset-0 bg-black z-40"}
        onClick={onClose}
      ></div>
    </div>,
    document.getElementById("modal")
  );
}
