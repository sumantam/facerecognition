import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import MasterService from "../services/master-service";

export const fetchPlants = createAsyncThunk("fetchPlants", async () => {
  return MasterService.getPlants2();
});

export const fetchLines = createAsyncThunk("fetchLines", async (plant) => {
  return MasterService.getLines2(plant);
});

const filterSlice = createSlice({
  name: "microstop-data",
  initialState: {
    plants: [],
    lines: [],
    // timeQs: [
    //   { value: "day", text: "Day" },
    //   { value: "week", text: "Week" },
    //   { value: "month", text: "Month" },
    //   { value: "year", text: "Year" },
    // ],
    selectedDate: '',
    selectedTq: "day",
    selectedTheme: {},
    selectedPlant: "",
    selectedLine: "",
    selectedLineName: "",
    selectedPlantName: "",
    isLoading: false,
    isError: false,
    isRefreshButtonVisible: true,
    geoData: {}
  },
  reducers: {
    setDateFilter: (state, action) => {
      state.selectedDate = action.payload;
    },
    setTqFilter: (state, action) => {
      state.selectedTq = action.payload;
    },
    setThemeFilter: (state, action) => {
      state.selectedTheme = action.payload;
    },
    setGeoData: (state, action) => {
      state.geoData = action.payload;
    },
    setPlantFilter: (state, action) => {
      state.selectedPlant = action.payload;
    },
    setPlantNameFilter: (state, action) => {
      state.selectedPlantName = action.payload;
    },
    setLineFilter: (state, action) => {
      state.selectedLine = action.payload.Id;
      state.selectedLineName = action.payload.Name;
    },
    setRefreshButtonVisibility: (state, action) => {
      state.isRefreshButtonVisible = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlants.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchPlants.fulfilled, (state, action) => {
        state.isLoading = false;
        if (
          action.payload.data.length > 0 &&
          state.plants !== action.payload.data
        ) {
          state.plants = action.payload.data;
          // state.selectedPlant = action.payload.data[1].Id;
          // state.selectedPlantName = action.payload.data[1].Name;
        }
      })
      .addCase(fetchPlants.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      });

    builder
      .addCase(fetchLines.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchLines.fulfilled, (state, action) => {
        state.isLoading = false;
        if (
          action.payload.data.length > 0 &&
          state.lines !== action.payload.data
        ) {
          state.lines = action.payload.data;
        }
      })
      .addCase(fetchLines.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export const selectFilterState = (state) => state.filter;

export const plantsSelector = createSelector(
  (state) => state.filter.plants,
  (state) => state
);

// export const timeQsSelector = createSelector(
//   (state) => {
//     return state.filter.timeQs;
//   },
//   (state) => state
// );

export const linesSelector = createSelector(
  (state) => state.filter.lines,
  (state) => state
);

export const plantSelector = createSelector(
  (state) => state.filter.selectedPlant,
  (state) => state
);

export const lineSelector = createSelector(
  (state) => state.filter.selectedLine,
  (state) => state
);

export const lineNameSelector = createSelector(
  (state) => state.filter.selectedLineName,
  (state) => state
);

export const plantNameSelector = createSelector(
  (state) => state.filter.selectedPlantName,
  (state) => state
);

export const dateSelector = createSelector(
  (state) => state.filter.selectedDate,
  (state) => state
);

export const tqSelector = createSelector(
  (state) => state.filter.selectedTq,
  (state) => state
);

export const themeSelector = createSelector(
  (state) => state.filter.selectedTheme,
  (state) => state
);

export const geoDataSelector = createSelector(
  (state) => state.filter.geoData,
  (state) => state
)

export const filterStateSelector = createSelector(
  selectFilterState,
  (state) => state
);

export const refreshButtonVisibilitySelector = createSelector(
  (state) => state.filter.isRefreshButtonVisible,
  (state) => state
)

export const { setPlantFilter, setPlantNameFilter, setDateFilter, setTqFilter, setLineFilter, setThemeFilter, setGeoData, setRefreshButtonVisibility } = filterSlice.actions;
export default filterSlice.reducer;
