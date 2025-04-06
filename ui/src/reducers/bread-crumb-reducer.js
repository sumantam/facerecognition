import { createSelector, createSlice } from "@reduxjs/toolkit";

const breadCrumbSlice = createSlice({
  name: "bread-crumb",
  initialState: {
    paths: [{ path: "/oee/dashboard/world-map", name: "Global View", icon: "globe" }],
  },
  reducers: {
    addPath: (state, action) => {
      let pathNames = state.paths.map(p => p["name"]);
      if (!pathNames.includes(action.payload["name"]))
        state.paths.push(action.payload);
    },
    removePath: (state, action) => {
      state.paths = state.paths.slice(0, action.payload + 1);
    },
  },
});

export const selectBreadCrrumbPaths = (state) => {
  return state.breadCrumb.paths;
};

export const breadCrumbPathSelector = createSelector(
  selectBreadCrrumbPaths,
  (state) => state
);

export const { addPath, removePath } = breadCrumbSlice.actions;
export default breadCrumbSlice.reducer;
