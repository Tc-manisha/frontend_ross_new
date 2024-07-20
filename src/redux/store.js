import { configureStore } from '@reduxjs/toolkit'
import AEDReducer from './slices/AEDSlice';
import TabReducer from './slices/TabSlice';
import { equipmentSlice } from './slices/EquipmentSlice';
import { accessoriesSlice } from './slices/AccessoriesSlice';
import {ModificationSlice} from './slices/ModificationSlice'
import {FilterDataSlice} from './slices/AccountListFilter'
import {EquipmentFilterDataSlice} from './slices/AccountDetailsEquipmentFilter'
import {EquipmentListingFilterDataSlice} from './slices/EquipmentListingFilterSlice'
import {AccessoryListingFilterDataSlice} from './slices/AccessoryListingFilterSlice'
import StdlnAEDReducer from './slices/StandloneAEDSlice';
import breadCrumbsSlice from './slices/BreadCrumbsSlice';
export const store = configureStore({
  reducer: {
    AED_manager: AEDReducer,
    TAB_manager: TabReducer,
    equipment: equipmentSlice.reducer,
    accessories: accessoriesSlice.reducer,
    modification: ModificationSlice.reducer,
    StdlnAED_manager:StdlnAEDReducer,
    accountlistfilter: FilterDataSlice.reducer,
    accountdetailsequipmentfilter: EquipmentFilterDataSlice.reducer,
    equipmentlistingfilter: EquipmentListingFilterDataSlice.reducer,
    accessorylistingfilter: AccessoryListingFilterDataSlice.reducer,
    BreadCrumbs: breadCrumbsSlice,
  },
})