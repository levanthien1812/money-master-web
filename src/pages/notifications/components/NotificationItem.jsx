import { format } from "date-fns";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import NotificationsService from "../../../services/notifications";
import { useDispatch } from "react-redux";
import { notificationsActions } from "../../../stores/notifications";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

function NotificationItem({ notification }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [IsHover, setIsHover] = useState(false);
  const { t } = useTranslation();

  const handleNavigate = () => {
    handleMarkAsRead();
    navigate(notification.data.link);
  };

  const handleMarkAsRead = async (e) => {
    if (e) e.stopPropagation();

    try {
      const responseData = await NotificationsService.markAsRead(
        notification.id
      );

      if (responseData.status === "success") {
        dispatch(notificationsActions.markAsRead(notification.id));
      }
    } catch (e) {
      toast.error();
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();

    try {
      const responseData = await NotificationsService.deleteNotification(
        notification.id
      );

      if (responseData.status === "success") {
        dispatch(notificationsActions.deleteNotification(notification.id));
      }
    } catch (e) {
      toast.error();
    }
  };

  return (
    <div
      className={`${
        !notification.read_at ? "bg-purple-100" : "bg-gray-100"
      } rounded-md py-2 px-3 mb-2 cursor-pointer hover:${
        !notification.read_at ? "bg-purple-200" : "bg-gray-200"
      }`}
      onClick={handleNavigate}
      onMouseOver={() => setIsHover(true)}
      onMouseOut={() => setIsHover(false)}
    >
      <div className="flex justify-end mb-1 gap-2">
        {IsHover && !notification.read_at && (
          <button
            className="text-purple-500 hover:underline hover:text-purple-600 text-sm "
            onClick={handleMarkAsRead}
          >
            {t("noti.mark_read")}
          </button>
        )}
        {IsHover && (
          <button
            className="text-red-500 hover:underline hover:text-red-600 text-sm "
            onClick={handleDelete}
          >
            {t("action.delete")}
          </button>
        )}
        <p
          className={`text-sm ${
            !notification.read_at ? "bg-purple-300" : "bg-gray-300"
          } px-2 rounded-md`}
        >
          {format(new Date(notification.data.date), "dd/MM/yyyy")}
        </p>
      </div>
      <div>
        <p className="text-[15px]">{notification.data.message}</p>
      </div>
    </div>
  );
}

export default NotificationItem;
