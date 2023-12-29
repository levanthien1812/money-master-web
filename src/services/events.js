import instance from "../config/axiosConfig";

export default class EventsService {
  static async getEvents() {
    const responseData = await instance.get("/events");

    return responseData.data;
  }

  static async createEvent(data) {
    const responseData = await instance.post("/events", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return responseData.data;
  }

  static async updateEvent(data, id) {
    const responseData = await instance.post(
      "/events/" + id + "?_method=PATCH",
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return responseData.data;
  }

  static async deleteEventWithTransactions(id) {
    const responseData = await instance.delete("/events/" + id + "/with-transactions");

    return responseData.data;
  }

  static async deleteEventWithoutTransactions(id) {
    const responseData = await instance.delete("/events/" + id + "/without-transactions");

    return responseData.data;
  }

  static async getTransactionsByEvent(id) {
    const responseData = await instance.get("/events/" + id + "/transactions");

    return responseData.data;
  }
}
