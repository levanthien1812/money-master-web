import instance from "../config/axiosConfig";

export default class ReportsService {
  static async getReports(params) {
    const response = await instance.get("/reports", {
      params,
    });

    return response.data;
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
