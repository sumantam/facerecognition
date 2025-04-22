import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import ChangeOverService from "../services/changeover-service";

export const fetchAllData = createAsyncThunk(
  "fetchAllData",
  async (obj) => {
    const res = await ChangeOverService.createListOfUrlsAndGetData(obj.plant, obj.tq, obj.date);
    return { data: res };
  }
)


export const fetchChangeOverGridTrendData = createAsyncThunk(
  "fetchChangeOverGridTrendData",
  async (obj) => {
    const res = await ChangeOverService.getChangeOverGridTrendDataByLine(obj.plant, obj.line, obj.tq, obj.date);
    return { data: res.data };
  }
);

const changeOverSlice = createSlice({
  name: "changeover-data",
  initialState: {
    allData: {},
    data: [],
    trendData: [],
    isLoading: false,
    isError: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllData.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchAllData.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload?.data?.length > 0 && state.data !== action.payload.data)
          state.allData = action.payload.data;
      })
      .addCase(fetchAllData.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      });

    builder
      .addCase(fetchChangeOverGridTrendData.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }).addCase(fetchChangeOverGridTrendData.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchChangeOverGridTrendData.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload?.data?.length > 0 && state.chGridTrendData !== action.payload.data)
          state.chGridTrendData = action.payload.data;
      });
  },
});
export const selectChangeOverState = (state) => state;

export const changeOverStateSelector = createSelector(
  selectChangeOverState,
  (state) => state
);

export default changeOverSlice.reducer;
