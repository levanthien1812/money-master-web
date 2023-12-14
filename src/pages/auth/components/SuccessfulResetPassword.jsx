import React from "react";
import Modal from "../../../components/modal/Modal";
import { useNavigate } from "react-router";

function SuccessfulResetPassword({ onClose }) {
  const navigate = useNavigate();

  const handleAccept = () => {
    navigate("/login");
  };

  return (
    <Modal
      title={"Password is reset successfully"}
      onAccept={handleAccept}
      onClose={onClose}
    >
      <p>Your password is reset! Please login again.</p>
    </Modal>
  );
}

export default SuccessfulResetPassword;
