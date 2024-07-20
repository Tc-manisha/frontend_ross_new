import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    equipmentFilterData: {},
    equipmentPayloadData: {},
};

// Load state from localStorage if it exists, otherwise use initial state
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('reduxEquipmentState');
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
    console.log({myStateDate: serializedState})
    localStorage.setItem('reduxEquipmentState', serializedState);
  } catch {
    // ignore write errors
  }
};

// Remove state to localStorage
const removeState = () => {
    try {
      localStorage.removeItem('reduxEquipmentState');
    } catch {
      // ignore write errors
    }
  };

// Load initial state from localStorage
const initialStateFromStorage = loadState();

export const EquipmentFilterDataSlice = createSlice({
    name: 'equipmentfilterdata',
    initialState: initialStateFromStorage,
    reducers: {
        addFilterData: (state, action) => {
            state.equipmentFilterData = { ...action.payload };
            saveState(state);
        },
        addPayloadData: (state, action) => {
            state.equipmentPayloadData = action.payload;
            saveState(state);
        },
        updateFilterData: (state, action) => {
            state.equipmentFilterData = action.payload;
            saveState(state);
        },
        removeFilterData: (state, action) => {
            state.equipmentFilterData = {};
            removeState(state);
        },
        removePayloadData: (state, action) => {
            state.equipmentPayloadData = {};
            removeState(state);
        },
    }
});

export const { addFilterData, removeFilterData, updateFilterData, addPayloadData, removePayloadData } = EquipmentFilterDataSlice.actions;

export default EquipmentFilterDataSlice.reducer;
