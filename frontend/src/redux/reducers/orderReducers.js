import { ORDER_ADD } from "../constants/orderConstants";
import { getOrders } from "../../utils/storage";

const initialState = {
  orders: getOrders(),
};

export function orderReducer(state = initialState, action) {
  switch (action.type) {
    case ORDER_ADD:
      return {
        ...state,
        orders: [...state.orders, action.payload],
      };
    default:
      return state;
  }
}
