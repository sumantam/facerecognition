import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import MicrostopService from '../services/microstop-service';

export const fetchMicrostopData = createAsyncThunk('fetchMicrostopData', async (obj) => {
  const microstopData = await MicrostopService.getMicrostopData(obj.line, obj.timeQ, obj.date);
  const microstopTrendData = await MicrostopService.getMicrostopTrendData(obj.line, obj.timeQ, obj.date);
  const microstopActions = await MicrostopService.getMicrostopActionsData(obj.line, obj.timeQ, obj.date);
  return { data: microstopData,trend:microstopTrendData, actions: microstopActions };
});

export const fetchMicrostopDataByMachine = createAsyncThunk('fetchMicrostopDataByMachine', async (obj) => {
  const microstopData = await MicrostopService.getMicrostopDataByMachine(obj.line, obj.timeQ, obj.mid, obj.date);
  const microstopTrendData = await MicrostopService.getMicrostopTrendDataByMachine(obj.line, obj.timeQ, obj.mid, obj.date);
  const microstopActions = await MicrostopService.getMicrostopActionsByMachine(obj.line, obj.timeQ, obj.mName, obj.date);
  return { data: microstopData,trend:microstopTrendData, actions: microstopActions };
});

const microstopSlice = createSlice({
  name: 'microstop-data',
  initialState: {
    data: [],
    trend:[],
    actions: [],
    isLoading: false,
    isError: false
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMicrostopData.pending, (state, action) => {
      state.isLoading = true;
    }).addCase(fetchMicrostopData.fulfilled, (state, action) => {
      state.isLoading = false;
      if (action.payload?.data?.length > 0 && state.data !== action.payload.data)
        state.data = action.payload.data;
      if (action.payload?.data?.length > 0 && state.trend !== action.payload.trend)
        state.trend = action.payload.trend;
      if (action.payload?.actions?.length > 0 && state.actions !== action.payload.actions)
        state.actions = action.payload.actions;
    }).addCase(fetchMicrostopData.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
    });

    builder.addCase(fetchMicrostopDataByMachine.pending, (state, action) => {
      state.isLoading = true;
    }).addCase(fetchMicrostopDataByMachine.fulfilled, (state, action) => {
      state.isLoading = false;
      if (action.payload?.data?.length > 0 && state.data !== action.payload.data)
        state.data = action.payload.data;
      if (action.payload?.data?.length > 0 && state.trend !== action.payload.trend)
        state.trend = action.payload.trend;
      if (action.payload?.actions?.length > 0 && state.actions !== action.payload.actions)
        state.actions = action.payload.actions;
    }).addCase(fetchMicrostopDataByMachine.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
    });
  }
});

export const selectMicrostopState = (state) => state.microstop;

export const microstopStateSelector = createSelector(selectMicrostopState, state => state);

export default microstopSlice.reducer;
