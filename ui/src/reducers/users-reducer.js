import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import userService from "../services/user-service";

export const fetchAllUsers = createAsyncThunk("fetchAllUsers", async () => {
  const users = await userService.getAllUsers();
  console.log("Users fetched in thunk:", users);
  return users;
});

export const updateUser = createAsyncThunk("updateUser", async (user) => {
  const updatedUser = await userService.updateUser(user.email, user);
  return updatedUser;
});
export const deleteUser = createAsyncThunk("deleteUser", async (user) => {
  console.log("delete called");
  const deleteUser = await userService.deleteUser(user.email);
  return user;
});
export const createUser = createAsyncThunk("createUser", async (user) => {
  const createUser = await userService.createUser(user);
  return createUser.data;
});

const usersSlice = createSlice({
  name: "Users",
  initialState: {
    isLoading: false,
    data: [],
    isError: false,
    error: "",
  },
  reducers: {
    resetState: (state, action) => {
      state.data = [];
      resetState.isLoading = false;
      resetState.isError = false;
      resetState.error = "";
    },
    addUser: (state, action) => {
      state.data.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllUsers.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(fetchAllUsers.fulfilled, (state, action) => {
      state.isLoading = false;
      state.data = action.payload.data;
    });
    builder.addCase(fetchAllUsers.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.error = action.error.message;
    });
    builder.addCase(updateUser.fulfilled, (state, action) => {
      let idx = state.data.findIndex((p) => p.email === action.payload.email);
      state.data[idx] = action.payload;
    });
    builder.addCase(updateUser.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateUser.rejected, (state, action) => {
      console.log(action.payload);
    });
    builder.addCase(deleteUser.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(deleteUser.fulfilled, (state, action) => {
      state.data = state.data.filter((p) => p.email !== action.payload.email);
    });
    builder.addCase(deleteUser.rejected, (state, action) => {
      console.log(action.payload);
    });
    builder.addCase(createUser.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(createUser.fulfilled, (state, action) => {
      state.data.push(action.payload);
    });
    builder.addCase(createUser.rejected, (state, action) => {
      console.log(action.payload);
    });
  },
});

export const usersSelector = createSelector(
  (state) => state.users,
  (state) => state
);

export const { resetState, addUser } = usersSlice.actions;

export default usersSlice.reducer;
