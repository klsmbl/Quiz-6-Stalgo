import { ORDER_ADD } from "../constants/orderConstants";
import { getOrders, saveOrders } from "../../utils/storage";

export function addOrder(order) {
  const nextOrders = [...getOrders(), order];
  saveOrders(nextOrders);
  return {
    type: ORDER_ADD,
    payload: order,
  };
}
