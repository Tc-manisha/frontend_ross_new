import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { addContractEquip, addEquipment } from '../../../redux/slices/EquipmentSlice';
import Modal from 'react-bootstrap/Modal';
import {
  Box,
  FormControlLabel,
  Switch,
} from "@mui/material";
import {
  Form,
  Button as BButton,
  Button as BsButton,
  InputGroup,
} from "react-bootstrap";
import select from 'react-select'
import SubHeadingOther from "../../../components/header/SubHeadingOther";
import CustomToggleButton from '../../../components/common/toggleSwitch/CustomToggleButton';
import { GetAedBrands, GetAedModelsByBrandId } from '../../../helper/BasicFn';
import { updatePermission } from '../../../redux/slices/AEDSlice';
import { CallGETAPI, CallGETAPI2, CallPOSTAPI } from '../../../helper/API';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { addEquipment, addContractEquip ,updateEquipmentList,updateContractEquipmentList} from '../../../redux/slices/EquipmentSlice';

const PopEquipment = ({equipmentModal,setEquipmentModal,accountId,type,edit,EditPurchaseId,EditContractPurchaseId}) => {
  console.log({type});
  const handleClose = () => setEquipmentModal(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedBrandId, setSelectedBrandId] = useState('');
  const [selectedModelId, setSelectedModelId] = useState('');
  const [parts, setParts] = useState([]);  
  const [selectedStorageBrandId, setSelectedStorageBrandId] = useState('');
  const [adultPad, setAdultPad] = useState([]);
  const [storageBrands, setStorageBrands] = useState([]);
  const [storageModels, setStorageModels] = useState([]);
  const [selectedStorageModelId, setSelectedStorageModelId] = useState('');
  const [storageParts, setStorageParts] = useState([]);
  const [batteryParts, setBatteryParts] = useState([]);
  const [validated, setValidated] = useState(false);
  const [readyKitBrand, setReadyKitBrand] = useState([]);
  const [selectedReadyKitBrandId, setSelectedReadyKitBrandId] = useState("")
  const [readyKitModel, setReadyKitModel] = useState([]);
  const [selectedReadyKitModelId, setSelectedReadyKitModelId] = useState("");
  const [wallSignBrand, setWallSignBrand] = useState([]);
  const [selectedWallSignBrandId, setSelectedWallSignBrandId] = useState("");
  const [wallSignModel, setWallSignModel]  = useState([]);
  const [selectedWallSignModelId, setSelectedWallSignModelId] = useState("");
  const [editData, setEditData] = useState("")
  const equipmentList = useSelector((state) => state.equipment.equipmentList)
  const ContractEquipmentList = useSelector((state) => state.equipment.ContractEquipmentList)
  
  const [formData, setFormData] = useState({
    EquipmentType: '', 
    Brand: '',
    Model: '',
    Part: '',
    Quantity: '',
    Price: '',
    PurchaseType: '',  
    Condition: '',
    CLINs: '',
    AdultPad: '',
    SpareAdultPad: '',
    PedPad: '',
    SparePedPad: '',
    BatteryPart: '',  
    SpareBatteryPart: false,
    StorageType: '',  
    StorageBrand: '',
    StorageModel: '',
    StoragePart: '',

    adult_spare: 0,
    have_pad: 0,
    have_storage: 0,
    have_battery: 0,
    ready_kit: 0, 
    wall_sign: 0,
    battery_spare: 0,
    ped_spare:0,


    have_ready_kit: 0,
    have_wall_sign: 0,
    ready_kit_toggle: 0,

  });
   console.log(EditPurchaseId)

  const fetchLoad = async () => {
    if(edit == ""){
    let result = await CallGETAPI('account/get-equipment-by-id/'+accountId);
    console.log(result);
  }

    console.log(edit)
    if(edit && type == 1){
      const res = await CallGETAPI('account/get-equipment-by-id/' +EditPurchaseId.equipment_id)
      const editDataresponse = res?.data.data.accessoriesData;
      setEditData(editDataresponse);
      // setBrandEditId(editDataresponse.brand)
    }
    if(edit && type == 2){
      const res = await CallGETAPI('account/get-equipment-by-id/' +EditContractPurchaseId.equipment_id)
      const editDataresponse = res?.data.data.accessoriesData;
      setEditData(editDataresponse);
      // setBrandEditId(editDataresponse.brand)
    }
  }
  

  useEffect(() => {
    fetchLoad();
  },[edit])
  const [loading,setLoading] = useState(false);
  const callSaveEquipmentAPI = async () => {
    setLoading(true);

      // Extract and concatenate the "Storage Part #" values into a single string
  const storagePartNumbers = storageParts
  .map((storagePart) => storagePart.model_partnumber)
  .join(', '); // Use a delimiter of your choice

   const selectedReadyKitModels = readyKitModel.filter((item) =>
  selectedReadyKitModelId.includes(item.id)
);
// Extract and concatenate the model part numbers into a single string
const readyKitPartNumbers = selectedReadyKitModels
  .map((model) => model.model_partnumber)
  .join(', '); // Use a delimiter of your choice

const selectedWallSignModels = wallSignModel.filter((item) =>
 selectedWallSignModelId.includes(item.id)
);
// Extract and concatenate the model part numbers into a single string
const wallSignPartNumbers = selectedWallSignModels
 .map((model) => model.model_partnumber)
 .join(', ');

    const equipmentpayload = {
      "equipment_type": formData.EquipmentType,
      "equipment_purchase_type":type,
      "brand": selectedBrandId,
      "model": selectedModelId,
      "part": formData.Part,
      "quantity": formData.Quantity,
      "price": formData.Price,
      "purchase_type": formData.PurchaseType,
      "condition": formData.Condition,
      "clins": formData.CLINs ?? "", 
      "adult_pad": formData.AdultPad,
      "adult_spare_toggle": formData?.adult_spare,
      "spare_adult_pad": formData.SpareAdultPad ?? "",
      "have_ped_toggle": formData?.have_pad,
      "ped_pad": formData.PedPad,
      "ped_spare_toggle": formData?.ped_spare,
      "spare_ped_pad": formData.SparePedPad,
      "battery_part": formData.BatteryPart ?? "",
      "battery_spare_toggle": formData?.battery_spare,
      "spare_battery_part": formData.SpareBatteryPart ?? "",
      "ready_kit_toggle": formData?.ready_kit,
      "have_storage_toggle": formData?.have_storage,
      "storage_brand": selectedStorageBrandId,
      "storage_model":selectedStorageModelId,
      "storage_part": storagePartNumbers ?? "",
      "wall_sign_toggle": formData?.wall_sign,
      "wall_sign_brand": selectedWallSignBrandId,
        "wall_sign_model": selectedWallSignModelId ?? "",
        "wall_sign_part": wallSignPartNumbers?? "",
        "ready_kit_brand": selectedReadyKitBrandId,
        "ready_kit_model": selectedReadyKitModelId,
        "ready_kit_part": readyKitPartNumbers?? ""
    }
    
    let result = await CallPOSTAPI('account/save-equipment',equipmentpayload)
    if(result.data.status){
     toast.success('Equipment Saved Successfully')
      const resultData = result.data.data;
      const eqp = resultData?.equipment;
      const setObj = {
        ...eqp,
        brandName: resultData?.brandName,
        modelName: resultData?.modelName,
        storageBrand: resultData?.storageBrand,
        storageModels: resultData?.storageModels,
      }
     if(parseInt(type)===1){  
        dispatch(addEquipment(setObj));
      }else{
        dispatch(addContractEquip(setObj));
      }
      handleClose();
    }else{
      toast.error(result.data.msg);
    }
    
    setLoading(false);
  }

// console.log(parseInt(type))
  const callUpdateEquipmentAPI = async () => {
    setLoading(true);

      // Extract and concatenate the "Storage Part #" values into a single string
  const storagePartNumbers = storageParts
  .map((storagePart) => storagePart.model_partnumber)
  .join(', '); // Use a delimiter of your choice

   const selectedReadyKitModels = readyKitModel.filter((item) =>
  selectedReadyKitModelId.includes(item.id)
);
// Extract and concatenate the model part numbers into a single string
const readyKitPartNumbers = selectedReadyKitModels
  .map((model) => model.model_partnumber)
  .join(', '); // Use a delimiter of your choice

const selectedWallSignModels = wallSignModel.filter((item) =>
 selectedWallSignModelId.includes(item.id)
);
// Extract and concatenate the model part numbers into a single string
const wallSignPartNumbers = selectedWallSignModels
 .map((model) => model.model_partnumber)
 .join(', ');

    const equipmentpayload = {
      "equipment_id": type == 1 ? EditPurchaseId.equipment_id : EditContractPurchaseId.equipment_id,
      "equipment_type": formData.EquipmentType,
      "equipment_purchase_type":type,
      "brand": selectedBrandId,
      "model": selectedModelId,
      "part": formData.Part,
      "quantity": formData.Quantity,
      "price": formData.Price,
      "purchase_type": formData.PurchaseType,
      "condition": formData.Condition,
      "clins": formData.CLINs ?? "", 
      "adult_pad": formData.AdultPad,
      "adult_spare_toggle": formData?.adult_spare,
      "spare_adult_pad": formData.SpareAdultPad ?? "",
      "have_ped_toggle": formData?.have_pad,
      "ped_pad": formData.PedPad,
      "ped_spare_toggle": formData?.ped_spare,
      "spare_ped_pad": formData.SparePedPad,
      "battery_part": formData.BatteryPart ?? "",
      "battery_spare_toggle": formData?.battery_spare,
      "spare_battery_part": formData.SpareBatteryPart ?? "",
      "ready_kit_toggle": formData?.ready_kit,
      "have_storage_toggle": formData?.have_storage,
      "storage_brand": selectedStorageBrandId,
      "storage_model":selectedStorageModelId,
      "storage_part": storagePartNumbers ?? "",
      "wall_sign_toggle": formData?.wall_sign,
      "wall_sign_brand": selectedWallSignBrandId,
        "wall_sign_model": selectedWallSignModelId ?? "",
        "wall_sign_part": wallSignPartNumbers?? "",
        "ready_kit_brand": selectedReadyKitBrandId,
        "ready_kit_model": selectedReadyKitModelId,
        "ready_kit_part": readyKitPartNumbers?? ""
    }
    
    let result = await CallPOSTAPI('account/update-equipment',equipmentpayload)
    if(result.data.status){
      toast.success('Equipment Update Successfully')
      const resultData = result.data.data;
      const eqp = resultData?.equipment;
      const obj = {
        ...eqp,
        brandName: resultData?.brandName,
        modelName: resultData?.modelName,
        storageBrand: resultData?.storageBrand,
        storageModels: resultData?.storageModels,
      }
      if(parseInt(type)===1){   
        console.log(parseInt(equipmentpayload?.equipment_id ))
        const finfIndex = equipmentList.findIndex(it=>parseInt(it.equipment_id)===parseInt(equipmentpayload?.equipment_id ))
        console.log({finfIndex})
        const arr = [...equipmentList];
        if(finfIndex !=-1){
          arr[finfIndex] = obj
          console.log({arr})
          console.log("UpdateEquipment")
          dispatch(updateEquipmentList(arr));              
     
      }}else{
        const finfIndex = ContractEquipmentList.findIndex(it=>parseInt(it.equipment_id)===parseInt(equipmentpayload?.equipment_id ))
        console.log({finfIndex})
        const arr = [...ContractEquipmentList];
        if(finfIndex !=-1){
          arr[finfIndex] = obj
          console.log({arr})
          console.log("UpdateContractEquipment")
        dispatch(updateContractEquipmentList(arr));
      }}
      handleClose();
    }else{
      toast.error(result.data.msg);
    }
    handleClose();
    setLoading(false);
  }


  const fetchEditDetails = async (BrandId)=>{
    let ModelRes    =  await GetAedModelsByBrandId(BrandId);
    let modelResult = ModelRes?.data || [];
    setModels(modelResult);
          }

            // Handle changes in the StorageBrand dropdown
    const editStorageBrandChange = async (storageBrandId) => {
      setSelectedStorageBrandId(storageBrandId);
  
      if (storageBrandId) {
        await CallGETAPI(`account/storage-model-by-brands/${storageBrandId}`)
          .then((result) => {
            setStorageModels(result?.data?.data || []);
            console.log(result?.data?.data || []);
          })
          .catch((error) => {
            console.error('Error fetching storage models:', error);
          });
      } else {
        setStorageModels([]);
      }
    };

        // Handle changes in the StorageModel dropdown
  const editStorageModelChange =  async (storageModelId) => {
    setSelectedStorageModelId(storageModelId);

    if (storageModelId) {
      // Fetch StorageParts based on the selected StorageModel
      await CallGETAPI(`account/storage-part-by-model/${storageModelId}`)
        .then((result) => {
          setStorageParts(result?.data?.data || []);
          console.log(result?.data?.data || []);
        })
        .catch((error) => {
          console.error('Error fetching storage parts:', error);
        });
    } else {
      setStorageParts([]);
    }
  };

   // Handle Ready Kit Brand DropDown
   const editReadyKitBrandChange = async (selectedReadyKitBrandId) => {
     setSelectedReadyKitBrandId(selectedReadyKitBrandId);
  
    if(selectedReadyKitBrandId){
      await CallGETAPI(`account/readykit-model-by-brand/${selectedReadyKitBrandId}`)
      .then((result) => {
        setReadyKitModel(result?.data?.data || []);
        console.log(result?.data?.data || []);
      })
      .catch((error) => {
        console.error('Error fetching storage models:', error);
      });
    } }

    const editReadyKitModelChange =  async (ReadyKitModelId) => {
      setSelectedReadyKitModelId(ReadyKitModelId);
    };

    // Handle Ready Kit Brand DropDown
    const editWallSignBrandChange = async (selectWallSignBrandId) => {
      setSelectedWallSignBrandId(selectWallSignBrandId);
  
      if(selectWallSignBrandId){
        await CallGETAPI(`account/wallsign-model-by-brand/${selectWallSignBrandId}`)
        .then((result) => {
          setWallSignModel(result?.data?.data || []);
          console.log(result?.data?.data || []);
        })
        .catch((error) => {
          console.error('Error fetching storage models:', error);
        });
      }}

  useEffect(()=>{
    // EditAccessoriesId
    if(EditPurchaseId && edit && type ==1){
      console.log({EditPurchaseId})
      
    const FD  = {...formData};
      FD.EquipmentType = EditPurchaseId?.equipment_type;
      FD.Brand= EditPurchaseId?.brand;
      FD.Model= EditPurchaseId?.model;
      FD.Part= EditPurchaseId?.part;
      FD.Quantity= EditPurchaseId?.quantity;
      FD.Price= EditPurchaseId?.price;
      FD.PurchaseType= EditPurchaseId?.purchase_type;
      FD.Condition= EditPurchaseId?.condition;
      FD.CLINs = EditPurchaseId?.clins === 0 ? "" : EditPurchaseId?.clins;
      FD.BatteryPart= EditPurchaseId?.battery_part;
      FD.battery_spare= EditPurchaseId?.battery_spare_toggle;
      FD.SpareBatteryPart= EditPurchaseId?.spare_battery_part;
      FD.AdultPad= EditPurchaseId?.adult_pad;
      FD.SpareAdultPad= EditPurchaseId?.spare_adult_pad;
      FD.adult_spare= EditPurchaseId?.adult_spare_toggle;
      FD.have_pad = EditPurchaseId?.have_ped_toggle;
      FD.PedPad= EditPurchaseId?.ped_pad;
      FD.ped_spare= EditPurchaseId?.ped_spare_toggle;
      FD.SparePedPad= EditPurchaseId?.spare_ped_pad;
      FD.have_storage= EditPurchaseId?.have_storage_toggle;
      FD.selectedStorageBrandId= EditPurchaseId?.storage_brand;
      FD.selectedStorageModelId= EditPurchaseId?.storage_model;
      FD.storagePartNumbers= EditPurchaseId?.storage_part;
      FD.ready_kit= EditPurchaseId?.ready_kit_toggle;
      FD.selectedReadyKitBrandId= EditPurchaseId?.ready_kit_brand;
      FD.selectedReadyKitModelId= EditPurchaseId?.ready_kit_model;
      FD.readyKitPartNumbers= EditPurchaseId?.ready_kit_part;
      FD.wall_sign= EditPurchaseId?.wall_sign_toggle;
      FD.selectedWallSignBrandId= EditPurchaseId?.wall_sign_brand;
      FD.selectedWallSignModelId= EditPurchaseId?.wall_sign_model;
      FD.wallSignPartNumbers= EditPurchaseId?.wall_sign_part;


      // FD.Part= EditAccessoriesId?.part;
      setSelectedBrandId(EditPurchaseId?.brand);
      setSelectedModelId(EditPurchaseId?.model);
      fetchEditDetails(EditPurchaseId?.brand);
      setBatteryParts([EditPurchaseId?.battery_part])

      setSelectedStorageBrandId(EditPurchaseId?.storage_brand)
      editStorageBrandChange(EditPurchaseId?.storage_brand)
      editStorageModelChange(EditPurchaseId?.storage_model)
      setSelectedStorageModelId(EditPurchaseId?.storage_model)
      console.log(EditPurchaseId?.ready_kit_brand)
      setReadyKitBrand([EditPurchaseId?.ready_kit_brand])
      setSelectedReadyKitBrandId(EditPurchaseId?.ready_kit_brand)
      editReadyKitBrandChange(EditPurchaseId?.ready_kit_brand)
      editReadyKitModelChange(EditPurchaseId?.ready_kit_model)

      setSelectedWallSignBrandId(EditPurchaseId?.wall_sign_brand)
      setSelectedWallSignModelId(EditPurchaseId?.wall_sign_model)
      editWallSignBrandChange(EditPurchaseId?.wall_sign_brand)
      setFormData(FD);
    }

  },[edit,EditPurchaseId])

  useEffect(()=>{
    // EditAccessoriesId
    if(EditContractPurchaseId && edit && type == 2){
      console.log({EditContractPurchaseId})
      
    const FD  = {...formData};
      FD.EquipmentType = EditContractPurchaseId?.equipment_type;
      FD.Brand= EditContractPurchaseId?.brand;
      FD.Model= EditContractPurchaseId?.model;
      FD.Part= EditContractPurchaseId?.part;
      FD.Quantity= EditContractPurchaseId?.quantity;
      FD.Price= EditContractPurchaseId?.price;
      FD.PurchaseType= EditContractPurchaseId?.purchase_type;
      FD.Condition= EditContractPurchaseId?.condition;
      FD.CLINs = EditContractPurchaseId?.clins === 0 ? "" : EditContractPurchaseId?.clins;
      FD.BatteryPart= EditContractPurchaseId?.battery_part;
      FD.battery_spare= EditContractPurchaseId?.battery_spare_toggle;
      FD.SpareBatteryPart= EditContractPurchaseId?.spare_battery_part;
      FD.AdultPad= EditContractPurchaseId?.adult_pad;
      FD.SpareAdultPad= EditContractPurchaseId?.spare_adult_pad;
      FD.adult_spare= EditContractPurchaseId?.adult_spare_toggle;
      FD.have_pad = EditContractPurchaseId?.have_ped_toggle;
      FD.PedPad= EditContractPurchaseId?.ped_pad;
      FD.ped_spare= EditContractPurchaseId?.ped_spare_toggle;
      FD.SparePedPad= EditContractPurchaseId?.spare_ped_pad;
      FD.have_storage= EditContractPurchaseId?.have_storage_toggle;
      FD.selectedStorageBrandId= EditContractPurchaseId?.storage_brand;
      FD.selectedStorageModelId= EditContractPurchaseId?.storage_model;
      FD.storagePartNumbers= EditContractPurchaseId?.storage_part;
      FD.ready_kit= EditContractPurchaseId?.ready_kit_toggle;
      FD.selectedReadyKitBrandId= EditContractPurchaseId?.ready_kit_brand;
      FD.selectedReadyKitModelId= EditContractPurchaseId?.ready_kit_model;
      FD.readyKitPartNumbers= EditContractPurchaseId?.ready_kit_part;
      FD.wall_sign= EditContractPurchaseId?.wall_sign_toggle;
      FD.selectedWallSignBrandId= EditContractPurchaseId?.wall_sign_brand;
      FD.selectedWallSignModelId= EditContractPurchaseId?.wall_sign_model;
      FD.wallSignPartNumbers= EditContractPurchaseId?.wall_sign_part;


      // FD.Part= EditAccessoriesId?.part;
      setSelectedBrandId(EditContractPurchaseId?.brand);
      setSelectedModelId(EditContractPurchaseId?.model);
      fetchEditDetails(EditContractPurchaseId?.brand);
      setBatteryParts([EditContractPurchaseId?.battery_part])

      setSelectedStorageBrandId(EditContractPurchaseId?.storage_brand)
      editStorageBrandChange(EditContractPurchaseId?.storage_brand)
      editStorageModelChange(EditContractPurchaseId?.storage_model)
      setSelectedStorageModelId(EditContractPurchaseId?.storage_model)

      setReadyKitBrand([EditContractPurchaseId?.ready_kit_brand])
      setSelectedReadyKitBrandId(EditContractPurchaseId?.ready_kit_brand)
      editReadyKitBrandChange(EditContractPurchaseId?.ready_kit_brand)
      editReadyKitModelChange(EditContractPurchaseId?.ready_kit_model)

      setSelectedWallSignBrandId(EditContractPurchaseId?.wall_sign_brand)
      setSelectedWallSignModelId(EditContractPurchaseId?.wall_sign_model)
      editWallSignBrandChange(EditContractPurchaseId?.wall_sign_brand)
      setFormData(FD);
    }

  },[edit,EditContractPurchaseId])

  // console.log(EditContractPurchaseId?.storage_model)

  useEffect(() => {
    async function fetchData() {
      const brandList = await GetAedBrands();
      setBrands(brandList?.data || []);

      const storageBrandList = await CallGETAPI('account/storage-brands');
      setStorageBrands(storageBrandList?.data?.data || []);
      // console.log(storageBrandList?.data?.data || []);
    }

    fetchData();
  }, []);

  const handleBrandChange = async (BrandId) =>{
    setSelectedBrandId(BrandId);
  
    if (BrandId) {
      let ModelRes    =  await GetAedModelsByBrandId(BrandId);
      let modelResult = ModelRes?.data || [];
      setModels(modelResult);
  } else {
      setModels([]);
    }
  };

  // Handle Ready Kit Brand DropDown
  const handleReadyKitBrandChange = async (selectedReadyKitBrandId) => {
    setSelectedReadyKitBrandId(selectedReadyKitBrandId);

    if(selectedReadyKitBrandId){
      await CallGETAPI(`account/readykit-model-by-brand/${selectedReadyKitBrandId}`)
      .then((result) => {
        setReadyKitModel(result?.data?.data || []);
        console.log(result?.data?.data || []);
      })
      .catch((error) => {
        console.error('Error fetching storage models:', error);
      });
    } }

    const handleReadyKitModelChange =  async (ReadyKitModelId) => {
      setSelectedReadyKitModelId(ReadyKitModelId);
    };

    // Handle Ready Kit Brand DropDown
  const handleWallSignBrandChange = async (selectWallSignBrandId) => {
    setSelectedWallSignBrandId(selectWallSignBrandId);

    if(selectWallSignBrandId){
      await CallGETAPI(`account/wallsign-model-by-brand/${selectWallSignBrandId}`)
      .then((result) => {
        setWallSignModel(result?.data?.data || []);
        console.log(result?.data?.data || []);
      })
      .catch((error) => {
        console.error('Error fetching storage models:', error);
      });
    }}

       // Handle changes in the StorageModel dropdown
     const handleWallSignModelChange = async (wallSignModelId) => {
         setSelectedWallSignModelId(wallSignModelId);
       };

  useEffect(() =>{
    CallGETAPI("account/readykit-brands")
    .then((result) =>{
    setReadyKitBrand(result?.data?.data);
      console.log(result?.data?.data)
    })
  },[])


  useEffect(() =>{
    CallGETAPI("account/wallsign-brands")
    .then((result) =>{
      setWallSignBrand(result?.data?.data);
      console.log(result?.data?.data)
    })
  },[])

      // Handle changes in the Model dropdown
      const handleModelChange = (modelId) => {
        setSelectedModelId(modelId);
      };      

      useEffect(() => {
        if (selectedModelId) {
          // Fetch Parts based on the selected Model
           CallGETAPI(`account/aed-part-by-models/${selectedModelId}`)
            .then((result) => {
              setParts(result?.data?.data || []);
            })

             CallGETAPI(`account/ade-battery-type-by-model/${selectedModelId}`)
            .then((result) => {
              setBatteryParts(result?.data?.data || []);
            })
        
            CallGETAPI(`/account/ade-pad-type-by-model/${selectedModelId}`)
            .then((result) => {
              setAdultPad(result?.data?.data || []);
              console.log(result?.data?.data || []);
            })

            .catch((error) => {
              console.error('Error fetching parts:', error);
            });
        } else {
          setParts([]); // Clear the parts list when no Model is selected
        }
      }, [selectedModelId]);
      
  

    // Handle changes in the StorageBrand dropdown
    const handleStorageBrandChange = async (storageBrandId) => {
      setSelectedStorageBrandId(storageBrandId);
  
      if (storageBrandId) {
        await CallGETAPI(`account/storage-model-by-brands/${storageBrandId}`)
          .then((result) => {
            setStorageModels(result?.data?.data || []);
            console.log(result?.data?.data || []);
          })
          .catch((error) => {
            console.error('Error fetching storage models:', error);
          });
      } else {
        setStorageModels([]);
      }
    };

//     // Define the handleSelect function to update the formData
// const handleSelect = (selectedItem) => {
//   // Update the formData with the selected item
//   const updatedFormData = { ...formData, StoragePart: selectedItem };
//   setFormData(updatedFormData); // Assuming you have a function to set the form data
// };

     // Handle changes in the StorageModel dropdown
  const handleStorageModelChange =  async (storageModelId) => {
    setSelectedStorageModelId(storageModelId);

    if (storageModelId) {
      // Fetch StorageParts based on the selected StorageModel
      await CallGETAPI(`account/storage-part-by-model/${storageModelId}`)
        .then((result) => {
          setStorageParts(result?.data?.data || []);
          console.log(result?.data?.data || []);
        })
        .catch((error) => {
          console.error('Error fetching storage parts:', error);
        });
    } else {
      setStorageParts([]);
    }
  };

  // Handle form field changes
  const handleChange = async (e, fieldName) => {
    const value = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    if(type =="1" && !formData.Quantity){
      setValidated(true);
      return;
    }
    if (
      !formData.EquipmentType ||
      !selectedBrandId ||
      !selectedModelId ||
      !formData.Part ||
      !formData.Price ||
      !formData.PurchaseType ||
      !formData.Condition   
    ) {
      setValidated(true);
      console.log({msg:'here we are ',
      EquipmentType:  formData.EquipmentType,
      selectedBrandId,selectedModelId,Part:  formData.Part,
      Quantity:  formData.Quantity,
      Price:  formData.Price,
      Condition:  formData.Condition,
      PurchaseType:  formData.PurchaseType

    })
      return;
    }

    console.log('Form data submitted:', formData,edit);
    console.log({edit});
    // return "";
    if(!edit){
      console.log('Calling Save Equipment');
      await callSaveEquipmentAPI();
      }
      if(edit){
        await callUpdateEquipmentAPI(type);
      }

  };


  const handleToggle = (e,name,type)=>{
    // console.log({e,name,type});
    const value = e.target.value;
    if(e.target.checked) {
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
    }else{
      setFormData((prevData) => ({
        ...prevData,
        [name]: 0,
      }));
    }
  }

  return (
    <> 
    <Modal show={ equipmentModal } onHide={ handleClose }
    dialogClassName="training-modal"
    aria-labelledby=""
    size="lg"
    id="address-modal"
>
    
    <div className=" mt-4" style={{ width: "100%", paddingInline: "1%",marginBottom:"1%"}}>
     
      <Modal.Body>
      <Form
        className=""
        onSubmit={handleSubmit}
        noValidate
        validated={validated}
        id="create-new-equipment-form"
      >
        <div
          className="container-fluid mt-4 bottom-border-blue pt-2"
          style={{
            borderBottom: "4px solid rgb(13, 110, 253)",
            background: "#eee",
          }}
        >
          <h2 className="heading">Purchased Equipment Information</h2>

          <div className="row my-3">
            <div className="row my-3">
              <Form.Group className={"col"}>
                <Form.Label>Equipment Type*</Form.Label>
                <select id="brandDropdown" className="form-control"
                  type="text"
                  name="EquipmentType"
                  value={formData.EquipmentType}
                  onChange={(e) => handleChange(e, 'EquipmentType')}
                  required
                  style={{}}
                  placeholder='- Select-One -'
                >
                  <option value="">- Select one -</option>
                  <option value="AEDs">AEDs</option>
                </select>
                <Form.Control.Feedback type="invalid">
                    This field is required
                  </Form.Control.Feedback>
               </Form.Group>

              <Form.Group className={"col"}>
              <Form.Label>Brand*</Form.Label>
              <select
                id="brandDropdown"
                className="form-control"
                name="Brand"
                value={selectedBrandId}
                onChange={(e) => handleBrandChange(e.target.value)}
                required
              >
                <option value="">--Select One--</option>
                {brands.map((brand, index) => (
                  <option key={index + 1} value={brand?.id}>
                    {brand?.AED_brands}
                  </option>
                ))}
              </select>
              <Form.Control.Feedback type="invalid">
                    This field is required
                  </Form.Control.Feedback>
             </Form.Group>

            <Form.Group className={"col"}>
              <Form.Label>Model*</Form.Label>
              <select
                id="modelDropdown"
                className="form-control"
                name="Model"
                value={selectedModelId}
                required
                onChange={(e) => handleModelChange(e.target.value)}
                >
                <option value="">- Select one -</option>
                {models.map((model, index) => (
                  <option key={index + 1} value={model?.id}>
                    {model?.model_name}
                  </option>
                ))}
              </select>
              <Form.Control.Feedback type="invalid">
                    This field is required
                  </Form.Control.Feedback>
             </Form.Group>

            <Form.Group className={"col"}>
  <Form.Label>Part #*</Form.Label>
  <select
    id="partDropdown"
    className="form-control"
    name="Part"
    value={formData.Part}
    onChange={(e) => handleChange(e, 'Part')}
    required
  >
    <option value="">- Select one -</option>
    {parts.map((part, index) => (
part?.model_partnumber && 
<option key={index + 1} value={part?.id}>
        {part?.model_partnumber}
      </option>
    ))}
  </select>
  <Form.Control.Feedback type="invalid">
                    This field is required
                  </Form.Control.Feedback>
  </Form.Group>

              <div className='row my-3'>
                {type =="1" && ( 
                <Form.Group className={"col"}>
                  <Form.Label>Quantity*</Form.Label>
                  <input className="form-control"
                    type="text"
                    name="Quantity"
                    value={formData.Quantity}
                    onChange={(e) => handleChange(e, 'Quantity')}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    This field is required
                  </Form.Control.Feedback>
                </Form.Group>
                )}

                <Form.Group className={"col dollar-sign"}>
                  <Form.Label>Price*</Form.Label>
                  <input className="form-control"
                    type="text"
                    name="Price"
                    value={formData.Price}
                    onChange={(e) => handleChange(e, 'Price')}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    This field is required
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className={"col"}>
                  <Form.Label>Purchase Type*</Form.Label>
                  <select id="brandDropdown" className="form-control"
                    type="text"
                    name="PurchaseType"
                    value={formData.PurchaseType}
                    onChange={(e) => handleChange(e, 'PurchaseType')}
                    required
                    style={{}}
                  >
                    <option value="">- Select one -</option>
                    <option value="Own">Own</option>
                    <option value="Rent">Rent</option>
                    <option value="Lease">Lease</option>
                </select>
                <Form.Control.Feedback type="invalid">
                    This field is required
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className={"col"}>
                  <Form.Label>Condition*</Form.Label>
                  <select id="brandDropdown" className="form-control"
                    type="text"
                    name="Condition"
                    value={formData.Condition}
                    onChange={(e) => handleChange(e, 'Condition')}
                    required
                    style={{}}
                  >
                    <option value="">-- Select one --</option>
                    <option value="New">New</option>
                    <option value="Refurbished">Refurbished</option>
                  </select>
                  <Form.Control.Feedback type="invalid">
                    This field is required
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className={"col"}>
                  <Form.Label>CLINs</Form.Label>
                  <input className="form-control"
                    type="number"
                    name="CLINs"
                    value={formData.CLINs}
                    onChange={(e) => handleChange(e, 'CLINs')}
                  />
                </Form.Group>
              </div>

              <div className='row my-3 display-flex align-items-center'>
              <Form.Group className={"col"}>
                  <Form.Label>Battery Part #</Form.Label>
                  <select id="brandDropdown" className="form-control"
                    type="text"
                    name="BatteryPart"
                    value={formData.BatteryPart}
                    onChange={(e) => handleChange(e, 'BatteryPart')}
                    style={{}}
                  >
                    <option value="">- Select one -</option>
                    {batteryParts.map((part, index) => (
                      <option key={index + 1} value={part?.id}>
                        {part?.battery_part_number}
                       </option>
                       ))}
                  </select>
                </Form.Group>

                <div className={"col"} style={{ display: "flex", flexDirection: "column", maxWidth: "150px" }}>
                  <Form.Label>Battery Spare</Form.Label>
                  <CustomToggleButton
                  
                  ToggleName="battery_spare"
                  ToggleValue={formData?.battery_spare}
                  changeHandler={(e)=>handleToggle(e,'battery_spare', 'battery_spare')}

                  style={{ height: "7px" }} />
                </div>

                <Form.Group className={"col"}>
                  <Form.Label>Spare Battery Part #</Form.Label>
                  <select id="brandDropdown" className="form-control"
                    type="text"
                    name="SpareBatteryPart"
                    value={formData.SpareBatteryPart}
                    onChange={(e) => handleChange(e, 'SpareBatteryPart')}
                    style={{}}
                    disabled={!formData?.battery_spare}
                  >
                     <option value="">- Select one -</option>
                    {batteryParts.map((part, index) => (
                      <option key={index + 1} value={part?.id}>
                        {part?.battery_part_number}
                       </option>
                       ))}
                    </select>
                </Form.Group>

                <Form.Group className={"col"}>
                  <Form.Label>Adult Pad/Pak Part #</Form.Label>
                  <select id="brandDropdown" className="form-control"
                    type="text"
                    name="AdultPad"
                    value={formData.AdultPad}
                    onChange={(e) => handleChange(e, 'AdultPad')}
                    style={{}}
                  >
                  <option value="">- Select one -</option>
    {adultPad.map((part, index) => part?.pediatric === 0 && (
      <option key={index + 1} value={part?.id}>
        {part?.pad_part_number}
      </option>
    ))}
                  </select>
                </Form.Group>

                <div className={"col"} style={{ display: "flex", flexDirection: "column", maxWidth:"10%" }}>
                  <Form.Label>Adult Spare</Form.Label>
                  <CustomToggleButton
                  
                  ToggleName="adult_spare"
                  ToggleValue={formData?.adult_spare}
                  changeHandler={(e)=>handleToggle(e,'adult_spare', 'adult_spare')}

                  style={{ height: "7px" }} />
                </div>

                <Form.Group className={"col"} >
                  <Form.Label>Spare Adult Pad/Pak Part #</Form.Label>
                  <select id="brandDropdown" className="form-control"
                    type="text"
                    name="SpareAdultPad"
                    value={formData.SpareAdultPad}
                    onChange={(e) => handleChange(e, 'SpareAdultPad')}
                    style={{}}
                    disabled={!formData?.adult_spare}
                  >
                 <option value="">- Select one -</option>
                {adultPad.map((part, index) => part?.pediatric === 0 && (
                <option key={index + 1} value={part?.id}>
                {part?.pad_part_number}
              </option>
              ))}
                  </select>
                </Form.Group>

              </div>

              <div className='row my-3'>

              <div className={"col"} style={{ display: "flex", flexDirection: "column", maxWidth:"12%"  }}>
                  <Form.Label>Have Ped</Form.Label>
                  <CustomToggleButton
                  
                  ToggleName="have_pad"
                  ToggleValue={formData?.have_pad}
                  changeHandler={(e)=>handleToggle(e,'have_pad', 'have_pad')}

                  style={{ height: "7px" }} />
                </div>

              <Form.Group className={"col"} >
                  <Form.Label >Ped Pad/Pak Part #</Form.Label>
                  <select id="brandDropdown" className="form-control"
                    type="text"
                    name="PedPad"
                    value={formData.PedPad}
                    onChange={(e) => handleChange(e, 'PedPad')}
                    style={{}}
                    disabled={!formData?.have_pad}
                  >
                    <option value="">- Select one -</option>
                {adultPad.map((part, index) =>  part?.pediatric === 1 && (
                <option key={index + 1} value={part?.id}>
                {part?.pad_part_number}
              </option>
              ))}
                  </select>
                </Form.Group>

                <div className={"col"} style={{ display: "flex", flexDirection: "column",  maxWidth:"10%" }}>
                  <Form.Label >Ped Spare</Form.Label>
                  <CustomToggleButton
                  
                  ToggleName="ped_spare"
                  ToggleValue={formData?.ped_spare}
                  changeHandler={(e)=>handleToggle(e,'ped_spare', 'ped_spare')}

                  style={{ height: "7px" }} />
                </div>

                <Form.Group className={"col"} style={{  minWidth:"20%" }}>
                  <Form.Label>Spare Ped Pad/Pak Part #</Form.Label>
                  <select id="brandDropdown" className="form-control"
                    type="text"
                    name="SparePedPad"
                    value={formData.SparePedPad}
                    onChange={(e) => handleChange(e, 'SparePedPad')}
                    style={{}}
                    disabled={!formData?.ped_spare}
                  >
                    <option key={0} value={''}> -- Select One-- </option>
                   {adultPad.map((part, index) => part?.pediatric === 1 && (
                <option key={index + 1} value={part?.id}>
                {part?.pad_part_number}
              </option>
              ))}
                  </select>
                </Form.Group>
             
             </div>

             <div className='row my-3'>
                <div className={"col"} style={{ display: "flex", flexDirection: "column", maxWidth: "12%" }}>
                  <Form.Label>Have Storage</Form.Label>
                  <CustomToggleButton
                  
                  ToggleName="have_storage"
                  ToggleValue={formData?.have_storage}
                  changeHandler={(e)=>handleToggle(e,'have_storage', 'have_storage')}

                  style={{ height: "7px" }} />
                </div>

                <Form.Group className={"col"}>
              <Form.Label>Storage Brand</Form.Label>
              <select
                id="storageBrandDropdown"
                className="form-control"
                name="StorageBrand"
                value={selectedStorageBrandId}
                onChange={(e) => handleStorageBrandChange(e.target.value)}
                required={formData?.have_storage}
                disabled={!formData?.have_storage}
              >
                <option value="" key="0">--Select One--</option>
                {storageBrands.map((storageBrand, index) => (
                  <option key={index + 1} value={storageBrand?.id}>
                    {storageBrand?.storage_brands}
                  </option>
                ))}
              </select>
              <Form.Control.Feedback type="invalid">
                    This field is required
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className={"col"}>
          <Form.Label>Storage Model</Form.Label>
          <select
            id="storageModelDropdown"
            className="form-control"
            name="StorageModel"
            value={selectedStorageModelId}
            onChange={(e) => handleStorageModelChange(e.target.value)}
            required={formData?.have_storage}
            disabled={!formData?.have_storage}
          >
            <option value="">- Select one -</option>
            {storageModels.map((storageModel, index) => (
              <option key={index + 1} value={storageModel?.id}>
                {storageModel?.model_name}
              </option>
            ))}
          </select>
          <Form.Control.Feedback type="invalid">
                    This field is required
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className={"col"}>
          <Form.Label>Storage Part #</Form.Label>
         {storageParts.map((storagePart, index) => (
              <h5 style={{ fontSize: '17px',marginTop:"2%" }} key={index + 1} value={storagePart?.model_partnumber}>
                {storagePart?.model_partnumber || ""}
              </h5>
            ))}
         </Form.Group>
        </div>

              <div className='row my-3 display-flex align-items-center'>
               <div className={"col"} style={{ display: "flex", flexDirection: "column", maxWidth:"12%"  }}>
                  <Form.Label>Ready kit</Form.Label>
                  <CustomToggleButton
                  
                  ToggleName="ready_kit"
                  ToggleValue={formData?.ready_kit}
                  changeHandler={(e)=>handleToggle(e,'ready_kit', 'ready_kit')}

                  style={{ height: "7px" }} />
                </div>

                <Form.Group className={"col"}>
              <Form.Label>Ready Kit Brand</Form.Label>
              <select
                id=""
                className="form-control"
                name="ReadyKitBrand"
                value={selectedReadyKitBrandId}
                onChange={(e) => handleReadyKitBrandChange(e.target.value)}
                // required={formData?.have_storage}
                disabled={!formData?.ready_kit}
              >
                <option value="" key="0">--Select One--</option>
                {readyKitBrand.map((readyKitBrand, index) => (
                  <option key={index + 1} value={readyKitBrand?.id}>
                    {readyKitBrand?.ready_kit_brands}
                  </option>
                ))}
              </select>
              {/* <Form.Control.Feedback type="invalid">
                    This field is required
              </Form.Control.Feedback> */}
            </Form.Group>

            <Form.Group className={"col"}>
          <Form.Label>Ready Kit Model</Form.Label>
          <select
            id="ReadyKitModel"
            className="form-control"
            name="ReadyKitModel"
            value={selectedReadyKitModelId}
            onChange={(e) => handleReadyKitModelChange(e.target.value)}
            // required={formData?.have_storage}
            disabled={!formData?.ready_kit}
          >
            <option value="">- Select one -</option>
            {readyKitModel.map((readyKitModel, index) => (
              <option key={index + 1} value={readyKitModel?.id}>
                {readyKitModel?.model_name}
              </option>
            ))}
          </select>
          <Form.Control.Feedback type="invalid">
                    This field is required
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className={"col"} >
          <Form.Label>Ready Kit Part #</Form.Label>
          {readyKitModel
  .filter((item) => selectedReadyKitModelId.includes(item.id))
  .map((readyKitModel, index) => (
    <h5 style={{ fontSize: '17px', marginTop: '2%' }} key={index + 1}>
      {readyKitModel?.model_partnumber || ''}
    </h5>
  ))}
         </Form.Group>
        </div>

         <div className='row my-3'>
                <div className={"col"} style={{ display: "flex", flexDirection: "column", maxWidth:"12%"  }}>
                  <Form.Label>Wall Sign</Form.Label>
                  <CustomToggleButton
                  
                  ToggleName="wall_sign"
                  ToggleValue={formData?.wall_sign}
                  changeHandler={(e)=>handleToggle(e,'wall_sign', 'wall_sign')}

                  style={{ height: "7px" }} />
                </div>

                <Form.Group className={"col"}>
              <Form.Label>Wall Sign Brand</Form.Label>
              <select
                id="wallSignBrand"
                className="form-control"
                name="WallSignBrand"
                value={selectedWallSignBrandId}
                onChange={(e) => handleWallSignBrandChange(e.target.value)}
                // required={formData?.have_storage}
                disabled={!formData?.wall_sign}
              >
                <option value="" key="0">--Select One--</option>
                {wallSignBrand.map((wallSignBrand, index) => (
                  <option key={index + 1} value={wallSignBrand?.id}>
                    {wallSignBrand?.wall_sign_brands}
                  </option>
                ))}
              </select>
              <Form.Control.Feedback type="invalid">
                    This field is required
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className={"col"}>
          <Form.Label>Wall Sign Model</Form.Label>
          <select
            id="WallSignModel"
            className="form-control"
            name="WallSignModel"
            value={selectedWallSignModelId}
            onChange={(e) => handleWallSignModelChange(e.target.value)}
            // required={formData?.have_storage}
            disabled={!formData?.wall_sign}
          >
            <option value="">- Select one -</option>
            {wallSignModel.map((wallSignModel, index) => (
              <option key={index + 1} value={wallSignModel?.id}>
                {wallSignModel?.model_name}
              </option>
            ))}
          </select>
          <Form.Control.Feedback type="invalid">
                    This field is required
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className={"col"}>
          <Form.Label>Wall Sign Part #</Form.Label>
          {wallSignModel
  .filter((item) => selectedWallSignBrandId.includes(item.id))
  .map((wallSignModel, index) => (
    <h5 style={{ fontSize: '17px', marginTop: '2%' }} key={index + 1}>
      {wallSignModel?.model_partnumber || ''}
    </h5>
  ))}
 </Form.Group>
        </div>
            </div>
          </div>
          </div>
       
         {/* bottom buttons */}
         <div className="row pb-3 py-4" >
            <div className="col-12 content-flex-right" >
              <button className="btn btn-danger text-uppercase" type="button" onClick={ handleClose }>Cancel</button>
              {edit ? (
              <button className="btn btn-success text-uppercase ms-2" type="update" disabled={loading} >{loading?'Loading...':'Update'}</button>) : (
              <button className="btn btn-success text-uppercase ms-2" type="submit" disabled={loading} >{loading?'Loading...':'Submit'}</button>
              )}
            </div>
          </div>
          </Form>
          </Modal.Body>
      </div>
      </Modal>
      </>
    )
}

export default PopEquipment;
