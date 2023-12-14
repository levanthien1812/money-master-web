import instance from "../config/axiosConfig";

export default class PlansService {
  static async createMonthPlan(data) {
    const response = await instance.post("/plans/month", data);

    return response.data;
  }

  static async createCategoryPlan(data) {
    const response = await instance.post("/plans/category", data);

    return response.data;
  }

  static async getMonthPlans(params) {
    const response = await instance.get("/plans/month", {
      params,
    });

    return response.data;
  }

  static async getMonthPlansYears(params) {
    const response = await instance.get("/plans/month/years", {
      params,
    });

    return response.data;
  }

  static async getCategoryPlans(params) {
    const response = await instance.get("/plans/category", {
      params,
    });

    return response.data;
  }

  static async getCategoryPlansYears(params) {
    const response = await instance.get("/plans/category/years", {
      params,
    });

    return response.data;
  }

  static async deleteMonthPlan(id) {
    const response = await instance.delete("/plans/month/" + id);

    return response.data;
  }

  static async deleteCategoryPlan(id) {
    const response = await instance.delete("/plans/category/" + id);

    return response.data;
  }

  static async updateMonthPlan(data, id) {
    const response = await instance.patch("/plans/month/" + id, data);

    return response.data;
  }

  static async updateCategoryPlan(data, id) {
    const response = await instance.patch("/plans/category/" + id, data);

    return response.data;
  }
}
