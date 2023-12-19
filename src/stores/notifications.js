import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import NotificationsService from "../services/notifications";
import { toast } from "react-toastify";

const initialState = {
    notifications: [],
}

export const fetchNotifications = createAsyncThunk(
    "notification/fetchNotifications",
    async () => {
        try {
            const responseData = await NotificationsService.getNotifications();
            return responseData.data.notifications;
        } catch (e) {
            toast.error(e.response.data.message);
        }
    }
);

const notificationsSlice = createSlice({
    name: "notifications",
    initialState: initialState,
    reducers: {
        addNotifitcation: (state, action) => {
            state.notifications.push(action.payload);
        },
        markAsRead: (state, action) => {
            const index = state.notifications.findIndex(notification => notification.id === action.payload)
            state.notifications[index].read_at = new Date()
        },
        markAllAsRead: (state, action) => {
            state.notifications.forEach(notification => {
                notification.read_at = new Date()
            })
        },
        deleteNotification: (state, action) => {
            state.notifications = state.notifications.filter(notification => notification.id !== action.payload)
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchNotifications.fulfilled, (state, action) => {
            state.notifications = action.payload;
        });
    }
})

export default notificationsSlice.reducer;

export const notificationsActions = notificationsSlice.actions;