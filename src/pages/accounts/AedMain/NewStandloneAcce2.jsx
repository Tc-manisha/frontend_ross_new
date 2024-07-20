import { useEffect, useState, useRef } from "react";
import { Form,Stack } from "react-bootstrap"
import SubHeading from "../../../components/header/SubHeading";
import moment from "moment";
import CustomToggleButton from "../../../components/common/toggleSwitch/CustomToggleButton";
import CommonDatePicker from "../../../components/common/date-picker/CommonDatePicker";
import { AccountSiteList, BatteryTypebyModel, GetAccountList, GetAedBrands, GetAedModelsByBrandId, PadTypeByModal } from "../../../helper/BasicFn";
import { updatePermission } from "../../../redux/slices/StandloneAEDSlice";
import { useDispatch, useSelector } from "react-redux";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { CalendarIcon } from "../../../helper/Common";
import { TextField } from "@mui/material";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify";
import { CallGETAPI, CallPOSTAPI } from "../../../helper/API";

const NewStandloneAcce2 = () => {

   const DefaultValue = {
        "account_id":"",
        "site_id":"",
        "accessory_type":"",
        "brand":"",
        "model":"",
        "dni":0,
      "batteries":[
        {"site_id":"","dni":"","section_name":"Battery Information","is_spare":"","battery_type_id":"","battery_expiration":"","battery_lot":"","battery_udi":"","battery_serial":"","charge_pak_uid":"","charge_pak_pad_1_id":"","charge_pak_pad_2_id":"","install_9v_date":"","install_before_date":"","install_date":"","manufactured_date":"","created_by_id":"1","created_date":"","modified_by_id":"","modified_date":"","deleted_by_id":"","deleted_date":"","active":"","quantity":""},
        {"site_id":"","dni":"","section_name":"Battery Information with 9 Volt","is_spare":"","battery_type_id":"","battery_expiration":"","battery_lot":"","battery_udi":"","battery_serial":"","charge_pak_uid":"","charge_pak_pad_1_id":"","charge_pak_pad_2_id":"","install_9v_date":"","install_before_date":"","install_date":"","manufactured_date":"","created_by_id":"1","created_date":"","modified_by_id":"","modified_date":"","deleted_by_id":"","deleted_date":"","active":"","quantity":""},
        {"site_id":"","dni":"","section_name":"Battery Information with Install By Date","is_spare":"","battery_type_id":"","battery_expiration":"","battery_lot":"","battery_udi":"","battery_serial":"","charge_pak_uid":"","charge_pak_pad_1_id":"","charge_pak_pad_2_id":"","install_9v_date":"","install_before_date":"","install_date":"","manufactured_date":"","created_by_id":"1","created_date":"","modified_by_id":"","modified_date":"","deleted_by_id":"","deleted_date":"","active":"","quantity":""},
        {"site_id":"","dni":"","section_name":"Battery Information with Manufactured Date","is_spare":"","battery_type_id":"","battery_expiration":"","battery_lot":"","battery_udi":"","battery_serial":"","charge_pak_uid":"","charge_pak_pad_1_id":"","charge_pak_pad_2_id":"","install_9v_date":"","install_before_date":"","install_date":"","manufactured_date":"","created_by_id":"1","created_date":"","modified_by_id":"","modified_date":"","deleted_by_id":"","deleted_date":"","active":"","quantity":""},
        {"site_id":"","dni":"","section_name":"Battery Information 10 Pack","is_spare":"","battery_type_id":"","battery_expiration":"","battery_lot":"","battery_udi":"","battery_serial":"","charge_pak_uid":"","charge_pak_pad_1_id":"","charge_pak_pad_2_id":"","install_9v_date":"","install_before_date":"","install_date":"","manufactured_date":"","created_by_id":"1","created_date":"","modified_by_id":"","modified_date":"","deleted_by_id":"","deleted_date":"","active":"","quantity":""},
      ],
      "chargePakInfo":[
        {"chargepak_battery_type_id":"","charge_pak_udi":"","battery_expiration":"","battery_lot":"","quantity":"","section_name":"Charge pak info","charge_pad1_part":"","charge_pad1_expiration":"","charge_pad1_lot":"","charge_pad2_part":"","charge_pad2_expiration":"","charge_pad2_lot":""},
      ],
     "pads":[
        { "site_id": "", "dni": "", "is_spare": "", "is_pediatric": "", "section_name": "Adult Pad Information", "pad_type_id": "", "pad_expiration": "", "pad_lot": "", "pad_udi": "", "created_by_id": "1", "created_date": "", "modified_by_id": "", "modified_date": "", "deleted_by_id": "", "deleted_date": "", "active": "", "quantity": "" },
        { "site_id": "", "dni": "", "is_spare": "", "is_pediatric": "", "section_name": "Adult Pad-Pak Information", "pad_type_id": "", "pad_expiration": "", "pad_lot": "", "pad_udi": "", "created_by_id": "1", "created_date": "", "modified_by_id": "", "modified_date": "", "deleted_by_id": "", "deleted_date": "", "active": "", "quantity": "" },
        { "site_id": "", "dni": "", "is_spare": "", "is_pediatric": "", "section_name": "Pediatric Pad Information", "pad_type_id": "", "pad_expiration": "", "pad_lot": "", "pad_udi": "", "created_by_id": "1", "created_date": "", "modified_by_id": "", "modified_date": "", "deleted_by_id": "", "deleted_date": "", "active": "", "quantity": "" },
        { "site_id": "", "dni": "", "is_spare": "", "is_pediatric": "", "section_name": "Pediatric-Pak Information", "pad_type_id": "", "pad_expiration": "", "pad_lot": "", "pad_udi": "", "created_by_id": "1", "created_date": "", "modified_by_id": "", "modified_date": "", "deleted_by_id": "", "deleted_date": "", "active": "", "quantity": "" },

     ]
    }

  const [BrandList, setBrandData ] = useState([]);
  const [models, setModels ] = useState([]);
  const [formData, setFormData ] = useState(DefaultValue);
  const [AccountList, setaccLidatData] = useState([]);
  const [siteData, setSiteData] = useState([]);
  const [BatteryList, setBatteryList] = useState([]);
  const [padList, setPadList] = useState([]);
  const [padCondi, setPadCondi ] = useState("");
  const [validated, setValidated ] = useState(false);
  const formRef = useRef(null);

  const fetchLoad = async() => {
    let AccoutnList = await GetAccountList();
    let brandList = await GetAedBrands();

    let bradlistData = brandList?.data || [];
    let accListData = AccoutnList?.data?.data?.account || [];

    setaccLidatData(accListData);
    setBrandData(bradlistData);
  }

  useEffect(() => {
    fetchLoad();
  },[])

  const GetSite = async (e) => {
    let name = e.target.name;
    let val = e.target.value;
    
    setFormData((old) => ({ ...old, [name]: parseInt(val) }));
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

  const handleInput = (e) => {
    let val = e.target.value;
    let name = e.target.name;
    setFormData((old) => ({ ...old, [name]: val }));
  };

  const getBatteryType = async () => {
    let betteryData = await BatteryTypebyModel(formData?.model_name);
console.log(betteryData)
    if (betteryData) {
        console.log(betteryData)
      setBatteryList(betteryData);
    }
  };

  const fetchAEDPads = async () => {
    let result = await PadTypeByModal(formData?.model_name);
    setPadList(result);
  };

  useEffect(() => {
    console.log(formData?.model_name)
    if (formData?.model_name) {
      getBatteryType();
      fetchAEDPads();
    }
  }, [formData.model_name]);

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
    // setDefaultfromData(fd);
    let ModelRes = await GetAedModelsByBrandId(bId);
    let modelResult = ModelRes?.data || [];
    setModels(modelResult);
  }

 useEffect(() => {
  handleBrandChange();
 },[])

  const handleModelChange = async (name, ModelId) => {
    if (!ModelId) {
      return "";
    }
    const fd = { ...formData};
    let partDetails = models.find(
      (item) => parseInt(item.id) === parseInt(ModelId)
    );
    fd[name] = ModelId;
    setFormData(fd);
    console.log(partDetails)
  }

  // const PermissionRedux = useSelector(
  //   (state) => state?.StandloneAED_manager?.permissions
  // );

  const handleAccessoryTypeDropdownChange = (event) => {
    const selectedValue = event.target.value;
   console.log(selectedValue)
    setFormData((prevFormData) => ({
      ...prevFormData,
      accessory_type: selectedValue,
    }));
  };

  const handleCheckBox = (toggleName) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [toggleName]: prevFormData[toggleName] === 1 ? 0 : 1,
    }));
  };

const handleCalendarChange = (value, fieldName,index,type) => {
  let date = value?.$D;
  date = date < 10 ? "0" + date : date;
  let month = value?.$M;
  month = parseInt(month + 1);
  month = month < 10 ? "0" + month : month;
  let year = value?.$y;

  // Format the date as MM/DD/YYYY
  let dateValue = month + "/" + date + "/" + year;

   let updatedData;
  setFormData((prevFormData) => {
    if(type == "Battery") {
       updatedData = [...prevFormData.batteries];
    } else if(type == "Pad"){
      updatedData = [...prevFormData.pads];
    }else {
      updatedData = [...prevFormData.chargePakInfo];
    }
   
    updatedData[index] = {
      ...updatedData[index],
      [fieldName]: dateValue,
    };

    return {
      ...prevFormData,
      batteries: type === "Battery" ? updatedData : prevFormData.batteries,
      pads: type === "Pad" ? updatedData : prevFormData.pads,
      chargePakInfo: type === "ChargePak" ? updatedData : prevFormData.chargePakInfo,
    };
  });
};

  const handleInputChange = (e, keyName, index, type) => {
    const selectedValue = e.target.value;
    
    let updatedData;
    setFormData((prevFormData) => {
      if (type === "Battery") {
        updatedData = [...prevFormData.batteries];

      } else if (type === "Pad") {
        updatedData = [...prevFormData.pads];

      } else {

        if(keyName==='chargepak_battery_type_id'){
          let findPadKey = BatteryList.find((item)=> item.battery_type_id===parseInt(selectedValue)) 
         if(findPadKey){
            setPadCondi(findPadKey?.pad_qty);
            console.log(findPadKey?.pad_qty)
          }}

        updatedData = [...prevFormData.chargePakInfo];
      }
      updatedData[index] = {
        ...updatedData[index],
        [keyName]: selectedValue,
      };
  
      return {
        ...prevFormData,
        batteries: type === "Battery" ? updatedData : prevFormData.batteries,
        pads: type === "Pad" ? updatedData : prevFormData.pads,
        chargePakInfo: type === "ChargePak" ? updatedData : prevFormData.chargePakInfo,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
 
    if(!formData.account_id || !formData.site_id
      || !formData.brand 
      || !formData.model_name
      || !formData.accessory_type) {
      setValidated(true);
      formRef.current.scrollIntoView({ behavior: 'smooth' });
      return;
      }
    console.log(formData)
    const res = await CallPOSTAPI("account/create-standalone" , formData);
    console.log(res);
    toast.success("Standalone Accessory Saved Succefully");
  }

    return(<>
      <div className="mt-4" style={{ paddingInline: "45px" }}>
        <Form
          class=""
          ref={formRef}
          onSubmit={handleSubmit}
          noValidate
          validated={validated}
          id="create-new-account-form"
        >
           <SubHeading
            title="New Standalone Accessory"
            subHeading={true}
            hideNew={true}
            hideHierarchy={true}
            bottomLinks={false}
          />

    <div className="row bg-gray py-4 px-4 my-2">
        <h2 className="heading">General Information</h2>

        <div className="row">
          {/* <div className="row"> */}
            <div className="col my-2 form-group">
              <label className="my-2" htmlFor="account_list">
                Account*{" "}
              </label>
              <select
                 className={`form-control`}
                 id="account_list"
                name="account_id"
                value={formData?.account_id}
                onChange={GetSite}
                required
                // disabled={is_edit}
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
               Please Select Site.
             </Form.Control.Feedback> 
            </div>

            <div className="col my-2 form-group">
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
                // disabled={is_edit}
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
            <div className="col my-2">
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
            <div className="col my-2">
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
            <div className="col my-2">
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
              >
                <option value="" selected>
                  --Select One--
                </option>
                <option value="AED">AED</option>
                <option value="Accessory">Accessory</option>
              </select> 
              <Form.Control.Feedback type="invalid">
                {" "}
                Please Select Accessory Type.
              </Form.Control.Feedback>
              </div>
            <div className="col my-3">
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
           
        
          {formData.batteries && formData.batteries.map((item,index) => (<> 
          {item.section_name === "Battery Information" && (<> 
            <div key={index} className="row bg-gray py-4 px-4 my-2">
        <h2 className="heading">Battery Information</h2>
            
            <div className='col form-group' style={{maxWidth:"300px"}}>
            <label htmlFor="">Battery Part #</label>
            <select name="battery_type_id"
             value={item.battery_type_id}
             class="form-control"
             onChange={(e)=>handleInputChange(e,"battery_type_id",index,"Battery")}
            // disabled={is_readonly}
            >
              <option value="" key={0}  selected >--Select One--</option>
              {BatteryList?.map((item,index)=>(
              <option value={item?.battery_type_id} key={index+1} >{item?.battery_part_number}</option>
              ))}
            </select>
          </div>

          <div className="col form-group">
        <label htmlFor="">Battery Expiration</label>
        <div className="d-flex align-items-center calendar-input-btn">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Stack spacing={3}>
            <DesktopDatePicker
             label=""
              name={"battery_expiration"}
              components={{
                OpenPickerIcon: CalendarIcon,
              }}
              value={item.battery_expiration}
              onChange={(newValue) => handleCalendarChange(newValue,"battery_expiration",index,"Battery")}
              renderInput={(params) => (
                <TextField
                  className="form-control"
                  {...params}
                  error={false}
                />
              )}
            />
          </Stack>
        </LocalizationProvider>
        </div>
      </div>

          <div className="col form-group">
            <label htmlFor="">Battery lot</label>
            <input
              className="form-control"
              type="text"
              id=""
              name="battery_lot"
              value={item.battery_lot}
              onChange={(e) => handleInputChange(e,"battery_lot",index,"Battery")}
            //   disabled={is_unknowntrue}
            />
          </div>

          <div className="col form-group">
            <label htmlFor="">Battery UDI</label>
            <input
              className="form-control"
              type="text"
              id=""
              name="battery_udi"
              value={item.battery_udi}
              onChange={(e) => handleInputChange(e, "battery_udi",index,"Battery")}
            //   disabled={is_unknowntrue}
            />
          </div>

          <div className="col form-group">
            <label htmlFor="">Qty</label>
            <input
              className="form-control"
              type="text"
              id=""
              name="quantity"
              value={item.quantity}
              onChange={(e) => handleInputChange(e, "quantity",index,"Battery")}
            //   disabled={is_unknowntrue}
             /> 
          </div>
          </div>
          </>)}
          
         {item.section_name === "Battery Information with 9 Volt" && (<> 
           <div key={index} className="row bg-gray py-4 px-4 my-2">
        <h2 className="heading">Battery Information with 9 Volt</h2>

            <div className='col form-group' style={{maxWidth:"300px"}}>
            <label htmlFor="">Battery Part #</label>
            <select name="battery_type_id"
              value={item.battery_type_id}
              class="form-control"
              onChange={(e)=>handleInputChange(e,"battery_type_id",index,"Battery")}
             // disabled={is_readonly}
            >
              <option value="" key={0}  selected >--Select One--</option>
              {BatteryList?.map((item,index)=>(
              <option value={item?.battery_type_id} key={index+1} >{item?.battery_part_number}</option>
              ))}
            </select>
          </div>

          <div className="col form-group">
        <label htmlFor="">Battery Expiration</label>

        <div className="d-flex align-items-center calendar-input-btn">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Stack spacing={3}>
            <DesktopDatePicker
             label=""
              name={"battery_expiration"}
              components={{
                OpenPickerIcon: CalendarIcon,
              }}
              value={item.battery_expiration}
              onChange={(newValue) => handleCalendarChange(newValue,"battery_expiration",index,"Battery")}
              renderInput={(params) => (
                <TextField
                  className="form-control"
                  {...params}
                  error={false}
                />
              )}
            />
          </Stack>
        </LocalizationProvider>
        </div>
      </div>

          <div className="col form-group">
            <label htmlFor="">Battery lot</label>
            <input
              className="form-control"
              type="text"
              id=""
              name="battery_lot"
              value={item.battery_lot}
              onChange={(e) => handleInputChange(e,"battery_lot",index,"Battery")}
            />
          </div>

          <div className="col form-group">
            <label htmlFor="">Battery UDI</label>
            <input
              className="form-control"
              type="text"
              id=""
              name="battery_udi"
              value={item.battery_udi}
              onChange={(e) => handleInputChange(e, "battery_udi",index,"Battery")}
            //   disabled={is_unknowntrue}
           />
          </div>

          <div className="col form-group">
        <label htmlFor="">9v Install Date</label>
        <div className="d-flex align-items-center calendar-input-btn">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Stack spacing={3}>
            <DesktopDatePicker
             label=""
              name={"install_9v_date"}
              components={{
                OpenPickerIcon: CalendarIcon,
              }}
              value={item.install_9v_date}
              onChange={(newValue) => handleCalendarChange(newValue,"install_9v_date",index,"Battery")}
              renderInput={(params) => (
                <TextField
                  className="form-control"
                  {...params}
                  error={false}
                />
              )}
            />
          </Stack>
        </LocalizationProvider>
        </div>
      </div>

          <div className="col form-group">
            <label htmlFor="">Qty</label>
            <input
              className="form-control"
              type="text"
              id=""
              name="quantity"
              value={item.quantity}
              onChange={(e) => handleInputChange(e, "quantity",index,"Battery")}
            //   disabled={is_unknowntrue}
               />
          </div>
          </div>
          </>)}
       

          {item.section_name === "Battery Information with Install By Date" && (<>
          <div key={index} className="row bg-gray py-4 px-4 my-2">
        <h2 className="heading">Battery Information with Install By Date</h2>

        <div className='col form-group' style={{maxWidth:"300px"}}>
            <label htmlFor="">Battery Part #</label>
            <select name="battery_type_id"
              value={item.battery_type_id}
              class="form-control"
              onChange={(e)=>handleInputChange(e,"battery_type_id",index,"Battery")}
             // disabled={is_readonly}
             // disabled={is_readonly}
            >
              <option value="" key={0}  selected >--Select One--</option>
              {BatteryList?.map((item,index)=>(
              <option value={item?.battery_type_id} key={index+1} >{item?.battery_part_number}</option>
              ))}
            </select>
          </div>

          <div className="col form-group">
        <label htmlFor="">Install Before Date</label>
        <div className="d-flex align-items-center calendar-input-btn">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Stack spacing={3}>
            <DesktopDatePicker
             label=""
              name={"install_before_date"}
              components={{
                OpenPickerIcon: CalendarIcon,
              }}
              value={item.install_before_date}
              onChange={(newValue) => handleCalendarChange(newValue,"install_before_date",index,"Battery")}
              renderInput={(params) => (
                <TextField
                  className="form-control"
                  {...params}
                  error={false}
                />
              )}
            />
          </Stack>
        </LocalizationProvider>
        </div>
      </div>

          <div className="col form-group">
            <label htmlFor="">Battery lot</label>
            <input
              className="form-control"
              type="text"
              id=""
              name="battery_lot"
              value={item.battery_lot}
              onChange={(e) => handleInputChange(e,"battery_lot",index,"Battery")}
            />
          </div>

          <div className="col form-group">
            <label htmlFor="">Battery UDI</label>
            <input
              className="form-control"
              type="text"
              id=""
              name="battery_udi"
              value={item.battery_udi}
              onChange={(e) => handleInputChange(e, "battery_udi",index,"Battery")}
            //   disabled={is_unknowntrue}
            />
          </div>

          <div className="col form-group">
            <label htmlFor="">Serial #</label>
            <input
              className="form-control"
              type="text"
              id=""
              name="battery_serial"
              value={item.battery_serial}
              onChange={(e) => handleInputChange(e, "battery_serial",index,"Battery")}
            //   disabled={is_unknowntrue}
            />
          </div>

          <div className="col form-group">
            <label htmlFor="">Qty</label>
            <input
              className="form-control"
              type="text"
              id=""
              name="quantity"
              value={item.quantity}
              onChange={(e) => handleInputChange(e, "quantity",index,"Battery")}
            //   disabled={is_unknowntrue}
             />
          </div>
          </div>
          </>)}
          


          {item.section_name === "Battery Information with Manufactured Date" && (<>
          <div key={index} className="row bg-gray py-4 px-4 my-2">
        <h2 className="heading">Battery Information with Manufactured Date</h2>

        <div className='col form-group' style={{maxWidth:"300px"}}>
            <label htmlFor="">Battery Part #</label>
            <select name="battery_type_id"
             value={item.battery_type_id}
             class="form-control"
             onChange={(e)=>handleInputChange(e,"battery_type_id",index,"Battery")}
            // disabled={is_readonly}
            >
              <option value="" key={0}  selected >--Select One--</option>
              {BatteryList?.map((item,index)=>(
              <option value={item?.battery_type_id} key={index+1} >{item?.battery_part_number}</option>
              ))}
            </select>
          </div>

          <div className="col form-group">
        <label htmlFor="">Manufactured Date</label>
        <div className="d-flex align-items-center calendar-input-btn">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Stack spacing={3}>
            <DesktopDatePicker
             label=""
              name={"manufactured_date"}
              components={{
                OpenPickerIcon: CalendarIcon,
              }}
              value={item.manufactured_date}
              onChange={(newValue) => handleCalendarChange(newValue,"manufactured_date",index,"Battery")}
              renderInput={(params) => (
                <TextField
                  className="form-control"
                  {...params}
                  error={false}
                />
              )}
            />
          </Stack>
        </LocalizationProvider>
        </div>
      </div>

          <div className="col form-group">
            <label htmlFor="">Battery lot</label>
            <input
              className="form-control"
              type="text"
              id=""
              name="battery_lot"
              value={item.battery_lot}
              onChange={(e) => handleInputChange(e,"battery_lot",index,"Battery")}
            //   disabled={is_unknowntrue}
             />
          </div>

          <div className="col form-group">
            <label htmlFor="">Battery UDI</label>
            <input
              className="form-control"
              type="text"
              id=""
              name="battery_udi"
              value={item.battery_udi}
              onChange={(e) => handleInputChange(e, "battery_udi",index,"Battery")}
            //   disabled={is_unknowntrue}
           />
          </div>

          <div className="col form-group">
            <label htmlFor="">Qty</label>
            <input
              className="form-control"
              type="text"
              id=""
              name="quantity"
              value={item.quantity}
              onChange={(e) => handleInputChange(e, "quantity",index,"Battery")}
            //   disabled={is_unknowntrue}
             />
          </div>
          </div>
          </>)}


          {item.section_name === "Battery Information 10 Pack" && (<>
           <div className="row bg-gray py-4 px-4 my-2">
        <h2 className="heading">Battery Information 10 Pack</h2>

        <div className='col form-group' style={{maxWidth:"300px"}}>
            <label htmlFor="">Battery Part #</label>
            <select name="battery_type_id"
              value={item.battery_type_id}
              class="form-control"
              onChange={(e)=>handleInputChange(e,"battery_type_id",index,"Battery")}
             // disabled={is_readonly}
             >
              <option value="" key={0}  selected >--Select One--</option>
              {BatteryList?.map((item,index)=>(
              <option value={item?.battery_type_id} key={index+1} >{item?.battery_part_number}</option>
              ))}
            </select>
          </div>

          <div className="col form-group" style={{maxWidth:"300px"}}>
        <label htmlFor="">Install Before Date</label>
        <div className="d-flex align-items-center calendar-input-btn">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Stack spacing={3}>
            <DesktopDatePicker
             label=""
              name={"install_before_date"}
              components={{
                OpenPickerIcon: CalendarIcon,
              }}
              value={item.install_before_date}
              onChange={(newValue) => handleCalendarChange(newValue,"install_before_date",index,"Battery")}
              renderInput={(params) => (
                <TextField
                  className="form-control"
                  {...params}
                  error={false}
                />
              )}
            />
          </Stack>
        </LocalizationProvider>
        </div>
      </div>

          <div className="col form-group" style={{maxWidth:"200px"}}>
            <label htmlFor="">Qty</label>
            <input
              className="form-control"
              type="text"
              id=""
              name="quantity"
              value={item.quantity}
              onChange={(e) => handleInputChange(e, "quantity",index,"Battery")}
            //   disabled={is_unknowntrue}
             />
          </div>
          </div>
          </>)}
          </>))} 


        {formData.chargePakInfo && formData.chargePakInfo.map((item,index)=>(<>
          {item.section_name === "Charge pak info" && (<>
          <div key={index} className="row bg-gray py-4 px-4 my-2">
        <h2 className="heading">Charge-Pak Information</h2>

        <div className='col form-group' style={{maxWidth:"300px"}}>
            <label htmlFor="">Charge-Pak Part #</label>
            <select name="chargepak_battery_type_id"
             value={item.chargepak_battery_type_id}
             class="form-control"
             onChange={(e)=>handleInputChange(e,"chargepak_battery_type_id",index,"ChargePak")}
            // disabled={is_readonly}
           >
              <option value="" key={0}  selected >--Select One--</option>
              {BatteryList?.map((item,index)=>(
              <option value={item?.battery_type_id} key={index+1} >{item?.battery_part_number}</option>
              ))}
            </select>
          </div>

          <div className="col form-group">
            <label htmlFor="">Charge-Pak UDI</label>
            <input
              className="form-control"
              type="text"
              id=""
              name="charge_pak_udi"
              value={item.charge_pak_udi}
              onChange={(e) => handleInputChange(e, "charge_pak_udi",index,"ChargePak")}
            //   disabled={is_unknowntrue}
            />
          </div>

          <div className="col form-group">
        <label htmlFor="">Battery Expiration</label>
        <div className="d-flex align-items-center calendar-input-btn">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Stack spacing={3}>
            <DesktopDatePicker
             label=""
              name={"battery_expiration"}
              components={{
                OpenPickerIcon: CalendarIcon,
              }}
              value={item.battery_expiration}
              onChange={(newValue) => handleCalendarChange(newValue,"battery_expiration",index,"ChargePak")}
              renderInput={(params) => (
                <TextField
                  className="form-control"
                  {...params}
                  error={false}
                />
              )}
            />
          </Stack>
        </LocalizationProvider>
        </div>
      </div>

          <div className="col form-group">
            <label htmlFor="">Battery lot</label>
            <input
              className="form-control"
              type="text"
              id=""
              name="battery_lot"
              value={item.battery_lot}
              onChange={(e) => handleInputChange(e,"battery_lot",index,"ChargePak")}
            //   disabled={is_unknowntrue}
            />
          </div>

          <div className="col form-group">
            <label htmlFor="">Qty</label>
            <input
              className="form-control"
              type="text"
              id=""
              name="quantity"
              value={item.quantity}
              onChange={(e) => handleInputChange(e, "quantity",index,"ChargePak")}
            //   disabled={is_unknowntrue}
             />
          </div>
          
          {padCondi ? (<> 
          <div className="row mt-3">
          <div className='col form-group' style={{maxWidth:"300px"}}>
            <label htmlFor="">Pad 1 Part #</label>
            <select name="charge_pad1_part"
            value={item.charge_pad1_part}
            class="form-control"
            onChange={(e)=>handleInputChange(e,"charge_pad1_part",index,"ChargePak")}
           // disabled={is_readonly}
            >
              <option value="" key={0}  selected >--Select One--</option>
              {padList?.map((item, index) => {
             if (item?.pediatric === 0) {
              return(
                <option
                  value={item?.pad_type_id}
                  key={index + 1}
                  className={item?.main ? "option-change" : ""}
                >
                  {item?.pad_part_number}
                </option>
              )}
           })}
            </select>
          </div>

          <div className="col form-group">
        <label htmlFor="">Pad 1 Expiration</label>
        <div className="d-flex align-items-center calendar-input-btn">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Stack spacing={3}>
            <DesktopDatePicker
             label=""
              name={"charge_pad1_expiration"}
              components={{
                OpenPickerIcon: CalendarIcon,
              }}
              value={item.charge_pad1_expiration}
              onChange={(newValue) => handleCalendarChange(newValue,"charge_pad1_expiration",index,"ChargePak")}
              renderInput={(params) => (
                <TextField
                  className="form-control"
                  {...params}
                  error={false}
                />
              )}
            />
          </Stack>
        </LocalizationProvider>
        </div>
      </div>

          <div className="col form-group">
            <label htmlFor="">Pad 1 Lot</label>
            <input
              className="form-control"
              type="text"
              id=""
              name="charge_pad1_lot"
              value={item.charge_pad1_lot}
              onChange={(e) => handleInputChange(e,"charge_pad1_lot",index,"ChargePak")}
            //   disabled={is_unknowntrue}
             />
          </div>

          </div>
          </>) : ""}

          {parseInt(padCondi) === 2 ? (<> 
          <div className="row mt-3">
          <div className='col form-group' style={{maxWidth:"300px"}}>
            <label htmlFor="">Pad 2 Part #</label>
            <select name="charge_pad2_part"
            value={item.charge_pad2_part}
            class="form-control"
            onChange={(e)=>handleInputChange(e,"charge_pad2_part",index,"ChargePak")}
           // disabled={is_readonly}
            >
              <option value="" key={0}  selected >--Select One--</option>
              {padList?.map((item, index) => {
             if (item?.pediatric === 0) {
              return(
                <option
                  value={item?.pad_type_id}
                  key={index + 1}
                  className={item?.main ? "option-change" : ""}
                >
                  {item?.pad_part_number}
                </option>
              )}
           })}
            </select>
          </div>

          <div className="col form-group">
        <label htmlFor="">Pad 2 Expiration</label>
        <div className="d-flex align-items-center calendar-input-btn">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Stack spacing={3}>
            <DesktopDatePicker
             label=""
              name={"charge_pad2_expiration"}
              components={{
                OpenPickerIcon: CalendarIcon,
              }}
              value={item.charge_pad2_expiration}
              onChange={(newValue) => handleCalendarChange(newValue,"charge_pad2_expiration",index,"ChargePak")}
              renderInput={(params) => (
                <TextField
                  className="form-control"
                  {...params}
                  error={false}
                />
              )}
            />
          </Stack>
        </LocalizationProvider>
        </div>
      </div>

          <div className="col form-group">
            <label htmlFor="">Pad 2 Lot</label>
            <input
              className="form-control"
              type="text"
              id=""
              name="charge_pad2_lot"
              value={item.charge_pad2_lot}
              onChange={(e) => handleInputChange(e,"charge_pad2_lot",index,"ChargePak")}
            //   disabled={is_unknowntrue}
              />
          </div>

          </div>
          </>) : ""}
          </div>      
          </>)}
           </>))}


        {formData.pads && formData.pads.map((item,index) => (<> 
             {item.section_name === "Adult Pad Information" && (<>
          <div className="row bg-gray py-4 px-4 my-2">
        <h2 className="heading">Adult Pad Information</h2>

        <div className='col form-group' style={{maxWidth:"300px"}}>
            <label htmlFor="">Adult Pad Part #</label>
            <select name="pad_type_id"
              value={item.pad_type_id}
              class="form-control"
              onChange={(e)=>handleInputChange(e,"pad_type_id",index,"Pad")}
             // disabled={is_readonly}
             >
           <option value="" key={0}  selected >--Select One--</option>
           {padList?.map((item, index) => {
             if (item?.pediatric === 0) {
              return(
                <option
                  value={item?.pad_type_id}
                  key={index + 1}
                  className={item?.main ? "option-change" : ""}
                >
                  {item?.pad_part_number}
                </option>
              )}
           })}
            </select>
          </div>

          <div className="col form-group">
        <label htmlFor="">Adult Pad Expiration</label>
        <div className="d-flex align-items-center calendar-input-btn">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Stack spacing={3}>
            <DesktopDatePicker
             label=""
              name={"pad_expiration"}
              components={{
                OpenPickerIcon: CalendarIcon,
              }}
              value={item.pad_expiration}
              onChange={(newValue) => handleCalendarChange(newValue,"pad_expiration",index,"Pad")}
              renderInput={(params) => (
                <TextField
                  className="form-control"
                  {...params}
                  error={false}
                />
              )}
            />
          </Stack>
        </LocalizationProvider>
        </div>
      </div>

          <div className="col form-group">
            <label htmlFor="">Adult Pad Lot</label>
            <input
              className="form-control"
              type="text"
              id=""
              name="pad_lot"
              value={item.pad_lot}
              onChange={(e) => handleInputChange(e,"pad_lot",index,"Pad")}
            //   disabled={is_unknowntrue}
            />
          </div>

          <div className="col form-group">
            <label htmlFor="">Adult Pad UDI</label>
            <input
              className="form-control"
              type="text"
              id=""
              name="pad_udi"
              value={item.pad_udi}
              onChange={(e) => handleInputChange(e,"pad_udi",index,"Pad")}
            //   disabled={is_unknowntrue}
           />
          </div>

          <div className="col form-group">
            <label htmlFor="">Qty</label>
            <input
              className="form-control"
              type="text"
              id=""
              name="quantity"
              value={item.quantity}
              onChange={(e) => handleInputChange(e,"quantity",index,"Pad")}
            //   disabled={is_unknowntrue}
            />
          </div>
          </div>
          </>)}

        {item.section_name === "Adult Pad-Pak Information" && (<> 
          <div key={index} className="row bg-gray py-4 px-4 my-2">
        <h2 className="heading">Adult Pad-Pak Information</h2>

        <div className='col form-group' style={{maxWidth:"300px"}}>
            <label htmlFor="">Adult Pad-Pak Part #</label>
            <select name="pad_type_id"
              value={item.pad_type_id}
              class="form-control"
              onChange={(e)=>handleInputChange(e,"pad_type_id",index,"Pad")}
             // disabled={is_readonly}
             >
           <option value="" key={0}  selected >--Select One--</option>
           {padList?.map((item, index) => {
             if (item?.pediatric === 0) {
              return(
                <option
                  value={item?.pad_type_id}
                  key={index + 1}
                  className={item?.main ? "option-change" : ""}
                >
                  {item?.pad_part_number}
                </option>
              )}
           })}
            </select>
          </div>

          <div className="col form-group">
        <label htmlFor="">Adult Pad-Pak Expiration</label>
        <div className="d-flex align-items-center calendar-input-btn">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Stack spacing={3}>
            <DesktopDatePicker
             label=""
              name={"pad_expiration"}
              components={{
                OpenPickerIcon: CalendarIcon,
              }}
              value={item.pad_expiration}
              onChange={(newValue) => handleCalendarChange(newValue,"pad_expiration",index,"Pad")}
              renderInput={(params) => (
                <TextField
                  className="form-control"
                  {...params}
                  error={false}
                />
              )}
            />
          </Stack>
        </LocalizationProvider>
        </div>
      </div>

          <div className="col form-group">
            <label htmlFor="">Adult Pad-Pak Lot</label>
            <input
              className="form-control"
              type="text"
              id=""
              name="pad_lot"
              value={item.pad_lot}
              onChange={(e) => handleInputChange(e,"pad_lot",index,"Pad")}
            //   disabled={is_unknowntrue}
           />
          </div>

          <div className="col form-group">
            <label htmlFor="">Adult Pad-Pak UDI</label>
            <input
              className="form-control"
              type="text"
              id=""
              name="pad_udi"
              value={item.pad_udi}
              onChange={(e) => handleInputChange(e,"pad_udi",index,"Pad")}
            //   disabled={is_unknowntrue}
           />
          </div>

          <div className="col form-group">
            <label htmlFor="">Qty</label>
            <input
              className="form-control"
              type="text"
              id=""
              name="quantity"
              value={item.quantity}
              onChange={(e) => handleInputChange(e,"quantity",index,"Pad")}
            //   disabled={is_unknowntrue}
           />
          </div>
          </div>
          </>)}
         

        {item.section_name === "Pediatric Pad Information" && (<> 
          <div className="row bg-gray py-4 px-4 my-2">
        <h2 className="heading">Pediatric Pad Information</h2>

        <div className='col form-group' style={{maxWidth:"300px"}}>
            <label htmlFor="">Pediatric Pad Part #</label>
            <select name="pad_type_id"
              value={item.pad_type_id}
              class="form-control"
              onChange={(e)=>handleInputChange(e,"pad_type_id",index,"Pad")}
             // disabled={is_readonly}
             >
           <option value="" key={0}  selected >--Select One--</option>
           {padList?.map((item, index) => {
             if (item?.pediatric === 1) {
              return(
                <option
                  value={item?.pad_type_id}
                  key={index + 1}
                  className={item?.main ? "option-change" : ""}
                >
                  {item?.pad_part_number}
                </option>
              )}
           })}
            </select>
          </div>

          <div className="col form-group">
        <label htmlFor="">Pediatric Pad Expiration</label>
        <div className="d-flex align-items-center calendar-input-btn">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Stack spacing={3}>
            <DesktopDatePicker
             label=""
              name={"pad_expiration"}
              components={{
                OpenPickerIcon: CalendarIcon,
              }}
              value={item.pad_expiration}
              onChange={(newValue) => handleCalendarChange(newValue,"pad_expiration",index,"Pad")}
              renderInput={(params) => (
                <TextField
                  className="form-control"
                  {...params}
                  error={false}
                />
              )}
            />
          </Stack>
        </LocalizationProvider>
        </div>
      </div>

          <div className="col form-group">
            <label htmlFor="">Pediatric Pad Lot</label>
            <input
              className="form-control"
              type="text"
              id=""
              name="pad_lot"
              value={item.pad_lot}
              onChange={(e) => handleInputChange(e,"pad_lot",index,"Pad")}
            //   disabled={is_unknowntrue}
            />
          </div>

          <div className="col form-group">
            <label htmlFor="">Pediatric Pad UDI</label>
            <input
              className="form-control"
              type="text"
              id=""
              name="pad_udi"
              value={item.pad_udi}
              onChange={(e) => handleInputChange(e,"pad_udi",index,"Pad")}
            //   disabled={is_unknowntrue}
           />
          </div>

          <div className="col form-group">
            <label htmlFor="">Qty</label>
            <input
              className="form-control"
              type="text"
              id=""
              name="quantity"
              value={item.quantity}
              onChange={(e) => handleInputChange(e,"quantity",index,"Pad")}
            //   disabled={is_unknowntrue}
            />
          </div>
          </div>
          </>)}
         

        {item.section_name === "Pediatric-Pak Information" && (<> 
          <div className="row bg-gray py-4 px-4 my-2">
        <h2 className="heading">Pediatric-Pak Information</h2>

        <div className='col form-group' style={{maxWidth:"300px"}}>
            <label htmlFor="">Pediatric-Pak Part #</label>
            <select name="pad_type_id"
              value={item.pad_type_id}
              class="form-control"
              onChange={(e)=>handleInputChange(e,"pad_type_id",index,"Pad")}
             // disabled={is_readonly}
             >
           <option value="" key={0}  selected >--Select One--</option>
           {padList?.map((item, index) => {
             if (item?.pediatric === 1) {
              return(
                <option
                  value={item?.pad_type_id}
                  key={index + 1}
                  className={item?.main ? "option-change" : ""}
                >
                  {item?.pad_part_number}
                </option>
              )}
           })}
            </select>
          </div>

          <div className="col form-group">
        <label htmlFor="">Pediatric-Pak Expiration</label>
        <div className="d-flex align-items-center calendar-input-btn">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Stack spacing={3}>
            <DesktopDatePicker
             label=""
              name={"pad_expiration"}
              components={{
                OpenPickerIcon: CalendarIcon,
              }}
              value={item.pad_expiration}
              onChange={(newValue) => handleCalendarChange(newValue,"pad_expiration",index,"Pad")}
              renderInput={(params) => (
                <TextField
                  className="form-control"
                  {...params}
                  error={false}
                />
              )}
            />
          </Stack>
        </LocalizationProvider>
        </div>
      </div>

          <div className="col form-group">
            <label htmlFor="">Pediatric-Pak Lot</label>
            <input
              className="form-control"
              type="text"
              id=""
              name="pad_lot"
              value={item.pad_lot}
              onChange={(e) => handleInputChange(e,"pad_lot",index,"Pad")}
            //   disabled={is_unknowntrue}
            />
          </div>

          <div className="col form-group">
            <label htmlFor="">Pediatric-Pak UDI</label>
            <input
              className="form-control"
              type="text"
              id=""
              name="pad_udi"
              value={item.pad_udi}
              onChange={(e) => handleInputChange(e,"pad_udi",index,"Pad")}
            //   disabled={is_unknowntrue}
           />
          </div>

          <div className="col form-group">
            <label htmlFor="">Qty</label>
            <input
              className="form-control"
              type="text"
              id=""
              name="quantity"
              value={item.quantity}
              onChange={(e) => handleInputChange(e,"quantity",index,"Pad")}
            //   disabled={is_unknowntrue}
            />
          </div>
          </div>
          </>)}
          </>))}

          <div className="row pb-3 py-5" >
            <div className="col-12 content-flex-right" >
              <button className="btn btn-danger text-uppercase" type="button" onClick={()=>navigate(-1)}>Cancel</button>
              <button className="btn btn-success text-uppercase ms-2" type="submit" >Submit</button>
            </div>
          </div>

        </Form>
        </div>
    </>)
}

export default NewStandloneAcce2;