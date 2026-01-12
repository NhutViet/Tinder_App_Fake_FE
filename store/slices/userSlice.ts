import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { API_BASE_URL } from '../constants';
import { RootState } from '../index';

// Types
export interface User {
  _id?: string;
  email?: string;
  name?: string;
  phone?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  interestedIn?: 'ALL' | 'MALE' | 'FEMALE';
  interests?: string[];
  age?: number;
  bio?: string;
  photos?: string[];
  [key: string]: any;
}

export interface UpdateUserDto {
  name?: string;
  phone?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  interestedIn?: 'ALL' | 'MALE' | 'FEMALE';
  age?: number;
  bio?: string;
  photos?: string[];
  [key: string]: any;
}

export interface UpdateInterestsDto {
  interests: string[];
}

interface UserState {
  currentUser: User | null;
  swipeCandidates: User[];
  homeCandidates: User[];
  selectedProfile: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  currentUser: null,
  swipeCandidates: [],
  homeCandidates: [],
  selectedProfile: null,
  loading: false,
  error: null,
};

// Helper function to get auth token
const getAuthToken = (): string | null => {
  // Get token from AsyncStorage or from auth state
  // In a real app, you might want to get it from the auth slice
  return null; // Will be handled by passing token from component
};

// Async Thunks
export const fetchUsersAsync = createAsyncThunk(
  'user/fetchUsers',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue('Không có token xác thực');
      }

      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: 'Không thể lấy danh sách người dùng',
        }));
        return rejectWithValue(errorData.message || 'Không thể lấy danh sách người dùng');
      }

      const users: User[] = await response.json();
      return users;
    } catch (error: any) {
      if (error.message === 'Network request failed' || error.message?.includes('Network')) {
        return rejectWithValue('Không thể kết nối đến server');
      }
      return rejectWithValue(error.message || 'Lỗi kết nối đến server');
    }
  }
);

export const fetchUserByIdAsync = createAsyncThunk(
  'user/fetchUserById',
  async (userId: string, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue('Không có token xác thực');
      }

      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: 'Không thể lấy thông tin người dùng',
        }));
        return rejectWithValue(errorData.message || 'Không thể lấy thông tin người dùng');
      }

      const user: User = await response.json();
      return user;
    } catch (error: any) {
      if (error.message === 'Network request failed' || error.message?.includes('Network')) {
        return rejectWithValue('Không thể kết nối đến server');
      }
      return rejectWithValue(error.message || 'Lỗi kết nối đến server');
    }
  }
);

export const updateUserAsync = createAsyncThunk(
  'user/updateUser',
  async (
    { userId, updateUserDto }: { userId: string; updateUserDto: UpdateUserDto },
    { rejectWithValue, getState }
  ) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue('Không có token xác thực');
      }

      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateUserDto),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: 'Không thể cập nhật thông tin người dùng',
        }));
        return rejectWithValue(errorData.message || 'Không thể cập nhật thông tin người dùng');
      }

      const user: User = await response.json();
      return user;
    } catch (error: any) {
      if (error.message === 'Network request failed' || error.message?.includes('Network')) {
        return rejectWithValue('Không thể kết nối đến server');
      }
      return rejectWithValue(error.message || 'Lỗi kết nối đến server');
    }
  }
);

export const deleteUserAsync = createAsyncThunk(
  'user/deleteUser',
  async (userId: string, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue('Không có token xác thực');
      }

      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: 'Không thể xóa người dùng',
        }));
        return rejectWithValue(errorData.message || 'Không thể xóa người dùng');
      }

      return userId;
    } catch (error: any) {
      if (error.message === 'Network request failed' || error.message?.includes('Network')) {
        return rejectWithValue('Không thể kết nối đến server');
      }
      return rejectWithValue(error.message || 'Lỗi kết nối đến server');
    }
  }
);

export const getUsersForSwipeAsync = createAsyncThunk(
  'user/getUsersForSwipe',
  async (
    { swipedIds, limit }: { swipedIds?: string[]; limit?: number } = {},
    { rejectWithValue, getState }
  ) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue('Không có token xác thực');
      }

      const swipedIdsParam = swipedIds && swipedIds.length > 0 ? swipedIds.join(',') : '';
      const limitParam = limit || 10;
      const queryParams = new URLSearchParams();
      if (swipedIdsParam) queryParams.append('swipedIds', swipedIdsParam);
      queryParams.append('limit', limitParam.toString());

      const response = await fetch(
        `${API_BASE_URL}/users/swipe/candidates?${queryParams.toString()}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: 'Không thể lấy danh sách người dùng để swipe',
        }));
        return rejectWithValue(
          errorData.message || 'Không thể lấy danh sách người dùng để swipe'
        );
      }

      const users: User[] = await response.json();
      return users;
    } catch (error: any) {
      if (error.message === 'Network request failed' || error.message?.includes('Network')) {
        return rejectWithValue('Không thể kết nối đến server');
      }
      return rejectWithValue(error.message || 'Lỗi kết nối đến server');
    }
  }
);

export const getProfileForSwipeAsync = createAsyncThunk(
  'user/getProfileForSwipe',
  async (userId: string, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue('Không có token xác thực');
      }

      const response = await fetch(`${API_BASE_URL}/users/swipe/profile/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: 'Không thể lấy profile người dùng',
        }));
        return rejectWithValue(errorData.message || 'Không thể lấy profile người dùng');
      }

      const user: User = await response.json();
      return user;
    } catch (error: any) {
      if (error.message === 'Network request failed' || error.message?.includes('Network')) {
        return rejectWithValue('Không thể kết nối đến server');
      }
      return rejectWithValue(error.message || 'Lỗi kết nối đến server');
    }
  }
);

export const getUsersForHomeAsync = createAsyncThunk(
  'user/getUsersForHome',
  async (
    { swipedIds, limit }: { swipedIds?: string[]; limit?: number } = {},
    { rejectWithValue, getState }
  ) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue('Không có token xác thực');
      }

      const swipedIdsParam = swipedIds && swipedIds.length > 0 ? swipedIds.join(',') : '';
      const limitParam = limit || 20;
      const queryParams = new URLSearchParams();
      if (swipedIdsParam) queryParams.append('swipedIds', swipedIdsParam);
      queryParams.append('limit', limitParam.toString());

      const response = await fetch(
        `${API_BASE_URL}/users/home/candidates?${queryParams.toString()}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: 'Không thể lấy danh sách người dùng cho trang home',
        }));
        return rejectWithValue(
          errorData.message || 'Không thể lấy danh sách người dùng cho trang home'
        );
      }

      const users: User[] = await response.json();
      return users;
    } catch (error: any) {
      if (error.message === 'Network request failed' || error.message?.includes('Network')) {
        return rejectWithValue('Không thể kết nối đến server');
      }
      return rejectWithValue(error.message || 'Lỗi kết nối đến server');
    }
  }
);

export const updateInterestsAsync = createAsyncThunk(
  'user/updateInterests',
  async (
    { userId, interests }: { userId: string; interests: string[] },
    { rejectWithValue, getState }
  ) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue('Không có token xác thực');
      }

      const response = await fetch(`${API_BASE_URL}/users/${userId}/interests`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ interests }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: 'Không thể cập nhật sở thích',
        }));
        return rejectWithValue(errorData.message || 'Không thể cập nhật sở thích');
      }

      const user: User = await response.json();
      return user;
    } catch (error: any) {
      if (error.message === 'Network request failed' || error.message?.includes('Network')) {
        return rejectWithValue('Không thể kết nối đến server');
      }
      return rejectWithValue(error.message || 'Lỗi kết nối đến server');
    }
  }
);

// Slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSwipeCandidates: (state) => {
      state.swipeCandidates = [];
    },
    clearHomeCandidates: (state) => {
      state.homeCandidates = [];
    },
    clearSelectedProfile: (state) => {
      state.selectedProfile = null;
    },
    setCurrentUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
    },
    removeSwipeCandidate: (state, action: PayloadAction<string>) => {
      state.swipeCandidates = state.swipeCandidates.filter(
        (user) => user._id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    // Fetch Users
    builder
      .addCase(fetchUsersAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsersAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchUsersAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch User By Id
    builder
      .addCase(fetchUserByIdAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserByIdAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
        state.error = null;
      })
      .addCase(fetchUserByIdAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update User
    builder
      .addCase(updateUserAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
        state.error = null;
      })
      .addCase(updateUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete User
    builder
      .addCase(deleteUserAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUserAsync.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentUser?._id === action.payload) {
          state.currentUser = null;
        }
        state.error = null;
      })
      .addCase(deleteUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Get Users For Swipe
    builder
      .addCase(getUsersForSwipeAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUsersForSwipeAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.swipeCandidates = action.payload;
        state.error = null;
      })
      .addCase(getUsersForSwipeAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Get Profile For Swipe
    builder
      .addCase(getProfileForSwipeAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProfileForSwipeAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProfile = action.payload;
        state.error = null;
      })
      .addCase(getProfileForSwipeAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Get Users For Home
    builder
      .addCase(getUsersForHomeAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUsersForHomeAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.homeCandidates = action.payload;
        state.error = null;
      })
      .addCase(getUsersForHomeAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update Interests
    builder
      .addCase(updateInterestsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateInterestsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
        state.error = null;
      })
      .addCase(updateInterestsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
  clearSwipeCandidates,
  clearHomeCandidates,
  clearSelectedProfile,
  setCurrentUser,
  removeSwipeCandidate,
} = userSlice.actions;

export default userSlice.reducer;
