import { createSlice } from "@reduxjs/toolkit";

const darkModeSlice = createSlice({
  name: "darkMode",
  initialState: { boolean: false },
  reducers: {
    changeTheme: (state, action) => {
      state.boolean = action.payload;
    },
  },
});

export const { changeTheme } = darkModeSlice.actions;

export default darkModeSlice.reducer;
