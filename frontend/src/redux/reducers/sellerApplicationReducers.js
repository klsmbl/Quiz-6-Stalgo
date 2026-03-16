import {
  SELLER_APPLICATION_ADD,
  SELLER_APPLICATION_REVIEW,
  SELLER_APPLICATION_SET_ALL,
} from "../constants/sellerApplicationConstants";
import { getSellerApplications } from "../../utils/storage";

const initialState = {
  applications: getSellerApplications(),
};

export function sellerApplicationReducer(state = initialState, action) {
  switch (action.type) {
    case SELLER_APPLICATION_SET_ALL:
      return {
        ...state,
        applications: action.payload,
      };
    case SELLER_APPLICATION_ADD:
      return {
        ...state,
        applications: [...state.applications, action.payload],
      };
    case SELLER_APPLICATION_REVIEW:
      return {
        ...state,
        applications: state.applications.map((application) => {
          if (application.email !== action.payload.email) {
            return application;
          }

          return {
            ...application,
            status: action.payload.status,
            merchantId: action.payload.merchantId,
            reasonForDecline: action.payload.reasonForDecline,
            reviewedAt: new Date().toISOString(),
          };
        }),
      };
    default:
      return state;
  }
}
