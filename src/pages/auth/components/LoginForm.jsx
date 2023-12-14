import React from "react";
import { Formik } from "formik";
import { useNavigate } from "react-router";
import Input from "../../../components/elements/Input";

function LoginForm({ onForgetting, onLogin, submitting, error }) {
  const navigate = useNavigate();

  return (
    <>
      <h2 className="text-purple-500 text-3xl text-center mb-6">Login</h2>

      <Formik
        initialValues={{
          email: "",
          password: "",
          remember: false,
        }}
        validate={(values) => {
          const errors = {};

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
          return errors;
        }}
        onSubmit={(values) => {
          onLogin(values);
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
          <form onSubmit={handleSubmit} className="mt-3" method="post">
            <Input
              type={"email"}
              name={"email"}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.email}
              label={"Email"}
              error={
                (errors.email && touched.email && errors.email) || error?.email
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
                error?.password
              }
            />

            <div className="flex justify-between">
              <div>
                <input
                  type="checkbox"
                  name="remember"
                  id="remember"
                  value={values.remember}
                />
                <label htmlFor="remember" className="ms-2">
                  Remember me
                </label>
              </div>
              <button
                type="button"
                className="hover:underline"
                onClick={onForgetting}
              >
                Forget password?
              </button>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="bg-purple-600 text-white py-2 w-full rounded-lg mt-12 text-xl hover:bg-purple-700"
            >
              {submitting ? "Logining...." : "Login"}
            </button>
            <p className="text-center mt-2 text-md">
              Not have account yet?{" "}
              <button
                className="font-bold text-purple-600 hover:underline"
                onClick={() => navigate("/register")}
              >
                Register
              </button>
            </p>
          </form>
        )}
      </Formik>
    </>
  );
}

export default LoginForm;
