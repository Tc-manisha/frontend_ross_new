import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    inventoryList: {},
    addedList: [],
}

export const ModificationSlice = createSlice({
    name: 'modification',
    initialState,
    reducers: {
        addBatteryInventoryData: (state, action) => {
            state.inventoryList = { ...action.payload };
        },
        addPadInventoryData: (state, action) => {
            state.inventoryList = { ...action.payload };
        },
        removeBatteryInventoryData: (state, action) => {
            state.inventoryList = {};
        },
        removePadInventoryData: (state, action) => {
            state.inventoryList = {};
        },
    }
});

export const { addBatteryInventoryData, addPadInventoryData, removeBatteryInventoryData, removePadInventoryData } = ModificationSlice.actions;

export default ModificationSlice.reducer;