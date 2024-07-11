import instance from "../config/axiosConfig";
import { isSuccessRes } from "../utils/http";

export default class TransactionsService {
  static async getTransactions(params, signal) {
    const response = await instance.get("/transactions", {
      params,
    });

    if (isSuccessRes(response.status)) {
      return response.data.data.transactions;
    }

    return [];
  }

  static async getTransactionsYears(params, signal) {
    const response = await instance.get("/transactions/years", {
      params,
      signal,
    });

    if (isSuccessRes(response.status)) {
      return response.data.data.years;
    }

    return [];
  }

  static async deleteTransaction(id) {
    const response = await instance.delete("/transactions/" + id);

    return response.data;
  }

  static async createTransaction(data) {
    const response = await instance.post("/transactions", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  }

  static async updateTransaction(data, id) {
    const response = await instance.post(
      "/transactions/" + id + "?_method=PATCH",
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  }

  static async getCounts() {
    const response = await instance.get("/transactions/count");

    return response.data;
  }
}
