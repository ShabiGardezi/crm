const customDevBusinessDetailsReducer = (state = {}, action) => {
  switch (action.type) {
    case "UPDATE_CUSTOM_DEV_BUSINESS_DETAILS":
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export default customDevBusinessDetailsReducer;
