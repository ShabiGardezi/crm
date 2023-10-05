import { createSlice } from "@reduxjs/toolkit";
const departmentReducer = createSlice({
  name: "departments",
  initialState: {
    departmentData: null,
  },
  reducers: {
    setDepartmentData: (state, action) => {
      state.departmentData = action.payload;
    },
  },
});

export const { setDepartmentData } = departmentReducer.actions;
export default departmentReducer.reducer;
