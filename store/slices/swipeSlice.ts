import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { API_BASE_URL } from '../constants';
import { RootState } from '../index';

// Types
export enum SwipeType {
  LIKE = 'like',
  DISLIKE = 'dislike',
}

export interface Swipe {
  _id?: string;
  fromUserId: string;
  toUserId: string;
  type: SwipeType;
  createdAt?: string;
}

export interface CreateSwipeDto {
  toUserId: string;
  type: SwipeType;
}

export interface SwipeStats {
  likes: number;
  dislikes: number;
  total: number;
}

interface SwipeState {
  swipedUserIds: string[];
  swipeStats: SwipeStats | null;
  loading: boolean;
  error: string | null;
}

const initialState: SwipeState = {
  swipedUserIds: [],
  swipeStats: null,
  loading: false,
  error: null,
};

// Async Thunks
export const createSwipeAsync = createAsyncThunk(
  'swipe/createSwipe',
  async (createSwipeDto: CreateSwipeDto, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue('Không có token xác thực');
      }

      const response = await fetch(`${API_BASE_URL}/swipes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(createSwipeDto),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: 'Không thể tạo swipe',
        }));
        return rejectWithValue(errorData.message || 'Không thể tạo swipe');
      }

      const swipe: Swipe = await response.json();
      return swipe;
    } catch (error: any) {
      if (error.message === 'Network request failed' || error.message?.includes('Network')) {
        return rejectWithValue('Không thể kết nối đến server');
      }
      return rejectWithValue(error.message || 'Lỗi kết nối đến server');
    }
  }
);

export const hasSwipedAsync = createAsyncThunk(
  'swipe/hasSwiped',
  async (toUserId: string, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue('Không có token xác thực');
      }

      const response = await fetch(`${API_BASE_URL}/swipes/check/${toUserId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: 'Không thể kiểm tra swipe',
        }));
        return rejectWithValue(errorData.message || 'Không thể kiểm tra swipe');
      }

      const data: { hasSwiped: boolean } = await response.json();
      return data.hasSwiped;
    } catch (error: any) {
      if (error.message === 'Network request failed' || error.message?.includes('Network')) {
        return rejectWithValue('Không thể kết nối đến server');
      }
      return rejectWithValue(error.message || 'Lỗi kết nối đến server');
    }
  }
);

export const hasLikedMeAsync = createAsyncThunk(
  'swipe/hasLikedMe',
  async (toUserId: string, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue('Không có token xác thực');
      }

      const response = await fetch(`${API_BASE_URL}/swipes/liked/${toUserId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: 'Không thể kiểm tra like',
        }));
        return rejectWithValue(errorData.message || 'Không thể kiểm tra like');
      }

      const data: { hasLiked: boolean } = await response.json();
      return data.hasLiked;
    } catch (error: any) {
      if (error.message === 'Network request failed' || error.message?.includes('Network')) {
        return rejectWithValue('Không thể kết nối đến server');
      }
      return rejectWithValue(error.message || 'Lỗi kết nối đến server');
    }
  }
);

export const getSwipedUsersAsync = createAsyncThunk(
  'swipe/getSwipedUsers',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue('Không có token xác thực');
      }

      const response = await fetch(`${API_BASE_URL}/swipes/swiped`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: 'Không thể lấy danh sách user đã swipe',
        }));
        return rejectWithValue(
          errorData.message || 'Không thể lấy danh sách user đã swipe'
        );
      }

      const data: { swipedUserIds: string[] } = await response.json();
      return data.swipedUserIds;
    } catch (error: any) {
      if (error.message === 'Network request failed' || error.message?.includes('Network')) {
        return rejectWithValue('Không thể kết nối đến server');
      }
      return rejectWithValue(error.message || 'Lỗi kết nối đến server');
    }
  }
);

export const getSwipeStatsAsync = createAsyncThunk(
  'swipe/getSwipeStats',
  async ({ date }: { date?: string }, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue('Không có token xác thực');
      }

      const queryParams = date ? `?date=${date}` : '';
      const response = await fetch(`${API_BASE_URL}/swipes/stats${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: 'Không thể lấy thống kê swipe',
        }));
        return rejectWithValue(errorData.message || 'Không thể lấy thống kê swipe');
      }

      const stats: SwipeStats = await response.json();
      return stats;
    } catch (error: any) {
      if (error.message === 'Network request failed' || error.message?.includes('Network')) {
        return rejectWithValue('Không thể kết nối đến server');
      }
      return rejectWithValue(error.message || 'Lỗi kết nối đến server');
    }
  }
);

// Slice
const swipeSlice = createSlice({
  name: 'swipe',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    addSwipedUserId: (state, action: PayloadAction<string>) => {
      if (!state.swipedUserIds.includes(action.payload)) {
        state.swipedUserIds.push(action.payload);
      }
    },
    clearSwipedUserIds: (state) => {
      state.swipedUserIds = [];
    },
    clearSwipeStats: (state) => {
      state.swipeStats = null;
    },
  },
  extraReducers: (builder) => {
    // Create Swipe
    builder
      .addCase(createSwipeAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSwipeAsync.fulfilled, (state, action) => {
        state.loading = false;
        // Thêm toUserId vào danh sách đã swipe
        if (!state.swipedUserIds.includes(action.payload.toUserId)) {
          state.swipedUserIds.push(action.payload.toUserId);
        }
        state.error = null;
      })
      .addCase(createSwipeAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Has Swiped
    builder
      .addCase(hasSwipedAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(hasSwipedAsync.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(hasSwipedAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Has Liked Me
    builder
      .addCase(hasLikedMeAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(hasLikedMeAsync.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(hasLikedMeAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Get Swiped Users
    builder
      .addCase(getSwipedUsersAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSwipedUsersAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.swipedUserIds = action.payload;
        state.error = null;
      })
      .addCase(getSwipedUsersAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Get Swipe Stats
    builder
      .addCase(getSwipeStatsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSwipeStatsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.swipeStats = action.payload;
        state.error = null;
      })
      .addCase(getSwipeStatsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
  addSwipedUserId,
  clearSwipedUserIds,
  clearSwipeStats,
} = swipeSlice.actions;

export default swipeSlice.reducer;
