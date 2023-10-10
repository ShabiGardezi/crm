import { combineReducers } from "redux";

const businessDetailsReducer = combineReducers({
  customDevBusinessDetails: customDevBusinessDetailsReducer,
  localSeoBusinessDetails: localSeoBusinessDetailsReducer,
  paidMarketingBusinessDetails: paidMarketingBusinessDetailsReducer,
  reviewsBusinessDetails: reviewsBusinessDetailsReducer,
  socialMediaBusinessDetails: socialMediaBusinessDetailsReducer,
  websiteSEOBusinessDetails: websiteSEOBusinessDetailsReducer,
  wordpressBusinessDetails: wordpressBusinessDetailsReducer,
});

export default businessDetailsReducer;
