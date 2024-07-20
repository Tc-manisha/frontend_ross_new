import { createSlice } from '@reduxjs/toolkit'
const initialState =  {
  loggedIn: 0,
  user_data: {},
  user_permissions: {  },
  AEDLoader: 0,
  switch_users: {
    user_token: "",
    is_user:0
  },
}
export const AuthSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state,action) => {
      state.user_permissions = action.payload;
    },
    addUserPermission: (state,action) => {
      state.user_permissions = action.payload?.[0];
    },
    setUserData: (state,action) => {
      state.user_data = action.payload?.[0];
    },
    setSwtichUser: (state,action)=>{
      let obj = {
        is_user:1,
        user_token: action.payload
      }
      state.switch_users = obj;
    }

  }
})

// Action creators are generated for each case reducer function
export const { setSwtichUser } = AuthSlice.actions


export default AuthSlice.reducer