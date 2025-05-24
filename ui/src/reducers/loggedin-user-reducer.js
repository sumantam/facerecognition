import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import UserService from '../services/user-service';

export const fetchLoggedInUserDetails = createAsyncThunk('fetchLoggedInuserDetails', async (email) => {
  const userDetails = await UserService.getLoggedInUserDetails(email);
  return userDetails;
});

const loginSlice = createSlice({
  name: 'login',
  initialState: {
    loggedinUser: {},
    isLoggedIn: false,
    isLoading: false,
    isError: false
  },
  reducers: {
    setLoginDetails: (state, action) => {
      state.loggedinUser = action.payload;
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.loggedinUser = null;
      state.isLoggedIn = false;
    },
  },
  extraReducers: (builder) => {

    builder.addCase(fetchLoggedInUserDetails.pending, (state, action) => {
      state.isLoading = true;
    });

    builder.addCase(fetchLoggedInUserDetails.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isLoggedIn = true;
      if (action.payload?.data?.[0])
        state.loggedinUser = action.payload.data[0];
      else
        state.loggedinUser = {
          "name": "AYAN Admin",
          "email": "ambitionxcare@gmail.com"
        }
    });

    builder.addCase(fetchLoggedInUserDetails.rejected, (state, action) => {
      state.isLoading = false;
      state.isLoggedIn = false;
      state.isError = false;
    });
  }
});

export const selectLoggedinUser = (state) => state.login.loggedinUser;

export const loggedinUserSelector = createSelector(selectLoggedinUser, state => state);

export const { setLoginDetails, logout } = loginSlice.actions;

export default loginSlice.reducer;
