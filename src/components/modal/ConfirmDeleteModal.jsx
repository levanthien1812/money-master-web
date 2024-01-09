import React from "react";
import Modal from "./Modal";
import { useTranslation } from "react-i18next";

function ConfirmDeleteModal({ onAccept, onClose, message, processing }) {
  const { t } = useTranslation();
  return (
    <Modal
      title={t("modal.confirm_deletion")}
      onAccept={onAccept}
      onClose={onClose}
      width={"md:w-fit w-11/12"}
      processing={processing}
    >
      <p>{message}</p>
    </Modal>
  );
}

export default ConfirmDeleteModal;
