import { createSlice } from '@reduxjs/toolkit';
const initialState =  {
    selectedTab: '',
    siteActiveTab:'Details',
    contactActiveTab: "Details",
    inpersonActiveTab: "Details",
}


export const TabSlice = createSlice({
    name: 'tab',
    initialState,
    reducers:{
        selecteTab: (state,action)=>{
            state.selectedTab = action.payload;
        },
        setSiteActiveTab: (state,action)=>{
            state.siteActiveTab = action.payload;
        },
        setContactActiveTab: (state,action)=>{
            state.contactActiveTab = action.payload;
        },

        setInpersonActiveTab: (state,action)=>{
            state.inpersonActiveTab = action.payload;
        },

        setPopActiveTab: (state,action)=>{
            state.popActiveTab = action.payload;
        },

    }
});

export const { selecteTab,setSiteActiveTab,setContactActiveTab,setInpersonActiveTab, setPopActiveTab } = TabSlice.actions;

export default TabSlice.reducer;