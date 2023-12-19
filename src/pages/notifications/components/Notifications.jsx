import React, { useEffect, useState } from "react";
import NotificationItem from "./NotificationItem";
import { useDispatch, useSelector } from "react-redux";
import Select from "../../../components/elements/Select";
import NotificationsService from "../../../services/notifications";
import { notificationsActions } from "../../../stores/notifications";
import { toast } from "react-toastify";

const options = [
  {
    id: 1,
    name: "All",
    value: "all",
  },
  {
    id: 2,
    name: "Unread",
    value: "unread",
  },
];

function Notifications() {
  const dispatch = useDispatch();
  const { notifications } = useSelector((state) => state.notification);
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const [filteredNotifications, setFilteredNotifications] =
    useState(notifications);

  const handleMarkAllAsRead = async () => {
    try {
      const responseData = await NotificationsService.markAllAsRead();

      if (responseData.status === "success") {
        dispatch(notificationsActions.markAllAsRead());
      }
    } catch (e) {
      toast.error();
    }
  };

  useEffect(() => {
    if (selectedOption.id === 2) {
      setFilteredNotifications(
        notifications.filter((notification) => notification.read_at === null)
      );
    } else {
      setFilteredNotifications(notifications);
    }
  }, [selectedOption, notifications]);

  return (
    <div className="lg:w-[400px] md:w-3/5 w-full absolute lg:left-40 md:left-4 left-0 lg:top-0 md:top-28 top-24 bg-white p-4 rounded-2xl shadow-lg">
      <div className="flex justify-between">
        <p className="text-2xl mb-3">Notifications</p>
        <div>
          <Select
            data={options}
            selected={selectedOption}
            setSelected={setSelectedOption}
            size="small"
            width={24}
          />
        </div>
      </div>

      {filteredNotifications.length > 0 && (
        <>
          <div className="mb-2 flex justify-end">
            <button
              className="text-sm text-purple-600 hover:font-bold hover:bg-purple-100 hover:rounded-lg px-2"
              onClick={handleMarkAllAsRead}
            >
              Mark all as read
            </button>
          </div>

          <div className="max-h-[500px] overflow-y-scroll pe-1">
            {filteredNotifications.map((notification) => (
              <NotificationItem
                notification={notification}
                key={notification.id}
              />
            ))}
          </div>
        </>
      )}
      {filteredNotifications.length === 0 && (
        <p className="text-center text-3xl px-3 mt-3">
          {selectedOption.id === 1
            ? "You have no notifications"
            : "You have no unread notifications"}
        </p>
      )}
    </div>
  );
}

export default Notifications;
