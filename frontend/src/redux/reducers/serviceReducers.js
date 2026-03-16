import { SERVICE_ADD, SERVICE_DELETE, SERVICE_UPDATE } from "../constants/serviceConstants";
import { getSellerServices } from "../../utils/storage";
import catalogServices from "../../data/services";

const initialState = {
  catalogServices,
  sellerServices: getSellerServices(),
};

export function serviceReducer(state = initialState, action) {
  switch (action.type) {
    case SERVICE_ADD:
      return {
        ...state,
        sellerServices: [...state.sellerServices, action.payload],
      };
    case SERVICE_UPDATE:
      return {
        ...state,
        sellerServices: state.sellerServices.map((service) =>
          service.id === action.payload.id ? { ...service, ...action.payload } : service,
        ),
      };
    case SERVICE_DELETE:
      return {
        ...state,
        sellerServices: state.sellerServices.filter((service) => service.id !== action.payload),
      };
    default:
      return state;
  }
}
