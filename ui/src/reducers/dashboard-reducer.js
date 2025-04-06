const SET_DASHBOARD_STATE = 'SET_DASHBOARD_STATE';
const SET_SELECTED_ITEM = 'SET_SELECTED_ITEM';
const SET_SELECTED_DRILLDOWN_ITEM='SET_SELECTED_DRILLDOWN_ITEM'

export const setDashboardState = newState => ({
  type: SET_DASHBOARD_STATE,
  payload: newState,
});

export const setSelectedItem = item => ({
  type: SET_SELECTED_ITEM,
  payload: item,
});

export const setSelectedDrillDownItem = item => ({
  type: SET_SELECTED_DRILLDOWN_ITEM,
  payload: item,
});

const initialState = {
  currentDashboardState: 'mainExecutive', // Default state
  selectedItem: null,
  selectedDrillDownItem:null,
};

const dashboardReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_DASHBOARD_STATE:
      return { ...state, currentDashboardState: action.payload };
    case SET_SELECTED_ITEM:
      return { ...state, selectedItem: action.payload };
    case SET_SELECTED_DRILLDOWN_ITEM:
         return { ...state, selectedDrillDownItem: action.payload };
    default:
      return state;
  }
};

export default dashboardReducer;
