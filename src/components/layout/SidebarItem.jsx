import React from "react";
import { NavLink } from "react-router-dom";

function SidebarItem({ item }) {
  const handleClick = () => {
    const element = document.getElementById(item.id);
    element.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <NavLink
        end
        to={item.link}
        id={item.id}
        className={({ isActive }) =>
          "lg:py-3 lg:px-7 sm:p-2 rounded-2xl cursor-pointer hover:bg-blue-100 py-1 px-2 " +
          (isActive ? "bg-blue-300" : "sm:bg-blue-50 ")
        }
        onClick={handleClick}
      >
        <div className="flex lg:flex-col sm:flex-row items-center sm:gap-2 px-1 justify-center">
          <div className="rounded-full lg:w-20 lg:h-20 hidden sm:block sm:w-10 sm:h-10 bg-blue-100 hover:bg-blue-200 lg:p-5 sm:p-2 sm:shrink-0">
            <img
              src={item.image}
              alt=""
              className="w-full h-full hover:relative hover:scale-125 hover:rotate-3 transition-all"
            />
          </div>
          <p className="text-sm font-semibold text-center whitespace-nowrap">
            {item.name}
          </p>
        </div>
      </NavLink>
    </>
  );
}

export default SidebarItem;
