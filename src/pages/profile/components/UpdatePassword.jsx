import React, { useState } from "react";
import Input from "../../../components/elements/Input";
import UsersServices from "../../../services/users";
import { toast } from "react-toastify";
import AuthService from "../../../services/auth";
import { authActions } from "../../../stores/auth";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWarning } from "@fortawesome/free-solid-svg-icons";

function UpdatePassword({ onClose }) {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [errors, setErrors] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleUpdatePassword = async () => {
    try {
      setIsSavingPassword(true);
      let haveErrors = false;
      setErrors(null);

      if (password.length === 0) {
        haveErrors = true;
        setErrors((prev) => {
          return {
            ...prev,
            password: "Current password is required!",
          };
        });
      }

      if (newPassword.length < 8 || newPassword.length > 32) {
        haveErrors = true;
        setErrors((prev) => {
          return {
            ...prev,
            newPassword:
              "Password must be at least 8 and as most 32 characters!",
          };
        });
      }

      if (newPassword !== passwordConfirm) {
        haveErrors = true;
        setErrors((prev) => {
          return {
            ...prev,
            passwordConfirm: "New password confirmation does not match",
          };
        });
      }

      if (haveErrors) return;

      setIsSavingPassword(true);
      const data = {
        password,
        newPassword,
        newPassword_confirmation: passwordConfirm,
      };

      const responseData = await UsersServices.updatePassword(data);

      if (responseData.status === "success") {
        toast.success("Update password successfully! Please login again.");
        dispatch(authActions.logout());
        navigate("/login");

        await AuthService.logout();
      } else {
        toast.error(responseData.error);
        setErrors(responseData.error);
      }
    } catch (e) {
      toast.error(e.response.data.message);
    }
    setIsSavingPassword(false);
  };

  return (
    <div className="lg:w-1/2 w-full sm:px-3 px-1">
      <Input
        type={"password"}
        name={"password"}
        value={password}
        label={"Current Password"}
        onChange={(e) => setPassword(e.target.value)}
        error={errors?.password}
        size="small"
        required
      />
      <Input
        type={"password"}
        name={"newPassword"}
        value={newPassword}
        label={"New Password"}
        onChange={(e) => setNewPassword(e.target.value)}
        error={errors?.newPassword}
        size="small"
        required
      />
      <Input
        type={"password"}
        name={"password_confirmation"}
        value={passwordConfirm}
        label={"Password Confirmation"}
        onChange={(e) => setPasswordConfirm(e.target.value)}
        error={errors?.passwordConfirm}
        size="small"
        required
      />

      <div>
        <p className="text-yellow-600 text-sm">
          <FontAwesomeIcon icon={faWarning} /> Warning: you will be{" "}
          <span className="font-bold">logged out</span> immediately after
          updating successfully!
        </p>
      </div>

      <div className="flex justify-between mt-3">
        <button
          className="text-sm bg-gray-200 rounded-full py-1 px-3 hover:bg-blue-500 hover:text-white"
          onClick={onClose}
        >
          Back
        </button>
        <button
          className="py-1 px-3 rounded-full bg-blue-500 text-white hover:bg-blue-600 text-sm"
          onClick={handleUpdatePassword}
        >
          {isSavingPassword ? "Updating password..." : "Update password"}
        </button>
      </div>
    </div>
  );
}

export default UpdatePassword;
