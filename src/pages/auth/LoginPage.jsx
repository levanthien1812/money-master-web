import React, { useState } from "react";
import LoginRegisterLayout from "./LoginRegisterLayout";
import LoginForm from "./components/LoginForm";
import ForgetPassword from "./components/ForgetPassword";
import AuthService from "../../services/auth";
import NotifyLinkSent from "./components/NotifyLinkSent";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { authActions } from "../../stores/auth";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

function LoginPage() {
  const [isForgetting, setIsForgetting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingLink, setIsSendingLink] = useState(false);
  const [isNotifyingSent, setIsNotifyingSent] = useState(false);
  const [error, setError] = useState(null);
  const [forgetError, setForgetError] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleForget = () => {
    setIsForgetting(true);
  };

  const handleAccept = async (email) => {
    try {
      setIsSendingLink(true);
      const responseData = await AuthService.forgetPassword({
        email: email,
      });
      setIsSendingLink(false);

      if (responseData.status === "success") {
        setIsForgetting(false);
        setIsNotifyingSent(true);

        Cookies.set('email', email)
      } else {
        setIsForgetting(true);
        setForgetError(responseData.error);
      }
    } catch (error) {
      setIsSendingLink(false);
      toast.error(error.response.data.message);
    }
  };

  const handleLogin = async (values) => {
    try {
      setError(null);
      setIsSubmitting(true);

      const responseData = await AuthService.login(values);

      setIsSubmitting(false);

      if (responseData.status === "success") {
        dispatch(authActions.login(responseData.data));

        if (responseData.data.roles.includes("admin")) {
          navigate("/admin");
        } else {
          navigate("/transactions");
        }
      }
    } catch (e) {
      setError(e.response.data.error);
      toast.error(e.response.data.message);
    }
    setIsSubmitting(false);
  };

  const handleCloseSentLink = () => {
    setIsNotifyingSent(false);
  };

  return (
    <LoginRegisterLayout>
      <LoginForm
        onForgetting={handleForget}
        onLogin={handleLogin}
        submitting={isSubmitting}
        error={error}
      />
      {isForgetting && (
        <ForgetPassword
          onAccept={handleAccept}
          onClose={() => setIsForgetting(false)}
          isSendingLink={isSendingLink}
          error={forgetError}
          setError={setForgetError}
        />
      )}
      {isNotifyingSent && (
        <NotifyLinkSent
          onAccept={handleCloseSentLink}
          onClose={() => setIsNotifyingSent(false)}
        />
      )}
    </LoginRegisterLayout>
  );
}

export default LoginPage;
