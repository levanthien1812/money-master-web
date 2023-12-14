import React, { useState } from "react";
import LoginRegisterLayout from "./LoginRegisterLayout";
import ResetPasswordForm from "./components/ResetPasswordForm";
import { useParams } from "react-router";
import AuthService from "../../services/auth";
import SuccessfulResetPassword from "./components/SuccessfulResetPassword";
import { toast } from "react-toastify";

function ResetPasswordPage() {
  const params = useParams();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessful, setShowSuccessful] = useState(false);
  const [error, setError] = useState(null);

  const token = params.token;

  const submitHandler = async (values) => {
    try {
      setIsSubmitting(true);
      const data = { ...values, token };

      const responseData = await AuthService.resetPassword(data);

      if (responseData.status === "success") {
        setShowSuccessful(true);
      }
    } catch (e) {
      setError(e.response.data.error);
      toast.error(e.response.data.message);
    }
    setIsSubmitting(false);
  };

  return (
    <LoginRegisterLayout>
      <ResetPasswordForm
        onSubmit={submitHandler}
        submiting={isSubmitting}
        error={error}
      />
      {showSuccessful && (
        <SuccessfulResetPassword onClose={() => setShowSuccessful(false)} />
      )}
    </LoginRegisterLayout>
  );
}

export default ResetPasswordPage;
