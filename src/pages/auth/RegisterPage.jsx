import React, { useState } from "react";
import LoginRegisterLayout from "./LoginRegisterLayout";
import RegisterForm from "./components/RegisterForm";
import AuthService from "../../services/auth";
import EmailVerification from "./components/EmailVerification";
import { useNavigate } from "react-router";
import InfoModal from "../../components/modal/InfoModal";
import { toast } from "react-toastify";

function RegisterPage() {
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [values, setValues] = useState([]);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleRegister = async (registerFields) => {
    try {
      setValues(registerFields);
      setIsSubmitting(true);
      const responseData = await AuthService.sendVerificationCode({
        email: registerFields.email,
      });

      if (responseData.status === "success") {
        setIsVerifyingEmail(true);
      }
    } catch (e) {
      setError(e.response.data.error);
      toast.error(e.response.data.message);
    }
    setIsSubmitting(false);
  };

  const handleVerifySuccess = async () => {
    try {
      setIsSubmitting(true);
      const responseData = await AuthService.register(values);

      if (responseData.status === "success") {
        setIsVerifyingEmail(false);
        setIsVerified(true);
      } else {
        toast.error(responseData.error);
      }
    } catch (e) {
      toast.error(e.response.data.message);
    }
    setIsSubmitting(false);
  };

  return (
    <LoginRegisterLayout>
      <RegisterForm
        submitting={isSubmitting}
        error={error}
        setError={setError}
        onSubmit={handleRegister}
      />
      {isVerifyingEmail && (
        <EmailVerification
          onSuccess={handleVerifySuccess}
          onClose={() => setIsVerifyingEmail(false)}
          email={values.email}
        />
      )}
      {isVerified && (
        <InfoModal
          title="Notification"
          message={"Register user successfully! Please login to continue."}
          onClose={() => navigate("/login")}
        />
      )}
    </LoginRegisterLayout>
  );
}

export default RegisterPage;
