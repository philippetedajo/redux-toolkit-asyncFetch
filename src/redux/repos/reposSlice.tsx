import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import axios from "axios";

interface ReposState {
  loading: boolean;
  error: string | null | unknown;
  data: any;
}

const initialState: ReposState = {
  loading: false,
  error: null,
  data: [],
};

export const getRepos = createAsyncThunk(
  "repos/getRepos",
  async (term: string) => {
    try {
      const { data } = await axios.get(
        "http://registry.npmjs.org/-/v1/search",
        {
          params: {
            text: term,
          },
        }
      );

      return data.objects.map((repo: any) => repo.package);
    } catch (error) {
      return error.message;
    }
  }
);

export const reposSlice = createSlice({
  name: "repos",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getRepos.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.data = [];
    });
    builder.addCase(getRepos.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      state.data = action.payload;
    });
    builder.addCase(getRepos.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.data = [];
    });
  },
});

export const selectRepos = (state: RootState) => state.repos;

export default reposSlice.reducer;
