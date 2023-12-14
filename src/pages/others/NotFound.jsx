import React from "react";
import notFound from "../../assets/images/not-found.jpg";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function NotFound() {
  const roles = useSelector((state) => state.auth.roles);
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="mb-6">
        <img src={notFound} alt="" className="h-96" />
      </div>
      <p className="text-3xl mb-2 text-center font-extrabold">
        Sorry! The page not found!
      </p>
      <p className="text-md mb-10 text-center">
        The link you followed probably broken, or the page has been remove
      </p>
      <div>
        <button className="py-1 px-4 bg-purple-500 hover:bg-purple-600 text-white rounded-xl">
          <Link to={roles.includes("admin") ? "/admin" : "/transactions"}>
            Back to home
          </Link>
        </button>
      </div>
    </div>
  );
}

export default NotFound;
