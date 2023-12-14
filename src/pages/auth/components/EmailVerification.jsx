import React, { useState } from "react";
import Modal from "../../../components/modal/Modal";
import AuthService from "../../../services/auth";
import { toast } from "react-toastify";
import Input from "../../../components/elements/Input";

function EmailVerification({ onSuccess, onClose, email }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAccept = async () => {
    try {
      if (code.length === 0) {
        return setError({
          verification_code: "Verification code is required!",
        });
      }

      setLoading(true);
      const responseData = await AuthService.verifyEmail({
        email: email,
        verification_code: code,
      });

      if (responseData.status === "success") {
        onSuccess();
      }
    } catch (error) {
      setError(error.response.data.error);
      toast.error(error.response.data.message);
    }
    setLoading(false);
  };

  return (
    <Modal
      title={"Email verification"}
      onAccept={handleAccept}
      onClose={onClose}
      width={"sm:w-fit w-11/12"}
      processing={loading}
    >
      <Input
        type={"text"}
        name={"verification_code"}
        value={code}
        onChange={(e) => setCode(e.target.value)}
        onBlur={(e) => setCode(e.target.value)}
        error={error?.verification_code}
        label={
          "Your email haven't been verified yet! Please enter the code that we have sent to your email to verify."
        }
        style="text-center"
      />
    </Modal>
  );
}

export default EmailVerification;
