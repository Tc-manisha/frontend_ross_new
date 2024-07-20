import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    equipmentListingFilterData: {},
    equipmentListingPayloadData: {},
};

// Load state from localStorage if it exists, otherwise use initial state
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('reduxEquipmentListingState');
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
    localStorage.setItem('reduxEquipmentListingState', serializedState);
  } catch {
    // ignore write errors
  }
};

// Remove state to localStorage
const removeState = () => {
    try {
      localStorage.removeItem('reduxEquipmentListingState');
    } catch {
      // ignore write errors
    }
  };

// Load initial state from localStorage
const initialStateFromStorage = loadState();

export const EquipmentListingFilterDataSlice = createSlice({
    name: 'equipmentlistingfilterdata',
    initialState: initialStateFromStorage,
    reducers: {
        addFilterData: (state, action) => {
            state.equipmentListingFilterData = { ...action.payload };
            saveState(state);
        },
        addPayloadData: (state, action) => {
            state.equipmentListingPayloadData = action.payload;
            saveState(state);
        },
        updateFilterData: (state, action) => {
            state.equipmentListingFilterData = action.payload;
            saveState(state);
        },
        removeFilterData: (state, action) => {
            state.equipmentListingFilterData = {};
            removeState(state);
        },
        removePayloadData: (state, action) => {
            state.equipmentListingPayloadData = {};
            removeState(state);
        },
    }
});

export const { addFilterData, removeFilterData, updateFilterData, addPayloadData, removePayloadData } = EquipmentListingFilterDataSlice.actions;

export default EquipmentListingFilterDataSlice.reducer;
