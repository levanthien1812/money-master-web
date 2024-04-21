import instance from "../config/axiosConfig";
import { isSuccessRes } from "../utils/http";

export default class ReportsService {
  static async getReports(params, signal) {
    const response = await instance.get(
      "/reports",
      {
        params,
      },
      { signal: signal }
    );

    if (isSuccessRes(response.status)) {
      return response.data.data.reports;
    }

    return [];
  }

  static async getUserQuantityPerMonth(params) {
    const response = await instance.get("/reports/users-per-month", {
      params,
    });

    return response.data;
  }
  static async getTransactionQuantityPerMonth(params) {
    const response = await instance.get("/reports/transactions-per-month", {
      params,
    });

    return response.data;
  }

  static async saveExport(params) {
    return await instance.get("/reports/export", {
      params,
      responseType: "blob",
    });
  }
}
