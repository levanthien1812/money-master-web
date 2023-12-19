import instance from "../config/axiosConfig";

export default class NotificationsService {
    static async getNotifications() {
        const response = await instance.get("/notifications");

        return response.data;
    }

    static async markAsRead(id) {
        const response = await instance.patch("/notifications/mark-as-read/" + id);

        return response.data;
    }

    static async markAllAsRead() {
        const response = await instance.patch("/notifications/mark-all-as-read");

        return response.data;
    }

    static async deleteNotification(id) {
        const response = await instance.delete("/notifications/" + id);

        return response.data;
    }
}
