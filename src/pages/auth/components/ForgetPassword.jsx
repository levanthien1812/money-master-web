import React, { useState } from "react";
import Modal from "../../../components/modal/Modal";
import Input from "../../../components/elements/Input";

function ForgetPassword({ onAccept, onClose, error, setError, isSendingLink }) {
  const [email, setEmail] = useState("");

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
      setError({ email: "Email is not valid!" });
    } else setError(null);
  };

  const acceptHandle = () => {
    if (email.length === 0) {
      setError({ email: "Email is required!!" });
    } else {
      onAccept(email);
    }
  };

  return (
    <Modal
      title={"Password reset"}
      onAccept={acceptHandle}
      onClose={onClose}
      processing={isSendingLink}
    >
      <Input
        type={"email"}
        name={"email"}
        value={email}
        onChange={handleEmailChange}
        onBlur={handleEmailChange}
        error={error?.email}
        label={"Enter your email to get the reset password link"}
      />
    </Modal>
  );
}

export default ForgetPassword;
