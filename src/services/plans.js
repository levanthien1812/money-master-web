import instance from "../config/axiosConfig";
import { isSuccessRes } from "../utils/http";

export default class PlansService {
  static async createMonthPlan(data) {
    const response = await instance.post("/plans/month", data);

    return response.data;
  }

  static async createCategoryPlan(data) {
    const response = await instance.post("/plans/category", data);

    return response.data;
  }

  static async getMonthPlans(params, signal) {
    const response = await instance.get("/plans/month", {
      params,
      signal,
    });

    if (isSuccessRes(response.status)) {
      return response.data.data.plans;
    }

    return [];
  }

  static async getMonthPlansYears(params, signal) {
    const response = await instance.get("/plans/month/years", {
      params,
      signal,
    });

    if (isSuccessRes(response.status)) {
      return response.data.data.years;
    }

    return [];
  }

  static async getCategoryPlans(params, signal) {
    const response = await instance.get("/plans/category", {
      params,
      signal,
    });

    if (isSuccessRes(response.status)) {
      return response.data.data.plans;
    }

    return null;
  }

  static async getCategoryPlansYears(params, signal) {
    const response = await instance.get("/plans/category/years", {
      params,
      signal,
    });

    if (isSuccessRes(response.status)) {
      return response.data.data.years;
    }

    return [];
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
