// src/store.js

import { configureStore } from "@reduxjs/toolkit";
import departmentReducer from "./reducer/departmentReducer";
const store = configureStore({
  reducer: {
    departments: departmentReducer,
  },
});

export default store;
