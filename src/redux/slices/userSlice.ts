// store/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/lib/types';
import { ENUM_ROLE } from '@/lib/types/enums';

interface UserState {
  user:any;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading(state) {
      state.loading = true;
      state.error = null;
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
    },
    setViewAs(state, action: PayloadAction<ENUM_ROLE | null>) {
      if (state.user && state.user.role === ENUM_ROLE.SUPERADMIN) {
        state.user.view_as = action.payload || state.user.role;
        state.user.schoolId = action.payload || state.user.schoolId;
        state.user.schoolSlug = action.payload || state.user.schoolSlug;
      }
    },
    setAuthenticated(state, action: PayloadAction<boolean>) {
      state.isAuthenticated = action.payload;
    },
  },
});

export const { setUser, setLoading, setError, setAuthenticated } = userSlice.actions;
export default userSlice.reducer;