import { configureStore } from "@reduxjs/toolkit";
import darkModeSlice from "./darkModeSlice";

export const makeStore = () => {
  return configureStore({
    reducer: { darkMode: darkModeSlice },
  });
};
export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
