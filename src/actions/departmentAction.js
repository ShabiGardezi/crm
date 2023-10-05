// src/actions/pagesActions.js
import axios from "axios";
import { setDepartmentData } from "../reducer/departmentReducer";
export const fetchPageData = () => {
  // Implement your API request logic here to fetch page data
  return async (dispatch) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/departments`);
      const data = response.data; // Access data directly from response
      dispatch(setDepartmentData(data));
    } catch (error) {
      console.error("Error fetching page data:", error);
    }
  };
};
