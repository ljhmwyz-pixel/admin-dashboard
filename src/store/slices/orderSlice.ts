import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/mock';

// 订单状态接口
export interface OrderItem {
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  paymentMethod: string;
  items: OrderItem[];
}

export interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
}

// 初始状态
const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    pageSize: 10,
    total: 0
  }
};

// 异步 thunk
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (params: { page?: number; pageSize?: number }) => {
    const response = await api.orders.list(params);
    return response;
  }
);

// 订单 slice
export const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setCurrentOrder: (state, action) => {
      state.currentOrder = action.payload;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // 获取订单列表
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = (action.payload as any).data;
        state.pagination = {
          page: (action.payload as any).page,
          pageSize: (action.payload as any).pageSize,
          total: (action.payload as any).total
        };
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '获取订单列表失败';
      });
  }
});

// 导出 actions
export const { setCurrentOrder, clearCurrentOrder } = orderSlice.actions;

// 导出 reducer
export default orderSlice.reducer;