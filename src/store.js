// src/store.js
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import departmentReducer from "./reducer/departmentReducer";
import formReducer from "./reducer/formReducer"; // Renamed the import to match your file name
import Servicereducer from "./reducer/servicesReducer";
import customDevBusinessDetailsReducer from "./reducer/BusinessDetails/customDevBusinessDetailsReducer";

// Combine the reducers
const rootReducer = combineReducers({
  departments: departmentReducer,
  form: formReducer, // You can rename it to whatever you want, e.g., 'formData'
  service: Servicereducer,
  customDevBusinessDetailsReducer: customDevBusinessDetailsReducer,
});

const store = configureStore({
  reducer: rootReducer, // Use the combined rootReducer
});

export default store;
