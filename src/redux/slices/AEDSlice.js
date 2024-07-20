import { createSlice } from '@reduxjs/toolkit'
const initialState =  {
  value: 0,
  selected_model: {},
  permissions: { 
    auto : 0,
    brand_id : 0,
    created_by_id : null,
    created_date : "2023-05-04T19:51:56.000Z",
    discontinued : 0,
    display : 0,
    has_9v : 0,
    has_10pk : 0,
    has_battery : 0,
    has_builtin_rms : 0,
    has_chargepak : 0,
    has_gateway : 0,
    has_installby : 0,
    has_man : 0,
    has_pad : 0,
    has_padpak : 0,
    has_ped_key : 0,
    has_ped_pad : 0,
    has_pedpak : 0,
    id : 0,
    image_file_name : "",
    model_name : "",
    model_partnumber : null,
    modified_by_id : null,
    modified_date : null,
    semi : 0
  },
  AEDLoader: 0,
}
export const AEDSlice = createSlice({
  name: 'aed',
  initialState,
  reducers: {
    increment: state => {
      state.value += 1
    },
    decrement: state => {
      state.value -= 1
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload
    },
    updateAEDModel: (state,action) =>{
      state.selected_model = action.payload
    },
    updatePermission: (state,action) => {
      state.permissions = action.payload
    },
    updateAEDLoading: (state,action) => {
      state.AEDLoader = action.payload
    } 
  }
})

// Action creators are generated for each case reducer function
export const { increment, decrement, incrementByAmount, updateAEDModel, updatePermission,updateAEDLoading } = AEDSlice.actions


export default AEDSlice.reducer