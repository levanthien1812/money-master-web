import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsis,
  faUser,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { Popover } from "@headlessui/react";

function AccountPopup({
  onLogout,
  onClickWallets,
  onClickProfile,
}) {
  const roles = useSelector((state) => state.auth.roles);

  return (
    <Popover className={"flex justify-center"}>
      <Popover.Button className="bg-gray-100 w-6 h-6 rounded-full flex justify-center items-center hover:bg-gray-200 outline-none">
        <FontAwesomeIcon icon={faEllipsis} />
      </Popover.Button>

      <Popover.Panel className="absolute z-10 left-8 top-0 shadow-lg bg-white p-3 rounded-xl overflow-hidden">
        <div className="flex flex-col gap-2">
          <Popover.Button
            className="bg-blue-100 py-2 w-52 rounded-md whitespace-nowrap hover:bg-blue-200 hover:font-semibold"
            onClick={onClickProfile}
          >
            <FontAwesomeIcon
              icon={faUser}
              className="text-xl me-2 text-blue-400"
            />
            View profile
          </Popover.Button>
          {roles.includes("user") && (
            <Popover.Button
              className="bg-blue-100 py-2 w-52 rounded-md whitespace-nowrap hover:bg-blue-200 hover:font-semibold"
              onClick={onClickWallets}
            >
              <FontAwesomeIcon
                icon={faWallet}
                className="text-xl me-2 text-blue-400"
              />
              Your wallets
            </Popover.Button>
          )}
          <Popover.Button
            className="bg-blue-100 py-2 w-52 rounded-md whitespace-nowrap hover:bg-blue-200 hover:font-semibold uppercase text-red-400"
            onClick={() => onLogout()}
          >
            Log out
          </Popover.Button>
        </div>
      </Popover.Panel>
    </Popover>
  );
}

export default AccountPopup;
