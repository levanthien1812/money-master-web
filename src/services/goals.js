import instance from "../config/axiosConfig";

export default class GoalService {
  static async getGoals(params) {
    const response = await instance.get("/goals", { params });

    return response.data;
  }

  static async createGoal(data) {
    const response = await instance.post("/goals", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  }

  static async getGoalAdditions(goalId) {
    const response = await instance.get("/goals/" + goalId + "/additions");

    return response.data;
  }

  static async createGoalAdditions(goalId, data) {
    const response = await instance.post(
      "/goals/" + goalId + "/additions",
      data
    );

    return response.data;
  }

  static async getTransferableGoals(params) {
    const response = await instance.get("/goals/transferable", { params });

    return response.data;
  }

  static async returnToWallet(goalId, data) {
    const response = await instance.post("/goals/" + goalId + "/return", data);

    return response.data;
  }

  static async transferToGoal(goalId, data) {
    const response = await instance.post(
      "/goals/" + goalId + "/transfer",
      data
    );

    return response.data;
  }

  static async updateGoal(goalId, data) {
    const response = await instance.post(
      "/goals/" + goalId + "?_method=PATCH",
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  }

  static async deleteGoal(goalId) {
    const response = await instance.delete("/goals/" + goalId);

    return response.data;
  }
}
