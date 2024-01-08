import React from "react";
import Modal from "../../../components/modal/Modal";
import congrats from "../../../assets/images/congrats.png";
import { useTranslation } from "react-i18next";

function Congratulation({ onClose }) {
  const { t } = useTranslation();
  return (
    <Modal
      title={"Congratulations"}
      onAccept={onClose}
      action="yes"
      width={"xl:w-1/3 md:w-2/5 sm:w-1/2 w-11/12"}
    >
      <div className="flex flex-col justify-center items-center">
        <img src={congrats} alt="" className="h-40" />

        <p className="mt-4 text-2xl font-bold text-purple-500">
          {t("goal.congrats")}
        </p>
        <p className="mt-4 text-xl font-bold text-purple-500">
          {t("goal.achieved_goal")}
        </p>
      </div>
    </Modal>
  );
}

export default Congratulation;
