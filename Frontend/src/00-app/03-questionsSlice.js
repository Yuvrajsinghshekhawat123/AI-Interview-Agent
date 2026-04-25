 import { createSlice } from "@reduxjs/toolkit";

const genratedQuestionsSlice = createSlice({
  name: "generatedQuestions",
  initialState: {
    generatedQuestions: {},
    processed: [], // ✅ id + time
  },

  reducers: {
    setGeneratedQuestions: (state, action) => {
      state.generatedQuestions = action.payload;
    },

    markProcessed: (state, action) => {
      const { id, time } = action.payload;

      const existing = state.processed.find((q) => q.id === id);

      if (existing) {
        // ✅ update time if already exists
        existing.time = time;
      } else {
        state.processed.push({ id, time });
      }
    },
    resetGeneratedQuestions: (state) => {
      state.generatedQuestions = {};
      state.processed = [];
    }

  },

});

export const { setGeneratedQuestions, markProcessed , resetGeneratedQuestions} = genratedQuestionsSlice.actions;
export default genratedQuestionsSlice.reducer;