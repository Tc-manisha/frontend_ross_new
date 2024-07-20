import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
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
import Select from 'react-select';

import SubHeadingOther from "../../../components/header/SubHeadingOther";
import CustomToggleButton from '../../../components/common/toggleSwitch/CustomToggleButton';
import { GetAedBrands, GetAedModelsByBrandId } from '../../../helper/BasicFn';
import { CallGETAPI, CallPOSTAPI } from '../../../helper/API';
import { toast } from 'react-toastify';
import { addAssesories, addContractAssesories ,updateAccessoriesList,updateContractAccessoriesList} from '../../../redux/slices/EquipmentSlice';



const PopAccessories = ({accessoriesModal,setAccessoriesModal,accountId,type,edit,EditAccessoriesId,EditContractAccessoriesId}) => {
  const handleClose = () => setAccessoriesModal(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedBrandId, setSelectedBrandId] = useState([]);
  const [selectedModelId, setSelectedModelId] = useState([]);
  const [loading,setLoading] = useState(false);
  const [parts, setParts] = useState([]);  
  const AssesoriesList = useSelector((state) => state.equipment.AssesoriesList)
  const ContractAccessoriesList = useSelector((state) => state.equipment.ContractAssesoriesList)
  
  
    const [validated, setValidated] = useState(false);
    const [editData, setEditData] = useState("")
    const [brandEditId,setBrandEditId] = useState("")
    const [readyKitBrand, setReadyKitBrand] = useState([]);
    const [storageBrands, setStorageBrands] = useState([]);
    const [wallSignBrand, setWallSignBrand] = useState([]);
    const [selectedReadyKitModelId, setSelectedReadyKitModelId] = useState([]);
    const [selectedWallSignModelId, setSelectedWallSignModelId] = useState([]);
    const [formData, setFormData] = useState({
        AccessoriesType: '',
        Brand: '',
        reqNumber: '',
        Model: '',
        Part: '',
        Price: '',
        Condition: '',
        CLINs: '',
      });
      console.log(EditContractAccessoriesId)
      console.log(EditAccessoriesId.accessories_id)

      const callSaveAccessoriesAPI = async () => {
        setLoading(true);
        // console.log(accountId)
        const accessoriespayload ={
          "account_id" :accountId,
          "accessories_type": formData?.AccessoriesType,
          "brand": selectedBrandId,
              "model": selectedModelId,
              "part": formData?.Part,
              "quantity": formData?.Quantity,
              "price": formData?.Price,
              "condition": formData?.Condition,
              "clins": formData?.CLINs,
              "accessories_purchase_type": type,
      };
        let result = await CallPOSTAPI('account/save-accessories',accessoriespayload)
        if(result.data.status){
          toast.success('Accessories Saved Successfully')
          const resultData =  result.data.data;
          const AssesData  = resultData.accessoriesData;
          // console.log({AssesData,type})
          const obj = {
            ...AssesData,
            brandName:resultData?.brandName,
            modelName:resultData?.modelName 
        }
          if(parseInt(type)===1){   
            console.log("addAccessory")
            dispatch(addAssesories(obj));
          }else{
            console.log("addContractAccessory")
            dispatch(addContractAssesories(obj))
          }

          handleClose();
        }else{
          toast.error(result.data.msg)
        }
        setLoading(false);
      }

      const callUpdateAccessoriesAPI = async (type) => {
        setLoading(true);
        const accessoriespayload ={
          "accessories_id": type == 1 ? EditAccessoriesId.accessories_id : EditContractAccessoriesId.accessories_id,
          "accessories_type": formData?.AccessoriesType,
          "brand": selectedBrandId,
              "model": selectedModelId,
              "part": formData?.Part,
              "quantity": formData?.Quantity,
              "price": formData?.Price,
              "condition": formData?.Condition,
              "clins": formData?.CLINs,
              "accessories_purchase_type": type,
      };
       let result = await CallPOSTAPI('account/update-accessories',accessoriespayload)
        if(result.data.status){
          toast.success('Accessories Update Successfully')
          const resultData =  result.data.data;
          const AssesData  = resultData.accessoriesData;
          // console.log({AssesData,type})
          const obj = {
            ...AssesData,
            brandName:resultData?.brandName,
            modelName:resultData?.modelName 
        }
          if(parseInt(type)===1){   
            // console.log(AssesoriesList.findIndex(it=>parseInt(it.accessories_id)))
            // console.log(parseInt(accessoriespayload?.accessories_id ))
            const finfIndex = AssesoriesList.findIndex(it=>parseInt(it.accessories_id)===parseInt(accessoriespayload?.accessories_id ))
            console.log({finfIndex})
            const arr = [...AssesoriesList];
            console.log({arr})
            if(finfIndex !=-1){
              arr[finfIndex] = obj
              console.log({arr})
              console.log("updateAccessory")
              dispatch(updateAccessoriesList(arr));              
            }
          }else{
            console.log(ContractAccessoriesList.findIndex(it=>parseInt(it.accessories_id)))
            const finfIndex = ContractAccessoriesList.findIndex(it=>parseInt(it.accessories_id)===parseInt(accessoriespayload?.accessories_id ))
            console.log({finfIndex})
            const arr = [...ContractAccessoriesList];
            console.log({arr})
            if(finfIndex !=-1){
              arr[finfIndex] = obj
              console.log({arr})
            console.log("updateContractAccessoriesList")
            dispatch(updateContractAccessoriesList(arr))
          }}

          handleClose();
        }else{
          toast.error(result.data.msg)
        }
        setLoading(false);
      }


      const fetchLoad = async () =>{
        if(!edit){
        let result = await CallGETAPI('account/get-accessories-by-id/' + accountId);
        const accessoriesData = result?.data.data;
        console.log(accessoriesData);
        }
        if(edit && type ==1){
          const res = await CallGETAPI('account/get-accessories-by-id/' +EditAccessoriesId.accessories_id)
          const editDataresponse = res?.data.data.accessoriesData;
          console.log(editDataresponse)
          setEditData(editDataresponse);
          setBrandEditId(editDataresponse.brand)
        }
        if(edit && type ==2){
          const res = await CallGETAPI('account/get-accessories-by-id/' +EditContractAccessoriesId.accessories_id)
          const editDataresponse = res?.data.data.accessoriesData;
          setEditData(editDataresponse);
          setBrandEditId(editDataresponse.brand)
        }
      }

      useEffect(() => {
        fetchLoad();
      },[]);

      const handleBrandChange = async (BrandId) =>{

        setFormData({
          ...formData,
          Brand: BrandId,
        });

      if(formData.AccessoriesType === 'Batteries' || formData.AccessoriesType === 'Paks'){
       setSelectedBrandId(BrandId);
        if (BrandId) {
          let ModelRes    =  await GetAedModelsByBrandId(BrandId);
          let modelResult = ModelRes?.data || [];
          setModels(modelResult);
      } else {
          setModels([]);
        }}

        if(formData.AccessoriesType == 'RescueKit'){
          setSelectedBrandId([BrandId]);
        if(BrandId){
          await CallGETAPI(`account/readykit-model-by-brand/${BrandId}`)
          .then((result) => {
            setModels(result?.data?.data || []);
            console.log(result?.data?.data || []);
          })
          .catch((error) => {
            console.error('Error fetching storage models:', error);
          });
        } }

        if(formData.AccessoriesType == 'Storage'){
          setSelectedBrandId([BrandId]);
          if (BrandId) {
            await CallGETAPI(`account/storage-model-by-brands/${BrandId}`)
              .then((result) => {
                setModels(result?.data?.data || []);
                console.log(result?.data?.data || []);
              })
              .catch((error) => {
                console.error('Error fetching storage models:', error);
              });
          }}

        
        if(formData.AccessoriesType == 'WallSign'){
          setSelectedBrandId([BrandId]);
         if(BrandId){
      await CallGETAPI(`account/wallsign-model-by-brand/${BrandId}`)
      .then((result) => {
        setModels(result?.data?.data || []);
        console.log(result?.data?.data || []);
      })
      .catch((error) => {
        console.error('Error fetching storage models:', error);
      });
    }}
   };

       // Handle changes in the Model dropdown
       const handleModelChange = (modelId) => {
        setSelectedModelId(modelId);
        const FD = {...formData};
        FD.Model = modelId
        setFormData(FD);
      };      

      useEffect(() => {
        const fetchData = async () => {
          if (selectedModelId) {
            if (formData.AccessoriesType === 'Batteries' || formData.AccessoriesType === 'Paks') {
              try {
                const result = await CallGETAPI(`account/aed-part-by-models/${selectedModelId}`);
                setParts(result?.data?.data || []);
              } catch (error) {
                // Handle errors if needed
                console.error('Error fetching parts:', error);
              }
            } else {
              setParts([]);
            }

            if(formData.AccessoriesType == 'RescueKit'){
            setSelectedReadyKitModelId([selectedModelId]);
           }

          if(formData.AccessoriesType == 'Storage'){
          await CallGETAPI(`account/storage-part-by-model/${selectedModelId}`)
            .then((result) => {
              setParts(result?.data?.data || []);
              console.log(result?.data?.data || []);
            })
            .catch((error) => {
              console.error('Error fetching storage parts:', error);
            });
          }

          if(formData.AccessoriesType == 'WallSign'){
            setSelectedWallSignModelId([selectedModelId]);
           }

          }
        };
      
        fetchData();
      }, [selectedModelId]);
      


      // Handle form field changes
  const handleChange = async (e, fieldName) => {
    const value = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };


    const handleSubmit = async (event) => {
        event.preventDefault();
    
     if (!formData.AccessoriesType ||
        !selectedBrandId ||
        !selectedModelId ||
        !formData.Part ||
        !formData.Condition ||
        !formData.Price
      ) {
        setValidated(true);
        return;
      }
      if(edit == ""){
      await callSaveAccessoriesAPI();
      }
      if(edit){
        await callUpdateAccessoriesAPI(type);
      }
      };

      useEffect(() => {
        const fetchAccesData = async () => {
          if (formData.AccessoriesType === 'Batteries' || formData.AccessoriesType === 'Paks') {
            try {
              const result = await GetAedBrands();
              setBrands(result?.data || []);
            } catch (error) {
              // Handle errors if needed
              console.error('Error fetching AED brands:', error);
            }
          }

          if (formData.AccessoriesType === 'RescueKit') {
            try {
              const result = await CallGETAPI("account/readykit-brands");
              setBrands(result?.data?.data);
              console.log(result?.data?.data);
            } catch (error) {
              // Handle errors if needed
              console.error('Error fetching Rescue Kit brands:', error);
            }
          }

          if (formData.AccessoriesType === 'Storage') {
            try {
              const result = await CallGETAPI('account/storage-brands');
              setBrands(result?.data?.data || []);
              console.log(result?.data?.data);
            } catch (error) {
              // Handle errors if needed
              console.error('Error fetching Storage brands:', error);
            }
          }

          if (formData.AccessoriesType === 'WallSign') {
            try {
              const result = await CallGETAPI('account/wallsign-brands');
              setBrands(result?.data?.data);
              console.log(result?.data?.data);
            } catch (error) {
              // Handle errors if needed
              console.error('Error fetching Wall Sign brands:', error);
            }
          }
         };
      
         fetchAccesData();
      }, [formData.AccessoriesType]);
    

      const fetchEditDetails = async (BrandId)=>{
let ModelRes    =  await GetAedModelsByBrandId(BrandId);
let modelResult = ModelRes?.data || [];
setModels(modelResult);
      }
      useEffect(()=>{
        // EditAccessoriesId
        if(EditAccessoriesId && edit && type == 1){
          console.log({EditAccessoriesId})
          
        const FD  = {...formData};
          FD.AccessoriesType = EditAccessoriesId?.accessories_type;
          FD.Brand= EditAccessoriesId?.brand;
          FD.Model= EditAccessoriesId?.model;
          FD.Part= EditAccessoriesId?.part;
          FD.Quantity= EditAccessoriesId?.quantity;
          FD.Price= EditAccessoriesId?.price;
          FD.Condition= EditAccessoriesId?.condition;
          FD.CLINs = EditAccessoriesId?.clins === 0 ? "" : EditAccessoriesId?.clins;
          // FD.Part= EditAccessoriesId?.part;
          setSelectedBrandId([EditAccessoriesId?.brand]);
          setSelectedModelId([EditAccessoriesId?.model]);
          fetchEditDetails(EditAccessoriesId?.brand);
          setFormData(FD);
        }

      },[edit,EditAccessoriesId])

      useEffect(()=>{
        // EditContractAccessoriesId
        if(EditContractAccessoriesId && edit && type ==2){
          console.log({EditContractAccessoriesId})
          
        const FD  = {...formData};
          FD.AccessoriesType = EditContractAccessoriesId?.accessories_type;
          FD.Brand= EditContractAccessoriesId?.brand;
          FD.Model= EditContractAccessoriesId?.model;
          FD.Part= EditContractAccessoriesId?.part;
          FD.Quantity= EditContractAccessoriesId?.quantity;
          FD.Price= EditContractAccessoriesId?.price;
          FD.Condition= EditContractAccessoriesId?.condition;
          FD.CLINs = EditContractAccessoriesId?.clins === 0 ? "" : EditContractAccessoriesId?.clins;
          // FD.Part= EditContractAccessoriesId?.part;
          setSelectedBrandId([EditContractAccessoriesId?.brand]);
          setSelectedModelId([EditContractAccessoriesId?.model]);
          fetchEditDetails(EditContractAccessoriesId?.brand);
          setFormData(FD);
        }

      },[edit,EditContractAccessoriesId])

    return(
      <> 
      <Modal show={ accessoriesModal } onHide={ handleClose }
      dialogClassName="accessories-modal"
      aria-labelledby=""
      size="lg"
      id="address-modal"
  >
        <div className="mt-4" style={ { width: "100%", paddingInline: "2%" }}>

           {/* <SubHeadingOther title="Account: Meep Fitness" hideNew={true} hideHierarchy={true} hideInstructor={true} subHeading={true} bottomLinks={false}/> */}
        <Modal.Body>
        <Form
        className=""
        onSubmit={handleSubmit}
        noValidate
        validated={validated}
        id="create-new-accessories-form"
      >
        <div
          className="container-fluid mt-4 bottom-border-blue pt-2"
          style={{
            borderBottom: "4px solid rgb(13, 110, 253)",
            background: "#eee",
            width:"auto"
          }}
        >
          <h2 className="heading">Purchased Accessories Information</h2>

          <div className="row my-3">
            <div className="row my-3">
            <Form.Group className={"col-3"} >
                <Form.Label>Accessory Type*</Form.Label>
                <select style={{ width: "100%" }}
  className="form-control"
  type="text"
  name="AccessoriesType"
  onChange={(e) => handleChange(e, 'AccessoriesType')}
  required
  placeholder="- Select one -"
  value={formData?.AccessoriesType}
>
  {/* Accessory Type options are: Pads, Batteries, Paks, Storage */}
  <option value="">-- Select one --</option>
  <option value="Batteries">Batteries</option>
  <option value="Paks">Pads/Paks</option>
  <option value="RescueKit"> Rescue Kit</option>
  <option value="Storage">Storage</option>
  <option value="WallSign">Wall Sign</option>
</select>

                <Form.Control.Feedback type="invalid">
                    This field is required
                  </Form.Control.Feedback>
                </Form.Group>

              <Form.Group className={"col-3"} >
              <Form.Label>Brand*</Form.Label>
              <select style={{ width: "100%" }}
                id="brandDropdown"
                className="form-control"
                name="Brand"
                value={formData?.Brand}   
                // defaultValue={brandEditId}
                onChange={(e) => handleBrandChange(e.target.value)}
               
                // onChange={(e) =>{formData.AccessoriesType ==="batteries" ? handleBrandChange(e.target.value)}}
                required
              >
                <option value="">--Select One--</option>
                {(formData.AccessoriesType === 'Batteries' || formData.AccessoriesType === 'Paks') && (
                brands.map((brand, index) => (
                  <option key={index + 1} value={brand?.id}>
                    {brand?.AED_brands}
                  </option>
                )))}
                 {formData.AccessoriesType === 'RescueKit' && (
                brands.map((brand, index) => (
                  <option key={index + 1} value={brand?.id}>
                    {brand?.ready_kit_brands}
                  </option>
                  )))}
                  {formData.AccessoriesType === 'Storage' && (
                brands.map((brand, index) => (
                  <option key={index + 1} value={brand?.id}>
                    {brand?.storage_brands}
                  </option>
                  )))}
                   {formData.AccessoriesType === 'WallSign' && (
                brands.map((brand, index) => (
                  <option key={index + 1} value={brand?.id}>
                    {brand?.wall_sign_brands}
                  </option>
                  )))}
              </select>
              <Form.Control.Feedback type="invalid">
                    This field is required
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className={"col-3"}>
              <Form.Label>Model*</Form.Label>
              <select style={{ width: "100%" }}
                id="modelDropdown"
                className="form-control"
                name="Model"
                value={formData?.Model}
                // value={selectedModelId}
                // defaultValue={edit ? editData.model :selectedModelId}
                onChange={(e) => handleModelChange(e.target.value)}
                required
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

            <Form.Group className={"col-3"}>
  <Form.Label>Part #*</Form.Label>
  <select style={{ width: "100%" }}
    id="partDropdown"
    className="form-control"
    name="Part"
    // value={formData.Part}
    value={formData?.Part}
    // defaultValue={edit ? editData.part :formData.Part}
    onChange={(e) => handleChange(e, 'Part')}
    required
  >
    <option value="">- Select one -</option>
    {(formData.AccessoriesType === 'Batteries' || formData.AccessoriesType === 'Paks' || formData.AccessoriesType === 'Storage') && (
      parts.map((part, index) => (
      <option key={index + 1} value={part?.model_partnumber}>
        {part?.model_partnumber}
      </option>
    )))}
    {(formData.AccessoriesType === 'RescueKit') && (
         models
  .filter((item) => selectedModelId.includes(item.id))
  .map((model, index) => (
    <option key={index + 1} value={model?.model_partnumber}>
      {model?.model_partnumber || ''}
    </option>
  )))}
  {(formData.AccessoriesType === 'WallSign') && (
   models
   .filter((item) => selectedModelId.includes(item.id))
   .map((model, index) => (
    <option key={index + 1} value={model?.model_partnumber}>
      {model?.model_partnumber || ''}
      </option>
    )))}
    </select>
  <Form.Control.Feedback type="invalid">
      This field is required
   </Form.Control.Feedback>
</Form.Group>

            <div className='row my-3'>
              {type =="1" &&(
            <Form.Group className={"col-3"} >
                <Form.Label>Quantity*</Form.Label>
                <Form.Control
                  type="number"
                  name="Quantity"
                  value={formData.Quantity}
                  // defaultValue={edit ? editData.quantity :formData.Quantity}
                  onChange={(e)=>handleChange(e, 'Quantity')}
                />
               </Form.Group>
               )}

           <Form.Group className={"col-3 dollar-sign"} >
                <Form.Label>Price*</Form.Label>
                <Form.Control
                  type="number"
                  name="Price"
                  value={formData.Price}
                  // defaultValue={edit ? editData.price :formData.Price}
                  onChange={(e) => handleChange(e, 'Price')}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  This field is required
                 </Form.Control.Feedback>
               </Form.Group>

             <Form.Group className={"col-3"}>
               <Form.Label>Condition*</Form.Label>
<select 
  className="form-control"
  type="text"
  name="Condition"
  required
  placeholder="- Select one -"
  value={formData?.Condition}
  // value={edit !== "" ? condition : formData.Condition}
  onChange={(e) => handleChange(e, 'Condition')}
>
  <option value="">- Select one -</option>
  <option value="New">New</option>
  <option value="Refurbished">Refurbished</option>
</select>
<Form.Control.Feedback type="invalid">
  This field is required
</Form.Control.Feedback>

              </Form.Group>

              <Form.Group className={"col-3"}>
                <Form.Label>CLINs</Form.Label>
                <Form.Control
                  type="number"
                  name="CLINs"
                  value={formData.CLINs}
                  // defaultValue={edit ? editData.clins :formData.CLINs}
                  onChange={(e)=>handleChange(e, 'CLINs')}
                //   required
                />
               </Form.Group>
               </div>
               </div>
               </div>
               </div>
               
                {/* bottom buttons */}
           <div className="row pb-3 py-5" >
             <div className="col-12 content-flex-right" >
              <button className="btn btn-danger text-uppercase" type="button" onClick={handleClose}>Cancel</button>
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

export default PopAccessories;