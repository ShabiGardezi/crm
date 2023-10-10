// reducer.js
export default function reducer(
  state = { price: "", advanceprice: "" },
  action
) {
  switch (action.type) {
    case "UPDATE_FORM_DATA":
      return {
        ...state,
        [action.payload.name]: action.payload.value,
      };
    default:
      return state;
  }
}
