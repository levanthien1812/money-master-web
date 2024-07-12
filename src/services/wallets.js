import instance from "../config/axiosConfig";
import { isSuccessRes } from "../utils/http";

export default class WalletsService {
  static async getWallets() {
    const responseData = await instance.get("/wallets");
    
    console.log(responseData.data.data.wallets)

    if (isSuccessRes(responseData.status)) {
      return responseData.data.data.wallets;
    }

    return [];
  }

  static async createWallet(data) {
    const responseData = await instance.post("/wallets", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return responseData.data;
  }

  static async updateWallet(data, id) {
    const responseData = await instance.post(
      "/wallets/" + id + "?_method=PATCH",
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return responseData.data;
  }

  static async deleteWallet(id) {
    const responseData = await instance.delete("/wallets/" + id);

    return responseData.data;
  }
}
