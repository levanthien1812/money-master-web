import React, { useEffect, useMemo, useState } from "react";
import SidebarItem from "./SidebarItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import categories from "../../assets/images/categories.png";
import plan from "../../assets/images/money-bag.png";
import report from "../../assets/images/seo-report.png";
import target from "../../assets/images/target.png";
import expenses from "../../assets/images/spending.png";
import avatar from "../../assets/images/profile.png";
import users from "../../assets/images/teamwork.png";
import calendar from "../../assets/images/calendar.png";
import AccountPopup from "./AccountPopup";
import Wallets from "../../pages/wallets/components/Wallets";
import Profile from "../../pages/profile/components/Profile";
import { useSelector } from "react-redux";
import "../../styles/sidebar.css";
import Notifications from "../../pages/notifications/components/Notifications";
import IncomeTaxInfo from "../../pages/personal-income-tax/components/IncomeTaxInfo";
import { useTranslation } from "react-i18next";
import { motion, useAnimation } from "framer-motion";

function Sidebar({ onLogout }) {
  const [isWalletsShown, setIsWalletsShown] = useState(false);
  const [isProfileShown, setIsProfileShown] = useState(false);
  const [isNotificationsShown, setIsNotificationsShown] = useState(false);
  const [isIncomeTaxShown, setIsIncomeTaxShown] = useState(false);
  const [ringing, setRinging] = useState(true);

  const { user, roles } = useSelector((state) => state.auth);
  const { notifications } = useSelector((state) => state.notification);

  const { t, i18n } = useTranslation();
  const controls = useAnimation();

  const sidebarItems = useMemo(() => {
    if (roles.includes("user")) {
      return [
        {
          id: 1,
          name: t("sidebar.transactions"),
          image: expenses,
          link: "/transactions",
        },
        {
          id: 2,
          name: t("sidebar.plans"),
          image: plan,
          link: "/plans",
        },
        {
          id: 3,
          name: t("sidebar.reports"),
          image: report,
          link: "/reports",
        },
        {
          id: 4,
          name: t("sidebar.goals"),
          image: target,
          link: "/goals",
        },
        {
          id: 5,
          name: t("sidebar.categories"),
          image: categories,
          link: "/categories",
        },
        {
          id: 6,
          name: t("sidebar.events"),
          image: calendar,
          link: "/events",
        },
      ];
    } else {
      return [
        {
          id: 1,
          name: t("sidebar.dashboard"),
          image: expenses,
          link: "/admin",
        },
        {
          id: 2,
          name: t("sidebar.users"),
          image: users,
          link: "/admin/users",
        },
        {
          id: 3,
          name: t("sidebar.default_categories"),
          image: categories,
          link: "/admin/categories",
        },
      ];
    }
  }, [roles, t]);

  const handleBellClick = () => {
    setRinging(false);
    setIsNotificationsShown(!isNotificationsShown);
  };

  // Run the initial ringing animation when the component mounts
  useEffect(() => {
    const unreadNotifications = notifications.filter(
      (notification) => notification.read_at === null
    );

    if (ringing && unreadNotifications.length > 0) {
      controls.start({
        scale: [1, 1.2, 1],
        rotate: [0, 20, -20, 0],
        transition: { duration: 1, repeat: Infinity },
      });
    } else {
      // Reset the animation when ringing is set to false
      controls.stop();
      controls.set({ scale: 1, rotate: 0 });
    }
  }, [controls, ringing, notifications]);

  const handleClickWallets = () => {
    setIsWalletsShown(true);
  };

  const handleClickProfile = () => {
    setIsProfileShown(true);
  };

  const handleClickLanguage = () => {
    if (i18n.language === "vi") {
      i18n.changeLanguage("en");
    } else {
      i18n.changeLanguage("vi");
    }
  };

  return (
    <div
      className="sidebar w-screen lg:h-screen bg-white lg:w-40 px-5 sm:py-5 py-4 lg:px-3 shadow-lg flex lg:flex-col lg:justify-start flex-row sm:justify-center justify-start lg:gap-5 gap-3 items-center lg:rounded-br-3xl h-fit sticky top-0 left-0 bg-opacity-90"
      style={{ zIndex: 25 }}
    >
      <div className="lg:mb-2 mb-0 flex flex-col items-center relative">
        <div className="absolute top-0 right-0">
          <AccountPopup
            onLogout={onLogout}
            onClickWallets={handleClickWallets}
            onClickProfile={handleClickProfile}
            onClickIncomeTax={() => setIsIncomeTaxShown(true)}
            onClickLanguage={handleClickLanguage}
          />
        </div>

        <div className="rounded-full lg:w-16 lg:h-16 w-12 h-12 overflow-hidden shadow-md">
          <img
            src={user.photo ? user.photo : avatar}
            alt=""
            className="object-cover w-full h-full"
          />
        </div>
      </div>

      {/* Notifications */}
      <div className="lg:w-full lg:relative">
        <div
          className="bg-gray-200 rounded-md w-full py-1.5 px-3 hover:bg-gray-300 relative flex justify-center"
          onClick={handleBellClick}
        >
          <motion.button animate={controls} whileHover={{ scale: 1.1 }}>
            <FontAwesomeIcon icon={faBell} className="text-xl" />
          </motion.button>
          <span className="block bg-red-500 text-white text-sm px-2 rounded-full absolute -top-2 right-0">
            {
              notifications.filter(
                (notification) => notification.read_at === null
              ).length
            }
          </span>
        </div>
        {isNotificationsShown && <Notifications />}
      </div>

      <ul
        className="flex lg:flex-col flex-row sm:gap-3 gap-0 overflow-x-scroll lg:justify-start w-full"
        id="sidebar"
      >
        {sidebarItems.map((item) => (
          <SidebarItem item={item} key={item.id} />
        ))}
      </ul>

      <div className="gap-2 items-center mt-4 hidden lg:flex">
        <FontAwesomeIcon icon={faCircleInfo} />
        <a href="#" className="text-sm hover:font-semibold">
          Help?
        </a>
      </div>

      {isWalletsShown && <Wallets onClose={() => setIsWalletsShown(false)} />}
      {isProfileShown && <Profile onClose={() => setIsProfileShown(false)} />}
      {isIncomeTaxShown && (
        <IncomeTaxInfo onClose={() => setIsIncomeTaxShown(false)} />
      )}
    </div>
  );
}

export default Sidebar;
