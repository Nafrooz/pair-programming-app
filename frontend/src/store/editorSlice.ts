/**
 * Redux slice for code editor state management
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { CodeEditorState } from '../types';

const initialState: CodeEditorState = {
  code: '# Start coding here...\n',
  language: 'python',
  cursorPosition: 0,
  isConnected: false,
  activeUsers: 0,
};

const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    setCode: (state, action: PayloadAction<string>) => {
      state.code = action.payload;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    setCursorPosition: (state, action: PayloadAction<number>) => {
      state.cursorPosition = action.payload;
    },
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },
    setActiveUsers: (state, action: PayloadAction<number>) => {
      state.activeUsers = action.payload;
    },
    resetEditor: (state) => {
      return { ...initialState };
    },
  },
});

export const {
  setCode,
  setLanguage,
  setCursorPosition,
  setConnected,
  setActiveUsers,
  resetEditor,
} = editorSlice.actions;

export default editorSlice.reducer;
