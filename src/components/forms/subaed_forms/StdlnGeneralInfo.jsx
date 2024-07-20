import React, { useState, useEffect } from "react";
import {
  AccountSiteList,
  FetchAccountSiteDetails,
  GetAedModelsByBrandId,
  GetAedSumModelsById,
} from "../../../helper/BasicFn";
import { Form, InputGroup } from "react-bootstrap";
import { FormControlLabel, Switch } from "@mui/material";
import { AED_IMG_BASE, BASE_API } from "../../../helper/API";
import CustomToggleButton from "../../common/toggleSwitch/CustomToggleButton";
import CommonDatePicker from "../../common/date-picker/CommonDatePicker";
import Select from "react-select";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { updatePermission } from "../../../redux/slices/StandloneAEDSlice";
import PopEquipment from "../../../pages/accounts/Pop/PopEquipment";

function StdlnGeneralInfo({
  AccountList,
  formData,
  BrandList,
  setFormData,
  setPermission,
  Permissins,
  is_edit = false,
  DefaultValue,
}) {
  const PermissionRedux = useSelector(
    (state) => state?.AED_manager?.permissions
  );

  const modelResetValues = {
    has_battery: [
      {
        battery_type_id: "",
        battery_expiration: "",
        battery_lot: "",
        battery_udi: "",
        v9_install: "",
        install_before_date: "",
        date_installed: "",
        manufactured_date: "",
        battery_serial: "",
        quantity: "",
      },
    ],
    has_battery_spare: [],

    has_9v: [
      {
        battery_type_id: "",
        battery_expiration: "",
        battery_lot: "",
        battery_udi: "",
        v9_install: "",
        install_before_date: "",
        date_installed: "",
        manufactured_date: "",
        battery_serial: "",
        quantity: "",
      },
    ],

    has_9v_spare: [],

    has_installby: [
      {
        battery_type_id: "",
        battery_expiration: "",
        battery_lot: "",
        battery_udi: "",
        v9_install: "",
        install_before_date: "",
        date_installed: "",
        manufactured_date: "",
        battery_serial: "",
        quantity: "",
      },
    ],
    has_installby_spare: [],

    has_man: [
      {
        battery_type_id: "",
        battery_expiration: "",
        battery_lot: "",
        battery_udi: "",
        v9_install: "",
        install_before_date: "",
        date_installed: "",
        manufactured_date: "",
        battery_serial: "",
        quantity: "",
      },
    ],

    has_man_spare: [],

    has_10pk: [
      {
        battery_type_id: "",
        battery_expiration: "",
        battery_lot: "",
        battery_udi: "",
        v9_install: "",
        install_before_date: "",
        date_installed: "",
        manufactured_date: "",
        battery_serial: "",
        quantity: "",
      },
    ],
    has_10pk_spare: [],

    battery_info: [
      {
        battery_type_id: "",
        battery_expiration: "",
        battery_lot: "",
        battery_udi: "",
        v9_install: "",
        install_before_date: "",
        date_installed: "",
        manufactured_date: "",
        battery_serial: "",
        quantity: "",
      },
    ],

    spare_battery_info: [],

    battery_info1: [
      {
        battery_type_id: "",
        battery_expiration: "",
        battery_lot: "",
        battery_udi: "",
        v9_install: "",
        install_before_date: "",
        date_installed: "",
        manufactured_date: "",
        battery_serial: "",
      },
    ],

    ChargePakInformation: [
      {
        charge_pak_part: "",
        charge_pak_uiid: "",
        battery_expiration: "",
        battery_lot: "",
        pad_1_part: "",
        pad_1_expiration: "",
        pad_1_lot: "",
        pad_2_part: "",
        pad_2_expiration: "",
        pad_2_lot: "",
        quantity: "",
      },
    ],

    SpareChargePakInformation: [],

    AdultPadInformation: [
      {
        pad_part: "",
        pad_expiration: "",
        pad_lot: "",
        pad_udi: "",
        quantity: "",
        pad_type_id: "",
      },
    ],

    SpareAdultPadInfo: [],

    AdultPadPakInfo: [
      {
        pad_part: "",
        pad_expiration: "",
        pad_lot: "",
        pad_udi: "",
        quantity: "",
        pad_type_id: "",
      },
    ],

    SpareAdultPadPakInfo: [],

    PediatricPadInformation: [
      {
        pad_part: "",
        pad_expiration: "",
        pad_lot: "",
        pad_udi: "",
        quantity: "",
        pad_type_id: "",
        is_pediatric:1,
      },
    ],
    sparePadricPadInfo: [],
    PediatricPakPadInformation: [
      {
        pad_part: "",
        pad_expiration: "",
        pad_lot: "",
        pad_udi: "",
        quantity: "",
        pad_type_id: "",
        is_pediatric:1,
      },
    ],
    sparePadricPakPad: [],

    GatewayInformation: [
      {
        installed: "",
        connected: "",
        gateway_serial: "",
        gateway_Mmac_address: "",
        battery_install_date: "",
        expiry_date: "",
      },
    ],
    BuiltInRMSInformation: [
      {
        connected: false,
        mac_address: "",
      },
    ],
    pediatric_key: false,
  };

  const default_conditoions = {
    auto: 0,
    brand_id: 0,
    created_by_id: null,
    created_date: "2023-05-04T19:51:56.000Z",
    discontinued: 0,
    display: 0,
    has_9v: 0,
    has_10pk: 0,
    has_battery: 0,
    has_builtin_rms: 0,
    has_chargepak: 0,
    has_gateway: 0,
    has_installby: 0,
    has_man: 0,
    has_pad: 0,
    has_padpak: 0,
    has_ped_key: 0,
    has_ped_pad: 0,
    has_pedpak: 0,
    id: 0,
    image_file_name: "",
    model_name: "",
    model_partnumber: null,
    modified_by_id: null,
    modified_date: null,
    semi: 0,
    accessory_type: "",
  };

  const AccessoryTypeList = {
    has_9v: "Battery",
    has_10pk: "Battery",
    has_battery: "Battery",
    has_installby: "Battery",
    has_man: "Battery",
    has_chargepak: "Charge Pak",
    has_pad: "Pad",
    has_padpak: "Pad Pak",
    has_ped_pad: "Pediatric Pad",
    has_pedpak: "Pediatric Pad Pak",
  }

  const [siteData, setSiteData] = useState([]);
  const [models, setModels] = useState([]);
  const [subModels, setSubModels] = useState([]);
  const [defaultFromData, setDefaultfromData] = useState(DefaultValue);
  // const [partName,setPartName] = useState()
  const [partDetails, setPartDetails] = useState({});
  const [selectedModelData, setSelectedModelData ] = useState();
  const [accessTypeList, setAccessTypeList ] = useState();
  const selected_model = useSelector(
    (state) => state.AED_manager.selected_model
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if(selectedModelData){
   // Compare AccessoryTypeList object to Default value object
const valuesWithOneValue = Object.keys(selectedModelData)
.filter((key) => AccessoryTypeList[key] && selectedModelData[key] === 1)
.map((key) => AccessoryTypeList[key]);

console.log(valuesWithOneValue)
if(valuesWithOneValue){
  setAccessTypeList(valuesWithOneValue)
}
console.log(valuesWithOneValue);
  }  },[selectedModelData])

  console.log(accessTypeList)

  const GetSite = async (e) => {
    let name = e.target.name;
    let val = e.target.value;
    setFormData((old) => ({ ...old, [name]: parseInt(val) }));
    setDefaultfromData((old) => ({ ...old, [name]: parseInt(val) }));
    FetChFetchInfo(val);
  };

  const FetChFetchInfo = async (id) => {
    if (!id) {
      return "";
    }
    let fetchAccData = await AccountSiteList(id);
    let resSiteData = fetchAccData?.site_details || [];
    setSiteData(resSiteData);
  };

  const handleBrandChange = async (name, bId) => {
    if (!bId) {
      return "";
    }
    const fd = { ...formData };
    fd[name] = bId;
    fd.model_name = "";
    fd.file_name = "";
    fd.part_number = "";
    fd.sub_model = "";
    setFormData(fd);
    setDefaultfromData(fd);
    let ModelRes = await GetAedModelsByBrandId(bId);
    let modelResult = ModelRes?.data || [];
    setPermission(default_conditoions);
    dispatch(updatePermission(default_conditoions));
    setModels(modelResult);
  };
  const [warentyYear, setWarentyYear] = useState(0);
  const handleModelChange = async (name, ModelId) => {
    if (!ModelId) {
      return "";
    }
    const fd = { ...formData, ...modelResetValues }; //{...defaultFromData};//DefaultValue;//{...formData};
    let partDetails = models.find(
      (item) => parseInt(item.id) === parseInt(ModelId)
    );
    setWarentyYear(partDetails?.warranty);
    fd[name] = ModelId;
    fd.file_name = partDetails?.image_file_name;
    fd.part_number = partDetails?.model_partnumber;
    fd.sub_model = "";
    setFormData(fd);
    setDefaultfromData(fd);
    let ModelRes = await GetAedSumModelsById(ModelId);
    let modelResult = ModelRes?.data || [];
    setPermission(partDetails);
    setSelectedModelData(partDetails);
    console.log(partDetails)
    dispatch(updatePermission(partDetails));
    setSubModels(modelResult);
  };

  const handlesubModel = (e) => {
    let ModelId = e.target.value;
    let name = e.target.name;
    const fd = { ...formData };

    if (!ModelId) {
      fd[name] = ModelId;
      setFormData(fd);
      setDefaultfromData(fd);
      return "";
    }
    // setFormData((old) => ({ ...old, [ name ]: ModelId }));
    let list = subModels.find((item) => item.id === parseInt(ModelId));
    if (list?.sub_model_part_number) {
      fd.part_number = list?.sub_model_part_number;
    }
    fd[name] = ModelId;
    setFormData(fd);
    setDefaultfromData(fd);
    // setPermission(list);
    setPartDetails(list);
  };

  const handleInput = (e) => {
    let val = e.target.value;
    let name = e.target.name;
    setFormData((old) => ({ ...old, [name]: val }));
    setDefaultfromData((old) => ({ ...old, [name]: val }));
  };

  const handleDateChange = (name, val) => {
    const fd = { ...formData };
    if (name === "purchase_date") {
      let warenty_date = moment(val).add(warentyYear, "years").calendar();
      fd.warenty_date = warenty_date;
    }
    fd[name] = val;
    setFormData(fd);
    setDefaultfromData(fd);
  };

  const handleSelectChange = (data, name) => {
    setFormData((old) => ({ ...old, [name]: data.value }));
  };

  // handle For Edits
  const handleEditBrandGetModal = async (id) => {
    let ModelRes = await GetAedModelsByBrandId(id);
    let modelResult = ModelRes?.data || [];
    // setPermission(default_conditoions);
    // setPermission((old) => ({...old, ...PermissinsData}));

    setModels(modelResult);
    setTimeout(() => {
      handleEditModalGetSubModal(formData?.model_name, modelResult);
    }, 3000);
  };

  const handleEditModalGetSubModal = async (ModelId, modelData) => {
    let partDetails = modelData.find(
      (item) => parseInt(item.id) === parseInt(ModelId)
    );
    setWarentyYear(partDetails?.warranty);
    let ModelRes = await GetAedSumModelsById(ModelId);
    let modelResult = ModelRes?.data || [];
    // setPermission(partDetails);
    setPermission((old) => ({ ...old, ...partDetails }));
    dispatch(updatePermission(partDetails));
    setSubModels(modelResult);
  };

  useEffect(() => {
    if (is_edit) {
      handleEditBrandGetModal(formData?.brand);
    }
    FetChFetchInfo(formData?.account_id);
  }, []);

  const isModelSelected = formData.model_name !== "";

  useEffect(() =>{
   if(isModelSelected){
    setFormData((prevFormData) => ({
      ...prevFormData,
      accessory_type: "",
    }));
   }
  },[isModelSelected])

  const handleAccessoryTypeDropdownChange = (event) => {
    const selectedValue = event.target.value;
    const isAccessoryTypeChanging = selectedValue !== formData.accessory_type;
  
    setFormData((prevFormData) => {
      const updatedFormData = {
        ...prevFormData,
        accessory_type: selectedValue,
      };
  
      const accessoryArrays = ['has_man', 'has_9v', 'has_10pk', 'has_battery', 'has_installby', 'ChargePakInformation',
      'AdultPadInformation', 'AdultPadPakInfo',
      'PediatricPadInformation', 'PediatricPakPadInformation' ];
  
      if (isAccessoryTypeChanging) {
        accessoryArrays.forEach((arrayName) => {
          if (!Array.isArray(updatedFormData[arrayName])) {
            updatedFormData[arrayName] = [];
          }
  
          // Empty each key's value in each object of the array
          updatedFormData[arrayName] = updatedFormData[arrayName].map((item) => {
            const updatedItem = {};
            for (const key in item) {
              updatedItem[key] = '';
            }
            return updatedItem;
          });
        });
      }
  
      return updatedFormData;
    });
  
    // Dispatch the updated accessory type to the Redux store
    const updatedPermission = {
      ...PermissionRedux,
      accessory_type: selectedValue,
    };
  
    dispatch(updatePermission(updatedPermission));
  };

  const handleCheckBox = (toggleName) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [toggleName]: prevFormData[toggleName] === 1 ? 0 : 1,
    }));
  };


  return (
    <>
      <div className=" bg-gray py-4 px-4 my-2">
        <h2 className="heading">General Information</h2>

        <div className="row mt-4">
          <div className="col-md-9 row">
            <div className="col form-group">
              <label className="my-2" htmlFor="account_list">
                Account*{" "}
              </label>
              <select
                className="form-control"
                id="account_list"
                name="account_id"
                value={formData?.account_id}
                onChange={GetSite}
                required
                disabled={is_edit}
              >
                <option value="" key={0} selected>
                  --Select One--
                </option>
                {AccountList?.map((item, key) => (
                  <option
                    key={key + 1}
                    value={item?.account_id}
                    selected={
                      parseInt(formData?.account) === item?.account_id
                        ? true
                        : false
                    }
                  >
                    {item?.account_name}
                  </option>
                ))}
              </select>
              <Form.Control.Feedback type="invalid">
                {" "}
                Please Select Site.
              </Form.Control.Feedback>
            </div>

            <div className="col form-group">
              <label className="my-2" htmlFor="account_site_list">
                Site*
              </label>
              <select
                className="form-control"
                id="account_site_list"
                name="site_id"
                value={formData?.site_id}
                onChange={handleInput}
                required
                disabled={is_edit}
              >
                <option value="" selected key={0}>
                  --Select One--
                </option>
                <option value="0" selected>
                  Pending
                </option>
                {siteData?.map((item, index) => (
                  <option
                    key={index + 2}
                    value={item?.account_site_info_id}
                    selected={
                      parseInt(formData?.site_id) === item?.account_site_info_id
                        ? true
                        : false
                    }
                  >
                    {item?.account_site_name}
                  </option>
                ))}
              </select>
              <Form.Control.Feedback type="invalid">
                {" "}
                Please Select Site.
              </Form.Control.Feedback>
            </div>
            {/* <div className="cleafix"></div> */}
            <div className="col">
              <label className="my-2" htmlFor="brandDropdown">
                Brand*
              </label>
              <select
                id="brandDropdown"
                className="form-control"
                onChange={(e) => {
                  handleBrandChange("brand", e.target.value);
                }}
                name="brand"
                value={formData?.brand}
                required
              >
                <option value="" selected>
                  --Select One--
                </option>
                {BrandList.map((brand, index) => (
                  <option key={index + 1} value={brand?.id}>
                    {brand?.AED_brands}
                  </option>
                ))}
              </select>
              <Form.Control.Feedback type="invalid">
                {" "}
                Please Select Brand.
              </Form.Control.Feedback>
            </div>
            <div className="col-md-3">
              <label className="my-2" htmlFor="modelDropdown">
                Model*
              </label>
              <select
                id="modelDropdown"
                className="form-control"
                onChange={(e) => {
                  handleModelChange("model_name", e.target.value);
                }}
                name="model_name"
                value={formData?.model_name}
                required
              >
                <option value="" key={0} selected>
                  --Select One--
                </option>
                {models.map((model, index) => (
                  <option key={index + 1} value={model?.id}>
                    {model?.model_name}
                  </option>
                ))}
              </select>
              <Form.Control.Feedback type="invalid">
                {" "}
                Please Select Model.
              </Form.Control.Feedback>
            </div>
          </div>
    

             <div className="col">
               <label className="my-2" htmlFor="modelDropdown">
               Accessory Type*
               </label>
               <select
                 id="modelDropdown"
                 className="form-control"
                 name="accessory_type"
                 value={formData?.accessory_type}
                 onChange={handleAccessoryTypeDropdownChange}
                 required
                 disabled={!isModelSelected}
               >
                <option value="" selected>
                  --Select One--
                </option>
                {accessTypeList &&
                Array.from(new Set(accessTypeList))
                  .sort((a, b) => a.localeCompare(b)) 
                  .map((accessoryType) => (
                    <option key={accessoryType} value={accessoryType}>
                      {accessoryType}
                    </option>
                  ))}
               </select> 
              <Form.Control.Feedback type="invalid">
                {" "}
                Please Select Accessory Type.
              </Form.Control.Feedback>
              </div>

             <div className="col">
       <Form.Group>
              <b className={"d-block mb-3"}>DNI</b>
              <div className="my-2">
                <CustomToggleButton
                  ToggleName="dni"
                  ToggleValue={formData?.dni}
                  changeHandler={()=>handleCheckBox("dni")}
             />
              </div>
            </Form.Group>
      </div>
        </div>

      
      </div>
    </>
  );
}

export default StdlnGeneralInfo;
