import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsis,
  faLanguage,
  faMoneyBill,
  faRightFromBracket,
  faRotate,
  faUser,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { Popover } from "@headlessui/react";
import { useTranslation } from "react-i18next";

function AccountPopup({
  onLogout,
  onClickWallets,
  onClickProfile,
  onClickIncomeTax,
  onClickLanguage,
}) {
  const roles = useSelector((state) => state.auth.roles);
  const { i18n, t } = useTranslation();

  return (
    <Popover className={"flex justify-center"}>
      <Popover.Button className="bg-gray-100 w-6 h-6 rounded-full flex justify-center items-center hover:bg-gray-200 outline-none">
        <FontAwesomeIcon icon={faEllipsis} />
      </Popover.Button>

      <Popover.Panel className="absolute z-10 left-8 top-0 shadow-lg bg-white p-3 rounded-xl overflow-hidden flex flex-col">
        <div className="flex flex-col gap-2">
          <Popover.Button
            className="bg-blue-100 py-2 px-3 rounded-md whitespace-nowrap hover:bg-blue-200 hover:font-semibold text-left"
            onClick={onClickProfile}
          >
            <FontAwesomeIcon
              icon={faUser}
              className="text-xl me-2 text-blue-400 w-8"
            />
            {t("sidebar.view_profile")}
          </Popover.Button>
          {roles.includes("user") && (
            <>
              <Popover.Button
                className="bg-blue-100 py-2 px-3 rounded-md whitespace-nowrap hover:bg-blue-200 hover:font-semibold text-left"
                onClick={onClickWallets}
              >
                <FontAwesomeIcon
                  icon={faWallet}
                  className="text-xl me-2 text-blue-400  w-8"
                />
                {t("sidebar.your_wallets")}
              </Popover.Button>
              <Popover.Button
                className="bg-blue-100 py-2 px-3 rounded-md whitespace-nowrap hover:bg-blue-200 hover:font-semibold text-left"
                onClick={onClickIncomeTax}
              >
                <FontAwesomeIcon
                  icon={faMoneyBill}
                  className="text-xl me-2 text-blue-400  w-8"
                />
                {t("sidebar.personal_income_tax")}
              </Popover.Button>
            </>
          )}
          <Popover.Button
            className="bg-blue-100 py-2 px-3 rounded-md whitespace-nowrap hover:bg-blue-200 hover:font-semibold text-left"
            onClick={onClickLanguage}
          >
            <FontAwesomeIcon
              icon={faLanguage}
              className="text-xl me-2 text-blue-400  w-8"
            />
            {t("sidebar.language")}
            <FontAwesomeIcon
              icon={faRotate}
              className="text-xl ms-2 text-blue-400"
            />
          </Popover.Button>
          <Popover.Button
            className="bg-blue-100 py-2 px-3 rounded-md whitespace-nowrap hover:bg-blue-200 hover:font-semibold text-left text-red-400"
            onClick={() => onLogout()}
          >
            <FontAwesomeIcon
              icon={faRightFromBracket}
              className="text-xl me-2 text-blue-400  w-8"
            />
            {t("sidebar.logout")}
          </Popover.Button>
        </div>
      </Popover.Panel>
    </Popover>
  );
}

export default AccountPopup;
