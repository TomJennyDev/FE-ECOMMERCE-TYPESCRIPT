import apiService from "../app/apiService";
import { Category, Response } from "../interface";
const categoryApi = {
  getCategoryAll(): Promise<Response<Category>> {
    const url = "/category/public";
    return apiService.get(`/category/public`);
  },
};
export default categoryApi;
