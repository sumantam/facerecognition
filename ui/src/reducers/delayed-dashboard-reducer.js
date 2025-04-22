import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import DelayDashboardService from "../services/delayed-dashboard-service";

export const fetchOeeData = createAsyncThunk(
  "fetchOeeData",
  async (obj) => {
    const res = await DelayDashboardService.createListOfUrlsAndGetOeeData(obj.plant, obj.tq, obj.date);
    return { data: res };
  }
)

export const fetchAllData = createAsyncThunk(
  "fetchAllData",
  async (obj) => {
    const res = await DelayDashboardService.createListOfUrlsAndGetData(obj.plant, obj.tq, obj.date);
    return { data: res };
  }
)

export const fetchLineWiseProductionData = createAsyncThunk(
  "fetchLineWiseProductionData",
  async (obj) => {
    const res = await DelayDashboardService.getLineWiseProductionByPlant(obj.plant, obj.tq, obj.date);
    return { data: res.data };
  }
);

export const fetchModelWiseProductionData = createAsyncThunk(
  "fetchModelWiseProductionData",
  async (obj) => {
    const res = await DelayDashboardService.getModelWiseProductionByPlant(obj.plant, obj.tq, obj.date);
    return { data: res.data };
  }
);

export const fetchCycleTimeData = createAsyncThunk(
  "fetchCycleTimeData",
  async (obj) => {
    const res = await DelayDashboardService.getCycleTimeDataByPlant(obj.plant, obj.tq, obj.date);
    return { data: res.data };
  }
);

const totalDelaySlice = createSlice({
  name: "delayed-dashboard-data",
  initialState: {
    oeeData: {},
    allData: {},
    cycleTimeData: [],
    lineWiseProductionData: [],
    modelWiseProductionData: [],
    isLoading: false,
    isError: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOeeData.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchOeeData.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload?.data?.length > 0 && state.data !== action.payload.data)
          state.oeeData = action.payload.data;
      })
      .addCase(fetchOeeData.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      });

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
      .addCase(fetchLineWiseProductionData.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchLineWiseProductionData.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload?.data?.length > 0 && state.data !== action.payload.data)
          state.lineWiseProductionData = action.payload.data;
      })
      .addCase(fetchLineWiseProductionData.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      });
   
    builder
      .addCase(fetchModelWiseProductionData.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchModelWiseProductionData.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload?.data?.length > 0 && state.data !== action.payload.data)
          state.modelWiseProductionData = action.payload.data;
      })
      .addCase(fetchModelWiseProductionData.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      });

    builder
      .addCase(fetchCycleTimeData.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }).addCase(fetchCycleTimeData.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchCycleTimeData.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload?.data?.length > 0 && state.cycleTimeData !== action.payload.data)
          state.cycleTimeData = action.payload.data;
      });

  },
});

export const selectTotalDelayState = (state) => state.totalDelay;

export const delayedDashboardStateSelector = createSelector(
  selectTotalDelayState,
  (state) => state
);

export default totalDelaySlice.reducer;
