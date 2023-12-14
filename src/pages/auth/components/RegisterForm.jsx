import React from "react";
import { Formik } from "formik";
import { useNavigate } from "react-router";
import Input from "../../../components/elements/Input";

function RegisterForm({ submitting, error, setError, onSubmit }) {
  const navigate = useNavigate();
  // console.log(error);
  return (
    <>
      <h2 className="text-purple-500 text-3xl text-center">Register</h2>
      <Formik
        initialValues={{
          name: "",
          email: "",
          password: "",
          password_confirmation: "",
        }}
        validate={(values) => {
          const errors = {};
          setError(null);

          if (!values.name) {
            errors.name = "Required";
          }

          if (!values.password) {
            errors.password = "Required";
          }

          if (!values.email) {
            errors.email = "Required";
          } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
          ) {
            errors.email = "Invalid email address";
          }

          if (values.password.length < 8 || values.password.length > 32) {
            errors.password =
              "Password's lenght must be between 8 and 32 characters";
          }

          if (values.password !== values.password_confirmation) {
            errors.password_confirmation =
              "Password confirmation is not correct";
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
              type={"name"}
              name={"name"}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.name}
              label={"Name"}
              error={
                (errors.name && touched.name && errors.name) ||
                (error && error.name)
              }
            />
            <Input
              type={"email"}
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
              name={"password"}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.password}
              label={"Password"}
              error={
                (errors.password && touched.password && errors.password) ||
                (error && error.password)
              }
            />
            <Input
              type={"password"}
              name={"password_confirmation"}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.password_confirmation}
              label={"Password Confirmation"}
              error={
                errors.password_confirmation &&
                touched.password_confirmation &&
                errors.password_confirmation
              }
            />
            <button
              type="submit"
              disabled={submitting}
              className="bg-purple-600 text-white py-2 w-full rounded-lg mt-8 text-xl hover:bg-purple-700"
            >
              {submitting ? "Registering...." : "Register"}
            </button>
            <p className="text-center mt-2 text-md">
              Already have account?{" "}
              <button
                className="font-bold text-purple-600 hover:underline"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
            </p>
          </form>
        )}
      </Formik>
    </>
  );
}

export default RegisterForm;
