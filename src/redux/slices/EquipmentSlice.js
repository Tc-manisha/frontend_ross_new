import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  equipmentList: [], // This array will store the form data
  AssesoriesList: [],
  ContractEquipmentList: [],
  ContractAssesoriesList: [],
  POPCourseList: [],
};

export const equipmentSlice = createSlice({
  name: 'equipment',
  initialState,
  reducers: {
    addEquipment: (state, action) => {
      state.equipmentList.push(action.payload);
    },
    addAssesories: (state, action) => {
      state.AssesoriesList.push(action.payload);
    },
    addCourseData: (state, action) => {
      state.POPCourseList.push(action.payload);
    },
    addContractEquip: (state, action) => {
      state.ContractEquipmentList.push(action.payload);
    },
    addContractAssesories: (state, action) => {
      state.ContractAssesoriesList.push(action.payload);
    },


    updateEquipmentList: (state,action)=>{
      state.equipmentList = action.payload;
    },
    updateContractEquipmentList: (state,action)=>{
      state.ContractEquipmentList = action.payload;
    },
    updateAccessoriesList: (state,action)=>{
      state.AssesoriesList = action.payload;
    },
    updateContractAccessoriesList: (state,action)=>{
      state.ContractAssesoriesList = action.payload;
    },
    updateCourseList: (state,action)=>{
      state.POPCourseList = action.payload;
    },
   



    resetAllPops:(state,action)=>{
      state.POPCourseList = [];
      state.ContractAssesoriesList = [];
      state.ContractEquipmentList = [];
      state.AssesoriesList = [];
      state.equipmentList = [];

     }

  },
});

export const { addEquipment,addAssesories,updateAccessoriesList,updateEquipmentList,updateContractEquipmentList,updateContractAccessoriesList,addContractEquip,addContractAssesories,
  addCourseData,updateCourseList ,resetAllPops
} = equipmentSlice.actions;

export default equipmentSlice.reducer;
