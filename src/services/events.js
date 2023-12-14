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

  static async deleteEvent(id) {
    const responseData = await instance.delete("/events/" + id);

    return responseData.data;
  }
}
