import instance from "../config/axiosConfig";

export default class CategoriesService {
  static async getCategories(params) {
    const responseData = await instance.get("/categories", {
      params,
    });

    return responseData.data;
  }

  static async getDefaultCategories(params) {
    const responseData = await instance.get("/categories/default", {
      params,
    });

    return responseData.data;
  }

  static async getDefaultCount() {
    const responseData = await instance.get("/categories/default/count");

    return responseData.data;
  }

  static async createCategory(data) {
    const responseData = await instance.post("/categories", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return responseData.data;
  }

  static async createDefaultCategory(data) {
    const responseData = await instance.post("/categories/default", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return responseData.data;
  }

  static async updateCategory(data, id) {
    const responseData = await instance.post(
      "/categories/" + id + "?_method=PATCH",
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return responseData.data;
  }

  static async deleteCategory(id) {
    const responseData = await instance.delete("/categories/" + id);

    return responseData.data;
  }

  static async deleteDefaultCategory(id) {
    const responseData = await instance.delete("/categories/default/" + id);

    return responseData.data;
  }
}
