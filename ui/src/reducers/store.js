import { combineReducers, configureStore } from "@reduxjs/toolkit";
import dashboardReducer from "./dashboard-reducer";
import loginReducer from "./loggedin-user-reducer";
import usersReducer from "./users-reducer";
import microstopDataReducer from "./microstop-data-reducer";
import filterReducer from "./filter-reducer";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import breakdownDataReducer from "./breakdown-data-reducer";
import changeOverDataReducer from "./changeover-data-reducer";
import breadCrumbReducer from "./bread-crumb-reducer";

const rootReducer = combineReducers({
  login: loginReducer,
  dashboard: dashboardReducer,
  users: usersReducer,
  microstop: microstopDataReducer,
  breakdown: breakdownDataReducer,
  changeOver: changeOverDataReducer,
  filter: filterReducer,
  breadCrumb: breadCrumbReducer,
});

const rootPersistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
