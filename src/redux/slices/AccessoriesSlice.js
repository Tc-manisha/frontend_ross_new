import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  accessoriesList: [], // This array will store the form data
};

export const accessoriesSlice = createSlice({
  name: 'accessories',
  initialState,
  reducers: {
    addEquipment: (state, action) => {
      state.accessoriesList.push(action.payload);
    },
    
  },
});

export const { addEquipment,updateEquipmentList,addContractEquip } = accessoriesSlice.actions;

export default accessoriesSlice.reducer;
