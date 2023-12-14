import React, { useState } from "react";
import graphic1 from "../../assets/images/personal-finance-graphics.png";
import graphic2 from "../../assets/images/personal-finance-graphics-1.jpg";
import graphic3 from "../../assets/images/personal-finance-graphics-2.jpg";
import logo from "../../assets/images/logo-money-master.png";
import logoText from "../../assets/images/name-money-master.png";
import { useNavigate } from "react-router";
import "../../styles/auth.css";
import Benefits from "./components/Benefits";
import { motion } from "framer-motion";

function LoginRegisterLayout({ children }) {
  const images = [graphic1, graphic2, graphic3];
  const [currentImage, setCurrentImage] = useState(0);
  const [shownBenefits, setShownBenefits] = useState(false);
  const navigate = useNavigate();

  setTimeout(() => {
    setCurrentImage(currentImage + 1 === images.length ? 0 : currentImage + 1);
  }, 2500);

  return (
    <div className="flex h-screen lg:flex-row flex-col">
      <div className="lg:w-1/2 w-full lg:grow flex flex-col items-center justify-start">
        <div className="flex gap-2 items-center justify-start w-full px-6 py-2">
          <img src={logo} alt="" className="sm:w-16 sm:h-16 h-14 w-14" />
          <img src={logoText} alt="" className="sm:h-12 h-10" />
        </div>
        <div className="sm:mb-4 mb-2 w-full bg-purple-400 md:py-5 py-3 md:px-12 px-6 md:rounded-tr-full md:rounded-br-full md:relative">
          <h2 className="w-full md:text-4xl text-2xl text-white mb-2 leading-tight">
            We help you to manage your finance efficiently!
          </h2>
          <h5 className="text-white text-2xl">Let&apos;s join.</h5>
          <div className="flex justify-end mt-1">
            <button
              className="bg-purple-600 py-2 px-6 text-white rounded-full md:absolute block right-16 bottom-4 hover:bg-purple-700"
              onClick={() => setShownBenefits(!shownBenefits)}
            >
              See what you can benefit
            </button>
          </div>
        </div>
        <div className="md:block hidden">
          <motion.div
            className=""
            style={{ width: 500, height: 500 }}
            initial={{ opacity: 0, translateX: 20 }}
            animate={{ opacity: 1, translateX: 0 }}
          >
            <img src={images[currentImage]} alt="" className="" />
          </motion.div>
          <div className="flex gap-2 justify-center">
            {images.map((image, index) => {
              return (
                <button
                  key={Math.random()}
                  className={`rounded-md w-full ${
                    currentImage === index ? "bg-purple-300" : "bg-gray-300"
                  }`}
                  style={{ width: 80, height: 5 }}
                  onClick={() => setCurrentImage(index)}
                ></button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="lg:w-1/2 w-full grow flex flex-col relative overflow-hidden">
        <div
          className="hidden gap-2 justify-end py-3 pe-8 md:flex"
          style={{
            backgroundImage:
              "linear-gradient(to left, rgb(216, 180, 254), #ffffff)",
          }}
        >
          <button
            className="bg-purple-600 w-40 px-6 rounded-full text-white hover:bg-purple-700"
            onClick={() => navigate("/register")}
          >
            Register
          </button>
          <button
            className="border w-40 border-purple-600 py-2 px-6 rounded-full text-purple-600 bg-white hover:bg-purple-50"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>

        <div
          className="w-full flex items-center justify-center grow h-full"
          style={{
            backgroundImage:
              "linear-gradient(to top left, rgb(233, 213, 255), #ffffff)",
            perspective: 1000,
          }}
        >
          {/* Circles to make beautiful */}
          <div
            className="absolute rounded-full bg-purple-300 opacity-50 bottom-10 -right-20 z-0"
            style={{ width: 400, height: 400 }}
          ></div>
          <div
            className="absolute rounded-full bg-purple-300 opacity-50 -bottom-32 left-20 z-0"
            style={{ width: 200, height: 200 }}
          ></div>

          <div
            style={{ width: 450 }}
            className={`flip-card flex items-center justify-center sm:p-0 p-2 ${
              shownBenefits === true ? "active" : ""
            }`}
          >
            <div
              className="border-blue-400 rounded-3xl sm:p-6 p-4 bg-white form-card w-11/12"
              style={{
                boxShadow: "0 0 30px rgb(216, 180, 254)",
              }}
            >
              {children}
            </div>
            <div
              className="border-blue-400 rounded-3xl sm:p-6 p-4 bg-white benefits-card w-11/12"
              style={{
                boxShadow: "0 0 30px rgb(216, 180, 254)",
              }}
            >
              <Benefits setShownBenefits={setShownBenefits} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginRegisterLayout;
