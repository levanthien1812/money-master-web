import axios from "axios";
import instance, { notAuthInstance } from "../config/axiosConfig";

export default class AuthService {
  static async register(data) {
    const response = await notAuthInstance.post("/register", data);

    return response.data;
  }

  static async verifyEmail(data) {
    const response = await notAuthInstance.post("/verify", data);

    return response.data;
  }

  static async sendVerificationCode(data) {
    const response = await notAuthInstance.post(
      "/send-verification-code",
      data
    );

    return response.data;
  }

  static async initCSRF() {
    const response = await axios.get(
      "http://localhost:8000/sanctum/csrf-cookie"
    );

    return response.data;
  }

  static async login(data) {
    const response = await notAuthInstance.post("/login", data);

    return response.data;
  }

  static async forgetPassword(data) {
    const response = await notAuthInstance.post("/forget-password", data);

    return response.data;
  }

  static async resetPassword(data) {
    const response = await notAuthInstance.post("/reset-password", data);

    return response.data;
  }

  static async logout() {
    const response = await instance.post("/logout");

    return response.data;
  }
}
