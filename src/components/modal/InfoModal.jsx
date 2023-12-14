import React from "react";
import Modal from "./Modal";

function InfoModal({ title = "Notification", message, onClose }) {
  return (
    <Modal action="yes" onAccept={onClose} onClose={onClose} title={title} width={"sm:w-fit w-11/12"}>
      <p>{message}</p>
    </Modal>
  );
}

export default InfoModal;
