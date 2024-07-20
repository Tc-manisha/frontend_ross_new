import { createSlice } from '@reduxjs/toolkit';
import { GetProfile } from '../../helper/Common';

let userData = GetProfile();// JSON.parse(localStorage.getItem("ross-profile"));
let account_id = userData?.account_id;

// Initial state
const initialState = {
  items: [{ title: 'Account', path: '/path' + account_id, tab: "" , back: "0"}]
};

// Function to replace integers with ':id'
const replaceIntegersWithId = (path) => {
  return path.replace(/\/\d+/g, '/:id');
};
  
// Create slice
const breadCrumbsSlice = createSlice({
  name: 'breadCrumbs',
  initialState,
  reducers: {
    addItem: (state, action) => {
      // Replace integers with ':id'
      const modifiedPath = replaceIntegersWithId(action.payload.path);
      
      // Check if the modified path already exists in items
      const existingPathIndex = state.items.findIndex(item => replaceIntegersWithId(item.path) === modifiedPath);
      
      if (existingPathIndex === -1) {
        console.log("Hii1")
        // If modified path doesn't exist, add it to items
        state.items.push({ title: action.payload.title, path: action.payload.path, tab: action.payload.tab });
      } 
      // else {
      //   console.log("Hii2")
      //   // If modified path exists, update the tab value
      //   state.items[existingPathIndex].tab = action.payload.tab;
      // }
    },
    removeLastItem: (state) => {
      // Remove the last item from the items array
      state.items.pop();
    },

    clickOnTitle: (state, action) => {
      state.items = action.payload;
    },
    updateTab: (state, action) => {
      const { index, tab } = action.payload;
      if (state.items[index]) {
        state.items[index].tab = tab;
      }
    }
  }
});

// Export actions and reducer
export const { addItem, removeLastItem, clickOnTitle, updateTab } = breadCrumbsSlice.actions;
export default breadCrumbsSlice.reducer;
