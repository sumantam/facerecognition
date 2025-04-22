import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import BreakdownService from "../services/breakdown-service";

export const fetchBreakdownData = createAsyncThunk(
  "fetchBreakdownData",
  async (obj) => {
    const breakdownData = await BreakdownService.getBreakdownData(
      obj.line,
      obj.tq, 
      obj.date
    );
    const breakdownTrendData = await BreakdownService.getBreakdownTrendData(
      obj.line,
      obj.tq,
      obj.date
    );
    const breakdownActions = await BreakdownService.getBreakdownActions(
      obj.line,
      obj.tq,
      obj.date
    );
    return {
      data: breakdownData,
      trend: breakdownTrendData,
      actions: breakdownActions,
    };
  }
);

export const fetchBreakdownDataByMachine = createAsyncThunk(
  "fetchBreakdownDataByMachine",
  async (obj) => {
    const breakdownData = await BreakdownService.getBreakdownDataByMachine(
      obj.line,
      obj.tq,
      obj.mId,
      obj.date
    );
    const breakdownTrendData = await BreakdownService.getBreakdownTrendDataByMachine(
      obj.line,
      obj.tq,
      obj.mId,
      obj.date
    );
    const breakdownActions = await BreakdownService.getBreakdownActionsByMachine(
      obj.line,
      obj.tq,
      obj.mName,
      obj.date
    );
    return {
      data: breakdownData,
      trend: breakdownTrendData,
      actions: breakdownActions,
    };
  }
);

const breakdownSlice = createSlice({
  name: "breakdown-data",
  initialState: {
    data: [],
    trendData: [],
    actions: [],
    isLoading: false,
    isError: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBreakdownData.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchBreakdownData.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload?.data?.length > 0 && state.data !== action.payload.data)
          state.data = action.payload.data;
        if (
          action.payload?.trend?.length > 0 &&
          state.trendData !== action.payload.trend
        )
          state.trendData = action.payload.trend;
        if (
          action.payload?.actions?.length > 0 &&
          state.actions !== action.payload.actions
        )
          state.actions = action.payload.actions;
      })
      .addCase(fetchBreakdownData.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      });

      builder
      .addCase(fetchBreakdownDataByMachine.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchBreakdownDataByMachine.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload?.data?.length > 0 && state.data !== action.payload.data)
          state.data = action.payload.data;
        if (
          action.payload?.trend?.length > 0 &&
          state.trendData !== action.payload.trend
        )
          state.trendData = action.payload.trend;
        if (
          action.payload?.actions?.length > 0 &&
          state.actions !== action.payload.actions
        )
          state.actions = action.payload.actions;
      })
      .addCase(fetchBreakdownDataByMachine.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export const selectBreakdownState = (state) => state.breakdown;

export const breakdownStateSelector = createSelector(
  selectBreakdownState,
  (state) => state
);

export default breakdownSlice.reducer;
