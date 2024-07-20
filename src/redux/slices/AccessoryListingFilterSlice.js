import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    accessoryListingFilterData: {},
    accessoryListingPayloadData: {},
};

// Load state from localStorage if it exists, otherwise use initial state
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('reduxAccessoryListingState');
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
    localStorage.setItem('reduxAccessoryListingState', serializedState);
  } catch {
    // ignore write errors
  }
};

// Remove state to localStorage
const removeState = () => {
    try {
      localStorage.removeItem('reduxAccessoryListingState');
    } catch {
      // ignore write errors
    }
  };

// Load initial state from localStorage
const initialStateFromStorage = loadState();

export const AccessoryListingFilterDataSlice = createSlice({
    name: 'accessorylistingfilterdata',
    initialState: initialStateFromStorage,
    reducers: {
        addFilterData: (state, action) => {
            state.accessoryListingFilterData = { ...action.payload };
            saveState(state);
        },
        addPayloadData: (state, action) => {
            state.accessoryListingPayloadData = action.payload;
            saveState(state);
        },
        updateFilterData: (state, action) => {
            state.accessoryListingFilterData = action.payload;
            saveState(state);
        },
        removeFilterData: (state, action) => {
            state.accessoryListingFilterData = {};
            removeState(state);
        },
        removePayloadData: (state, action) => {
            state.accessoryListingPayloadData = {};
            removeState(state);
        },
    }
});

export const { addFilterData, removeFilterData, updateFilterData, addPayloadData, removePayloadData } = AccessoryListingFilterDataSlice.actions;

export default AccessoryListingFilterDataSlice.reducer;
