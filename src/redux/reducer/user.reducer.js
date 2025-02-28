import Cookies from 'universal-cookie';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import AuthService from 'src/services/Auth.service';

const cookie = new Cookies();

export const checkUserAuth = createAsyncThunk(`userAuthCheck`, async () => {
  const { data } = await AuthService.checkUserAuth();
  return data;
});

const initialState = {
  auth: false,
  loading: true,
  details: null,
};

export const useSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      cookie.remove('connect.sid');
      state.auth = false;
      state.loading = false;
      state.details = null;
    },
    login: (state, action) => {
      state.auth = true;
      state.loading = false;
      state.details = action.payload.data;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(checkUserAuth.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(checkUserAuth.fulfilled, (state, action) => {
      state.auth = true;
      state.loading = false;
      state.details = action.payload;
    });
    builder.addCase(checkUserAuth.rejected, (state) => {
      state.auth = false;
      state.loading = false;
      state.details = null;
    });
  },
});

// Action creators are generated for each case reducer function
export const { logout, login } = useSlice.actions;

export default useSlice.reducer;
