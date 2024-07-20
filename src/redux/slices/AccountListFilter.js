import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    filterData: {},
    payloadData: {},
};

// Load state from localStorage if it exists, otherwise use initial state
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('reduxState');
    if (serializedState === null) {
      return initialState;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return initialState;
  }
};

// Save state to localStorage
const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('reduxState', serializedState);
  } catch {
    // ignore write errors
  }
};

// Remove state to localStorage
const removeState = () => {
  try {
    localStorage.removeItem('reduxState');
  } catch {
    // ignore write errors
  }
};

// Load initial state from localStorage
const initialStateFromStorage = loadState();

export const FilterDataSlice = createSlice({
    name: 'filterdata',
    initialState: initialStateFromStorage,
    reducers: {
        addFilterData: (state, action) => {
            state.filterData = { ...action.payload };
            saveState(state);
        },
        addPayloadData: (state, action) => {
            state.payloadData = action.payload;
            saveState(state);
        },
        updateFilterData: (state,action)=>{
            state.filterData = action.payload;
            saveState(state);
        },
        removeFilterData: (state, action) => {
            state.filterData = {};
            removeState(state);
        },
        removePayloadData: (state, action) => {
          state.payloadData = {};
          removeState(state);
      },
    }
});

export const { addFilterData, removeFilterData, updateFilterData, addPayloadData, removePayloadData } = FilterDataSlice.actions;

export default FilterDataSlice.reducer;
