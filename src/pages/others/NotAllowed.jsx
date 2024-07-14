import React from "react";
import noFire from "../../assets/images/no-fire.png";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Button from "../../components/elements/Button";

function NotAllowed() {
  const roles = useSelector((state) => state.auth.roles);
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="mb-6">
        <img src={noFire} alt="" className="h-96" />
      </div>
      <p className="text-2xl mb-3 text-center">
        You are not allowed to perform this action!
      </p>
      <div>
        <Button>
          <Link to={roles.includes("admin") ? "/admin" : "/transactions"}>
            Back to home
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default NotAllowed;
