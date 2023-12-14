import React from "react";
import { Formik } from "formik";
import Input from "../../../components/elements/Input";

function ResetPasswordForm({ onSubmit, error, submitting }) {
  return (
    <>
      <h2 className="text-purple-500 text-3xl text-center">Reset password</h2>
      <Formik
        initialValues={{
          newPassword: "",
          newPassword_confirmation: "",
        }}
        validate={(values) => {
          const errors = {};

          if (!values.email) {
            errors.email = "Required";
          } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
          ) {
            errors.email = "Invalid email address";
          }

          if (!values.newPassword) {
            errors.newPassword = "Required";
          }
          if (!values.newPassword_confirmation) {
            errors.newPassword_confirmation = "Required";
          }

          if (
            values.newPassword &&
            values.newPassword !== values.newPassword_confirmation
          ) {
            errors.newPassword_confirmation =
              "Password confirmation is not correct!";
          }
          return errors;
        }}
        onSubmit={(values) => {
          onSubmit(values);
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit} className="mt-6" method="post">
            <Input
              type={"text"}
              name={"email"}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.email}
              label={"Email"}
              error={
                (errors.email && touched.email && errors.email) ||
                (error && error.email)
              }
            />

            <Input
              type={"password"}
              name={"newPassword"}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.newPassword}
              label={"New Password"}
              error={
                (errors.newPassword &&
                  touched.newPassword &&
                  errors.newPassword) ||
                (error && error.newPassword)
              }
            />

            <Input
              type={"password"}
              name={"newPassword_confirmation"}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.newPassword_confirmation}
              label={"New Password Confirmation"}
              error={
                (errors.newPassword_confirmation &&
                  touched.newPassword_confirmation &&
                  errors.newPassword_confirmation) ||
                (error && error.newPassword_confirmation)
              }
            />

            <button
              type="submit"
              disabled={submitting}
              className="bg-purple-600 text-white py-2 w-full rounded-lg mt-12 text-xl hover:bg-purple-700"
            >
              {submitting ? "Resetting password ..." : "Reset password"}
            </button>
          </form>
        )}
      </Formik>
    </>
  );
}

export default ResetPasswordForm;
