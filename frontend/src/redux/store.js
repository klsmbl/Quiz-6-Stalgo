import { combineReducers, createStore } from "redux";
import { authReducer } from "./reducers/authReducers";
import { orderReducer } from "./reducers/orderReducers";
import { sellerApplicationReducer } from "./reducers/sellerApplicationReducers";
import { serviceReducer } from "./reducers/serviceReducers";
import { userReducer } from "./reducers/userReducers";

const rootReducer = combineReducers({
  auth: authReducer,
  users: userReducer,
  services: serviceReducer,
  orders: orderReducer,
  sellerApplications: sellerApplicationReducer,
});

const devToolsExtension =
  typeof window !== "undefined" && window.__REDUX_DEVTOOLS_EXTENSION__
    ? window.__REDUX_DEVTOOLS_EXTENSION__()
    : undefined;

const store = createStore(rootReducer, devToolsExtension);

export default store;
