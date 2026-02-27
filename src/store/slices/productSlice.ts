import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/mock';

// 商品状态接口
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  status: 'active' | 'inactive' | 'out_of_stock';
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  rating: number;
  salesCount: number;
}

export interface ProductState {
  products: Product[];
  currentProduct: Product | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
}

// 初始状态
const initialState: ProductState = {
  products: [],
  currentProduct: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    pageSize: 10,
    total: 0
  }
};

// 异步 thunk
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params: { page?: number; pageSize?: number }) => {
    const response = await api.products.list(params);
    return response;
  }
);

// 商品 slice
export const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setCurrentProduct: (state, action) => {
      state.currentProduct = action.payload;
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // 获取商品列表
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.data;
        state.pagination = {
          page: action.payload.page,
          pageSize: action.payload.pageSize,
          total: action.payload.total
        };
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '获取商品列表失败';
      });
  }
});

// 导出 actions
export const { setCurrentProduct, clearCurrentProduct } = productSlice.actions;

// 导出 reducer
export default productSlice.reducer;