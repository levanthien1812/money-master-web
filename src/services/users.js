import instance from "../config/axiosConfig";

export default class UsersServices {
  static async updateUser(data) {
    const response = await instance.post("/users?_method=PATCH", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  }

  static async updatePassword(data) {
    const response = await instance.post(
      "/users/update-password?_method=PATCH",
      data
    );

    return response.data;
  }

  static async deleteUser() {
    const response = await instance.delete("/users");

    return response.data;
  }

  static async deleteUserById(id) {
    const response = await instance.delete("/users/" + id);

    return response.data;
  }

  static async getUsers() {
    const response = await instance.get("/users");

    return response.data;
  }

  static async getCounts() {
    const response = await instance.get("/users/count");

    return response.data;
  }

  static async getYears() {
    const response = await instance.get("/users/years");

    return response.data;
  }
}
