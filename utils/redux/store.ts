import { configureStore } from "@reduxjs/toolkit";
import darkModeSlice from "./darkModeSlice";
import colorSlice from "./colorSlice";

export const makeStore = () => {
  return configureStore({
    reducer: { darkMode: darkModeSlice, colorSlice },
  });
};
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
