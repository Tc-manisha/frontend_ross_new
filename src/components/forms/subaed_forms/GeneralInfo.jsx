import React, { useState, useEffect } from "react";
import "../../../../src/global.css"
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
import { updatePermission } from "../../../redux/slices/AEDSlice";
import PopEquipment from "../../../pages/accounts/Pop/PopEquipment";

function GeneralInfo({
  AccountList,
  formData,
  BrandList,
  setFormData,
  setPermission,
  Permissins,
  is_edit = false,
  DefaultValue,
  setAccId,
  AccId
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
        battery_uid: "",
        v9_install: "",
        install_before_date: "",
        date_installed: "",
        manufactured_date: "",
        battery_serial: "",
      },
    ],
    has_battery_spare: [],

    has_9v: [
      {
        battery_type_id: "",
        battery_expiration: "",
        battery_lot: "",
        battery_uid: "",
        v9_install: "",
        install_before_date: "",
        date_installed: "",
        manufactured_date: "",
        battery_serial: "",
      },
    ],

    has_9v_spare: [],

    has_installby: [
      {
        battery_type_id: "",
        battery_expiration: "",
        battery_lot: "",
        battery_uid: "",
        v9_install: "",
        install_before_date: "",
        date_installed: "",
        manufactured_date: "",
        battery_serial: "",
      },
    ],
    has_installby_spare: [],

    has_man: [
      {
        battery_type_id: "",
        battery_expiration: "",
        battery_lot: "",
        battery_uid: "",
        v9_install: "",
        install_before_date: "",
        date_installed: "",
        manufactured_date: "",
        battery_serial: "",
      },
    ],

    has_man_spare: [],

    has_10pk: [
      {
        battery_type_id: "",
        battery_expiration: "",
        battery_lot: "",
        battery_uid: "",
        v9_install: "",
        install_before_date: "",
        date_installed: "",
        manufactured_date: "",
        battery_serial: "",
      },
    ],
    has_10pk_spare: [],

    battery_info: [
      {
        battery_type_id: "",
        battery_expiration: "",
        battery_lot: "",
        battery_uid: "",
        v9_install: "",
        install_before_date: "",
        date_installed: "",
        manufactured_date: "",
        battery_serial: "",
      },
    ],

    spare_battery_info: [],

    battery_info1: [
      {
        battery_type_id: "",
        battery_expiration: "",
        battery_lot: "",
        battery_uid: "",
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
        charge_pak_uid: "",
        battery_expiration: "",
        battery_lot: "",
        pad_1_part: "",
        pad_1_expiration: "",
        pad_1_lot: "",
        pad_2_part: "",
        pad_2_expiration: "",
        pad_2_lot: "",
      },
    ],

    SpareChargePakInformation: [],

    AdultPadInformation: [
      {
        pad_part: "",
        pad_expiration: "",
        pad_lot: "",
        pad_udi: "",
      },
    ],

    SpareAdultPadInfo: [],

    AdultPadPakInfo: [
      {
        pad_part: "",
        pad_expiration: "",
        pad_lot: "",
        pad_udi: "",
      },
    ],

    SpareAdultPadPakInfo: [],

    PediatricPadInformation: [
      {
        pad_part: "",
        pad_expiration: "",
        pad_lot: "",
        pad_udi: "",
      },
    ],
    sparePadricPadInfo: [],
    PediatricPakPadInformation: [
      {
        pad_part: "",
        pad_expiration: "",
        pad_lot: "",
        pad_udi: "",
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
    useSbidInventory: [],
    useSpidInventory: [],
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
  };
  const [siteData, setSiteData] = useState([]);
  const [models, setModels] = useState([]);
  const [subModels, setSubModels] = useState([]);
  const [defaultFromData, setDefaultfromData] = useState(DefaultValue);
  // const [partName,setPartName] = useState()
  const [partDetails, setPartDetails] = useState({});
  const selected_model = useSelector(
    (state) => state.AED_manager.selected_model
  );
  const dispatch = useDispatch();

  const GetSite = async (e) => {
    setAccId(e.target.value);
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
    setPermission(partDetails); console.log(partDetails)
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

  const handleCheckBox = (e) => {
    if (e.target.type == "checkbox") {
      console.log({ checkBoxToCHec: e.target.type, name: e.target.name, chekdssa: e.target.checked });
      setFormData((old) => ({ ...old, [e.target.name]: e.target.checked ? 1 : 0 }));
      setDefaultfromData((old) => ({
        ...old,
        [e.target.name]: e.target.checked ? 1 : 0,
      }));
      // setDefaultfromData((old) => ({ ...old, [ name ]: val }));
    } else {
      setFormData((old) => ({ ...old, [e.target.name]: e.target.value }));
      setDefaultfromData((old) => ({
        ...old,
        [e.target.name]: e.target.value,
      }));
    }
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

  // useEffect(()=>{
  //     if(formData?.account){
  //         FetChFetchInfo(formData?.account);
  //     }
  // },[formData?.account])

  // useEffect(() => {
  //     if(formData?.brand) {
  //         handleBrandChange('brand', formData?.brand);
  //     }
  // },[formData?.brand])

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

  // console.log('AccountList: ', AccountList);

  return (
    <>
      <div className=" bg-gray py-4 px-4 my-2">
        <h2 className="heading">General Information</h2>

        <div className="row mt-4">
          <div className="col-md-9 row">
            <div className="col-md-6 form-group">
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

            <div className="col-md-6 form-group">
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
            <div className="cleafix"></div>
            <div className="col-md-3 my-2">
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
            <div className="col-md-3 my-2">
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
            {subModels.length > 0 ? (
              <div className="col-md-3 my-2">
                <label className="my-2" htmlFor="subModelDropdown">
                  Sub-Model
                </label>
                <select
                  id="subModelDropdown"
                  className="form-control"
                  name="sub_model"
                  onChange={handlesubModel}
                  value={formData?.sub_model}
                >
                  <option value="" key={0} selected>
                    --Select One--
                  </option>
                  {subModels.map((subModel, index) => (
                    <option key={index + 1} value={subModel.id}>
                      {subModel.sub_model_name}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="col-md-3 my-2"></div>
            )}
            <div className="col-md-3 my-2">
              <label className="my-2" htmlFor="subModelDropdown">
                Part #
              </label>
              <br />
              <b>{formData?.part_number ? formData?.part_number : <></>}</b>
            </div>

            <div className="col-md-3 my-2">
              <label htmlFor="">Serial #*</label>
              <input
                type="text"
                onChange={handleInput}
                value={formData?.serial_number}
                className="form-control"
                required
                name="serial_number"
              />
              <Form.Control.Feedback type="invalid">
                {" "}
                Please Enter Serial.
              </Form.Control.Feedback>
            </div>

            <div className="col-md-3 my-2">
              <label htmlFor="">Asset #</label>
              <input
                type="text"
                onChange={handleInput}
                value={formData?.asset}
                className="form-control"
                name="asset"
              />
            </div>
            {formData?.other1_lable ? (
              <div className="col-md-3 my-2">
                <label htmlFor="">{formData?.other1_lable}</label>
                <input
                  type="text"
                  onChange={handleInput}
                  value={formData?.other1}
                  className="form-control"
                  name="other1"
                />
              </div>
            ) : (
              ""
            )}
            {formData?.other2_lable ? (
              <div className="col-md-3 my-2">
                <label htmlFor="">{formData?.other2_lable}</label>
                <input
                  type="text"
                  onChange={handleInput}
                  value={formData?.other2}
                  className="form-control"
                  name="other2"
                />
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="col-3 text-right d-flex justify-content-end">
            <input
              type="hidden"
              name="file_name"
              value={formData?.file_name}
              onChange={handleInput}
            />
            {formData?.file_name ? (
              <img
                src={AED_IMG_BASE + formData?.file_name}
                className="file-image"
                style={{ width: 150 }}
              />
            ) : (
              <img
                src="/photo-image.svg"
                className="file-image"
                style={{ width: 150 }}
              />
            )}
          </div>
        
        <div className="AedToggleRow"> 
           
          <div className="AedGeneralField"> 
          <div className="col-mt-3 fieldwidth" >
            <label htmlFor="">Placement</label>
            <input
              type="text"
              onChange={handleInput}
              value={formData?.placement}
              className="form-control"
              name="placement"
            />
          </div>

          <div className="col-mt-3 fieldwidth" >
            <label htmlFor="">Purchase Type</label>
            <select
              className="form-control"
              name="purchase_type"
              value={formData?.purchase_type}
              onChange={handleInput}
            >
              <option value="" selected>
                --Select One--
              </option>
              <option value="Own">Own</option>
              <option value="Rental">Rental</option>
              <option value="Leased">Leased</option>
            </select>
            {/* <input type='text'  onChange={handleInput} value={formData?.purchase_type}  className='form-control'  /> */}
          </div>

          <div className="form-group col-mt-3" >
            <label htmlFor="">Purchase Date</label>
            <CommonDatePicker
              calName={"purchase_date"}
              CalVal={formData?.purchase_date}
              HandleChange={handleDateChange}
            />
            {/* <input type='date'  onChange={handleInput} value={formData?.purchase_date}  className='form-control' name="purchase_date"  /> */}
          </div>
          </div>

          <div className="AedGeneralToggle">
            <Form.Group>
              <b className={""}>Spares</b>
              <div className="mt-2">
                <CustomToggleButton
                  ToggleName="no_spares_toggle"
                  ToggleValue={formData?.no_spares_toggle}
                  changeHandler={handleCheckBox}
                />
              </div>
            </Form.Group>

            <Form.Group>
              <b className={""}>Pediatric</b>
              <div className="mt-2">
                <CustomToggleButton
                  ToggleName="no_pediatric_toggle"
                  ToggleValue={formData?.no_pediatric_toggle}
                  changeHandler={handleCheckBox}
                  is_read_only={
                    !(
                      Permissins?.has_pedpak ||
                      Permissins?.has_ped_pad ||
                      Permissins?.has_ped_key
                    )
                  }
                // is_read_only={(Permissins?.has_pedpak===0) ? 1 : 0}
                />
              </div>
            </Form.Group>

            <Form.Group>
              <b className={""}>RMS</b>
              <div className="mt-2">
                <CustomToggleButton
                  ToggleName="RMS_toggle"
                  ToggleValue={formData?.RMS_toggle}
                  changeHandler={handleCheckBox}
                />
              </div>
            </Form.Group>

            <Form.Group style={{minWidth:"150px"}}>
              <b className={"w-100 "}>Out Of Service</b>
              <div className="mt-2">
                <CustomToggleButton
                  ToggleName="out_of_service_toggle"
                  ToggleValue={formData?.out_of_service_toggle}
                  changeHandler={handleCheckBox}
                />
              </div>
            </Form.Group>
          </div>

          </div>

          </div>
        {/* </div> */}
      </div>
    </>
  );
}

export default GeneralInfo;
