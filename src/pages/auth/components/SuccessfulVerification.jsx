import React from "react";
import Modal from "../../../components/modal/Modal";
import { useNavigate } from "react-router";

function SuccessfulVerification({ onAccept, onClose }) {
  return (
    <Modal
      title={"Email verification successfully"}
      onAccept={onAccept}
      onClose={onClose}
      width={"sm:w-fit w-11/12"}
    >
      <p>Your email is verified! Please login to continue.</p>
    </Modal>
  );
}

export default SuccessfulVerification;
