import React from "react";
import Modal from "../../../components/modal/Modal";

function NotifyLinkSent({ onAccept, onClose }) {
  return (
    <Modal
      title={"Reset password link was sent!"}
      onAccept={onAccept}
      onClose={onClose}
      width={"sm:w-fit w-11/12"}
    >
      <p>A reset password link was sent to your email!</p>
    </Modal>
  );
}

export default NotifyLinkSent;
