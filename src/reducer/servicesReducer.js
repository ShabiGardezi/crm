// reducer.js
export default function Servicereducer(
  state = {
    serviceName: "",
    serviceDescription: "",
    serviceQuantity: "",
    servicePrice: "",
  },
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
