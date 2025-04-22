import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import oeeAcceleratorService from '../services/oee-accelerator-service';

export const fetchOeeData = createAsyncThunk(
    "fetchOeeData",
    async (obj) => {
        const res = await oeeAcceleratorService.createListOfUrlsAndGetOeeData(obj.plant, obj.line, obj.tq, obj.date);
        return { data: res };
    }
)

export const fetchOeeDataForMap = createAsyncThunk(
    "fetchOeeDataForMap",
    async (obj) => {
        const res = await oeeAcceleratorService.createListOfUrlsAndGetOeeDataForWorldMap(obj.plant, obj.tq, obj.date);
        return { data: res };
    }
)

export const fetchAllData = createAsyncThunk(
    "fetchAllData",
    async (obj) => {
        const res = await oeeAcceleratorService.createListOfUrlsAndGetData(obj.plant, obj.line, obj.tq, obj.date);
        return { data: res };
    }
)

const oeeSlice = createSlice({
    name: "Oee",
    initialState: {
        oeeDataForMap: {},
        oeeData: {},
        allData: {},
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
            .addCase(fetchOeeDataForMap.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(fetchOeeDataForMap.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.payload?.data?.length > 0 && state.data !== action.payload.data)
                    state.oeeDataForMap = action.payload.data;
            })
            .addCase(fetchOeeDataForMap.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
            });

    }
});

export const selectOeeState = (state) => state.oee;

export const oeeSelector = createSelector(
    selectOeeState,
    (state) => state
);

export default oeeSlice.reducer;
