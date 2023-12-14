import React from "react";
import Modal from "./Modal";

function ConfirmDeleteModal({ onAccept, onClose, message, processing }) {
  return (
    <Modal
      title={"Confirm deletion"}
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
