import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { API_BASE_URL } from '../constants';
import { RootState } from '../index';

// Types matching backend schema
export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export enum InterestedIn {
  MALE = 'male',
  FEMALE = 'female',
  ALL = 'all',
}

export interface User {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  gender: Gender;
  interestedIn: InterestedIn;
  birthDate: string | Date;
  bio?: string;
  photos?: string[];
  interests?: string[];
  location?: {
    lat: number;
    lng: number;
  };
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  password?: string;
  gender?: Gender;
  interestedIn?: InterestedIn;
  birthDate?: string | Date;
  bio?: string;
  photos?: string[];
  interests?: string[];
  location?: {
    lat: number;
    lng: number;
  };
}

export interface UpdateInterestsDto {
  interests: string[];
}

interface UserState {
  currentProfile: User | null;
  swipeCandidates: User[];
  selectedUser: User | null;
  loading: boolean;
  error: string | null;
  hasMoreCandidates: boolean;
}

const initialState: UserState = {
  currentProfile: null,
  swipeCandidates: [],
  selectedUser: null,
  loading: false,
  error: null,
  hasMoreCandidates: true,
};

// Helper function to get auth token from state
const getAuthToken = (state: RootState): string | null => {
  return state.auth.token;
};

// Async Thunks
export const getUsersForSwipeAsync = createAsyncThunk(
  'user/getUsersForSwipe',
  async (
    params: { swipedIds?: string[]; limit?: number },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState;
      const token = getAuthToken(state);

      if (!token) {
        return rejectWithValue('Không có token xác thực');
      }

      const queryParams = new URLSearchParams();
      if (params.swipedIds && params.swipedIds.length > 0) {
        queryParams.append('swipedIds', params.swipedIds.join(','));
      }
      if (params.limit) {
        queryParams.append('limit', params.limit.toString());
      }

      const url = `${API_BASE_URL}/users/swipe/candidates${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

      const response = await fetch(url, {
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

export const getProfileForSwipeAsync = createAsyncThunk(
  'user/getProfileForSwipe',
  async (userId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = getAuthToken(state);

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

export const getUserByIdAsync = createAsyncThunk(
  'user/getUserById',
  async (userId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = getAuthToken(state);

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
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState;
      const token = getAuthToken(state);

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

export const updateInterestsAsync = createAsyncThunk(
  'user/updateInterests',
  async (
    { userId, interests }: { userId: string; interests: string[] },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState;
      const token = getAuthToken(state);

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
      state.hasMoreCandidates = true;
    },
    removeSwipeCandidate: (state, action: PayloadAction<string>) => {
      state.swipeCandidates = state.swipeCandidates.filter(
        (user) => user._id !== action.payload
      );
    },
    setSelectedUser: (state, action: PayloadAction<User | null>) => {
      state.selectedUser = action.payload;
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
  },
  extraReducers: (builder) => {
    // Get Users For Swipe
    builder
      .addCase(getUsersForSwipeAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUsersForSwipeAsync.fulfilled, (state, action) => {
        state.loading = false;
        // Append new candidates to existing ones
        const newCandidates = action.payload;
        const existingIds = new Set(state.swipeCandidates.map((u) => u._id));
        const uniqueNewCandidates = newCandidates.filter(
          (u) => u._id && !existingIds.has(u._id)
        );
        state.swipeCandidates = [...state.swipeCandidates, ...uniqueNewCandidates];
        state.hasMoreCandidates = newCandidates.length > 0;
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
        state.selectedUser = action.payload;
        state.error = null;
      })
      .addCase(getProfileForSwipeAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Get User By Id
    builder
      .addCase(getUserByIdAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserByIdAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload;
        state.error = null;
      })
      .addCase(getUserByIdAsync.rejected, (state, action) => {
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
        state.currentProfile = action.payload;
        // Update selected user if it's the same user
        if (state.selectedUser?._id === action.payload._id) {
          state.selectedUser = action.payload;
        }
        state.error = null;
      })
      .addCase(updateUserAsync.rejected, (state, action) => {
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
        state.currentProfile = action.payload;
        // Update selected user if it's the same user
        if (state.selectedUser?._id === action.payload._id) {
          state.selectedUser = action.payload;
        }
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
  removeSwipeCandidate,
  setSelectedUser,
  clearSelectedUser,
} = userSlice.actions;

export default userSlice.reducer;
