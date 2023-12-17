import { format } from "date-fns";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import NotificationsService from "../../../services/notifications";
import { useDispatch } from "react-redux";
import { notificationsActions } from "../../../stores/notifications";
import { toast } from "react-toastify";

function NotificationItem({ notification }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showMarkAsRead, setShowMarkAsRead] = useState(false);

  const handleNavigate = () => {
    navigate(notification.data.link);
  };

  const handleMarkAsRead = async (e) => {
    e.stopPropagation();

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

  return (
    <div
      className={`${
        !notification.read_at ? "bg-purple-100" : "bg-gray-100"
      } rounded-md py-2 px-3 mb-2 cursor-pointer hover:${
        !notification.read_at ? "bg-purple-200" : "bg-gray-200"
      }`}
      onClick={handleNavigate}
      onMouseOver={() => setShowMarkAsRead(true)}
      onMouseOut={() => setShowMarkAsRead(false)}
    >
      <div className="flex justify-end mb-1 gap-2">
        {showMarkAsRead && !notification.read_at && (
          <button
            className="text-purple-500 hover:underline hover:text-purple-600 text-sm "
            onClick={handleMarkAsRead}
          >
            Mark as read
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
