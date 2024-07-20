import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Form } from "react-bootstrap";
import Select from "react-select";
import { GetEquipmentFilterData } from "../../helper/BasicFn";
import { CallPOSTAPI, CallGETAPI } from "../../helper/API";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addFilterData,
  addPayloadData,
  updateFilterData,
  removeFilterData,
  removePayloadData,
} from "../../redux/slices/AccountDetailsEquipmentFilter";
import CustomToggleButton2 from "../../components/common/toggleSwitch/CustomToggle2";
import CommonDatePickerForFilter from "../../components/common/date-picker/CommonDatePickerForFilter";

export default function index({
  setOpen,
  accountId,
  setShowLoading,
  setTblsData,
  setShowAedTbl,
  setShowAccTbl,
  tabTbldata,
  setTabTbldata,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [equipmentBrandModelList, setEquipmentBrandModelList] = useState([]);
  const [equipmentTypeList, setEquipmentTypeList] = useState([]);
  const [accessoryBrandModelList, setAccessoryBrandModelList] = useState([]);
  const [accessoryTypeList, setAccessoryTypeList] = useState([]);
  const [aedCheckersList, setAedCheckersList] = useState([]);
  const [aedBrandModelList, setAedBrandModelList] = useState([]);
  const [sitesList, setSitesList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [expirationRangeType, setExpirationRangeType] = useState([
    { label: "30 Days", value: 30 },
    { label: "60 Days", value: 60 },
    { label: "90 Days", value: 90 },
    { label: "Expired", value: 0 },
  ]);
  const [formData, setFormData] = useState({
    aed: true,
    // equipment: true,
    accessories: true,
    accessory_brand_model: [],
    accessory_type: [],
    aed_checkers: [],
    aed_brand_model: [],
    equipment_brand_model: [],
    equipment_type: [],
    expiration_range_type: [],
    expiration_date_range1: "",
    expiration_date_range2: "",
    sites: [],
    state: [],
  });

  const equipmentFilterData = useSelector(
    (state) => state.accountdetailsequipmentfilter.equipmentFilterData
  );

  const handleDateChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // drawer header
  const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: "space-between",
  }));

  // close drawer function
  const handleDrawerClose = () => {
    setOpen(false);
  };

  // handle select change
  const handleSelectChange = (data, key) => {
    let valueArray = [];
    data.map((item, index) => {
      valueArray.push({
        label: item.label,
        value: item.value,
      });
    });
    setFormData((old) => ({ ...old, [key]: valueArray }));
  };

  const handleSelectRangeTypeChange = (data) => {
    setFormData((oldFormData) => ({
      ...oldFormData,
      expiration_range_type: data,
    }));
  };

  // handle select change
  const handleSelectSubmitData = (data) => {
    let valueArray = [];
    data.map((item) => {
      valueArray.push(item.value);
    });

    return valueArray;
  };

  // handle radio buttons change
  const handleRadioChange = (value, key) => {
    setFormData((old) => ({ ...old, [key]: value }));
  };

  // prepare options
  const prepareOptions = (optionsData, key, value) => {
    if (optionsData) {
      let allData = [];
      for (let i = 0; i < optionsData.length; i++) {
        let singleData = {};
        singleData.value = optionsData[i][key];
        singleData.label = optionsData[i][value];
        allData.push(singleData);
      }
      allData.sort((a, b) => a.label.localeCompare(b.label));
      return allData;
    }
  };

  // prepare options
  const prepareOptionsForAccessoryType = (optionsData) => {
    if (optionsData) {
      let allData = [];
      for (let i = 0; i < optionsData.length; i++) {
        let singleData = {};
        singleData.value = optionsData[i];
        singleData.label = optionsData[i];
        allData.push(singleData);
      }
      allData.sort((a, b) => a.label.localeCompare(b.label));
      return allData;
    }
  };

  const prepareBrandModelOptions = (data) => {
    if (!data) return [];

    const options = [];
    const brandOptions = {};

    for (const item of data) {
      const brandName = item.brand_name;
      if (!brandOptions[brandName]) {
        brandOptions[brandName] = {
          label: brandName,
          options: [],
        };
        options.push(brandOptions[brandName]);
      }
      item?.data?.map((subitem) => {
        brandOptions[brandName].options.push({
          value: subitem.model_id,
          label: subitem.model_name,
        });
      });
    }

    return options;
  };

  // fetchOnLoad
  const fetchOnLoad = async () => {
    let result = await GetEquipmentFilterData(accountId);

    if (result.status) {
      //aedBrandModel
      let aedBrandModelListData = result?.data?.BrandModel;
      const options = prepareBrandModelOptions(aedBrandModelListData);
      setAedBrandModelList(options);

      //accessoryBrandModel
      let accessoryBrandModelListData = result?.data?.AccessoryBrandModel;
      const optionsAccessoryBrandModel = prepareBrandModelOptions(
        accessoryBrandModelListData
      );
      setAccessoryBrandModelList(optionsAccessoryBrandModel);

      // stateList
      let stateListData = result?.data?.StateList;
      let allstateListData = prepareOptions(
        stateListData,
        "state_id",
        "state_name"
      );
      setStateList(allstateListData);

      //AedCheckers
      let aedCheckersData = result?.data?.ContactList;
      let allAedCheckersData = prepareOptions(
        aedCheckersData,
        "contact_id",
        "contact_name"
      );
      setAedCheckersList(allAedCheckersData);

      //Sites
      let sitesData = result?.data?.SiteList;
      let allSitesData = prepareOptions(
        sitesData,
        "account_site_info_id",
        "account_site_name"
      );
      setSitesList(allSitesData);

      //accessory type
      let accessoryTypeData = result?.data?.AccessoryType;
      let allAccessoryTypeData =
        prepareOptionsForAccessoryType(accessoryTypeData);
      setAccessoryTypeList(allAccessoryTypeData);
    }
  };

  // clear filter
  const handleClearFilter = async (e) => {
    e.preventDefault();
    setShowLoading(true);
    setTabTbldata({
      ...tabTbldata,
      equipment: {
        aed: true,
        accessory: true,
      }
    });
    setFormData((old) => ({
      ...old,
      aed: true,
      // equipment: true,
      accessories: true,
      accessory_brand_model: [],
      accessory_type: [],
      aed_checkers: [],
      aed_brand_model: [],
      equipment_brand_model: [],
      equipment_type: [],
      expiration_range_type: [],
      expiration_date_range1: "",
      expiration_date_range2: "",
      sites: [],
      state: [],
    }));
    dispatch(removeFilterData());
    dispatch(removePayloadData());

    handleDrawerClose();

    const result = await CallGETAPI(
      "account/get-aed-with-standalon/" + accountId
    );
    if (result?.data?.status) {
      setTblsData(result);
    }
    setShowLoading(false);
  };

  const stringifyArrays = (data) => {
    const stringifiedData = {};
    for (const key in data) {
      if (Array.isArray(data[key])) {
        stringifiedData[key] = data[key].join(",");
      } else {
        stringifiedData[key] = data[key];
      }
    }
    return stringifiedData;
  };

  const handleSubmit = async (e) => {
    handleDrawerClose();

    setTabTbldata({
      ...tabTbldata,
      equipment: {
        aed: formData.aed,
        accessory: formData.accessories,
      }
    });

    const payloadData = {
      site_name:
        formData?.sites?.length > 0
          ? handleSelectSubmitData(formData?.sites)
          : [],
      account_id: accountId,
      aed_checker:
        formData?.aed_checkers?.length > 0
          ? handleSelectSubmitData(formData?.aed_checkers)
          : [],
      accesory_brand_model:
        formData?.accessory_brand_model?.length > 0
          ? handleSelectSubmitData(formData?.accessory_brand_model)
          : [],
      state:
        formData?.state?.length > 0
          ? handleSelectSubmitData(formData?.state)
          : [],
      aed_brand_model:
        formData?.aed_brand_model?.length > 0
          ? handleSelectSubmitData(formData?.aed_brand_model)
          : [],
      accessory_type:
        formData?.accessory_type?.length > 0
          ? handleSelectSubmitData(formData?.accessory_type)
          : [],
      expirationrange: formData?.expiration_range_type?.value,
      from: formData?.expiration_date_range1,
      to: formData?.expiration_date_range2,
      // equipment_brand_model:
      //   formData?.equipment_brand_model?.length > 0
      //     ? handleSelectSubmitData(formData?.equipment_brand_model)
      //     : [],
      // equipment_type:
      //   formData?.equipment_type?.length > 0
      //     ? handleSelectSubmitData(formData?.equipment_type)
      //     : [],
    };

    const payloadDataStringified = stringifyArrays(payloadData);

    setShowLoading(true);

    if (equipmentFilterData && Object.keys(equipmentFilterData).length !== 0) {
      dispatch(updateFilterData(formData));
    } else {
      dispatch(addFilterData(formData));
    }

    const allFieldsEmpty = Object.entries(formData).map(([key, value]) => {
      if (key !== "aed" && key !== "accessories") {
        return value?.length !== 0 && value !== undefined;
      }
      return false;
    });

    let isTrue = false;
    for (const item of allFieldsEmpty) {
      if (item === true) {
        isTrue = true;
        break;
      }
    }

    if (isTrue) {
      const results = await CallPOSTAPI(
        "account/equipment-filter-search-result",
        payloadDataStringified
      );
      if (results?.data?.status) {
        setTblsData(results);
        dispatch(addPayloadData(payloadDataStringified));
      }
    }

    setShowLoading(false);
  };

  useEffect(() => {
    fetchOnLoad();
    setShowAedTbl(true);
    setShowAccTbl(true);

    if (equipmentFilterData && Object.keys(equipmentFilterData).length !== 0) {
      setFormData({
        aed: equipmentFilterData?.aed,
        equipment: equipmentFilterData?.equipment,
        accessories: equipmentFilterData?.accessories,
        accessory_brand_model: equipmentFilterData?.accessory_brand_model,
        accessory_type: equipmentFilterData?.accessory_type,
        aed_checkers: equipmentFilterData?.aed_checkers,
        aed_brand_model: equipmentFilterData?.aed_brand_model,
        equipment_brand_model: equipmentFilterData?.equipment_brand_model,
        equipment_type: equipmentFilterData?.equipment_type,
        expiration_range_type: equipmentFilterData?.expiration_range_type,
        expiration_date_range1: equipmentFilterData?.expiration_date_range1,
        expiration_date_range2: equipmentFilterData?.expiration_date_range2,
        sites: equipmentFilterData?.sites,
        state: equipmentFilterData?.state,
      });
    }
  }, []);

  return (
    <div style={{ background: "#000" }}>
      {/* drawer header */}
      <DrawerHeader>
        <div className="left-btns">
          <IconButton onClick={handleDrawerClose}>
            <ChevronRightIcon />
          </IconButton>
        </div>
      </DrawerHeader>
      {/* main content of filter */}
      <div className="content px-4">
        {/* Accessory Brand/Model */}
        <Form.Group className="mb-3">
          <Form.Label>Accessory Brand/Model</Form.Label>
          <Select
            isMulti
            menuPosition="fixed"
            className="react-select-container custom-select"
            options={accessoryBrandModelList}
            value={formData?.accessory_brand_model}
            onChange={(data) => {
              handleSelectChange(data, "accessory_brand_model");
            }}
            closeMenuOnSelect={false}
          />
        </Form.Group>

        {/* Accessory Type */}
        <Form.Group className="mb-3">
          <Form.Label>Accessory Type</Form.Label>
          <Select
            isMulti
            menuPosition="fixed"
            className="react-select-container custom-select"
            name="accessory_type"
            options={accessoryTypeList}
            value={formData.accessory_type}
            onChange={(data) => {
              handleSelectChange(data, "accessory_type");
            }}
          />
        </Form.Group>

        {/* AED Checkers */}
        <Form.Group className="mb-3">
          <Form.Label>AED Checkers</Form.Label>
          <Select
            isMulti
            menuPosition="fixed"
            className="react-select-container custom-select"
            options={aedCheckersList}
            value={formData?.aed_checkers}
            onChange={(data) => {
              handleSelectChange(data, "aed_checkers");
            }}
          />
        </Form.Group>

        {/* AED Brand/Model */}
        <Form.Group className="mb-3">
          <Form.Label>AED Brand/Model</Form.Label>
          <Select
            isMulti
            menuPosition="fixed"
            className="react-select-container custom-select"
            options={aedBrandModelList}
            value={formData?.aed_brand_model}
            onChange={(data) => {
              handleSelectChange(data, "aed_brand_model");
            }}
            closeMenuOnSelect={false}
          />
        </Form.Group>

        {/* radio buttons */}
        <Form.Group className="mb-3">
          <Form.Label>Display</Form.Label>
          <div className="toggle-container">
            <div className="toggle-align">
              <div className="my-2">AED</div>
              <CustomToggleButton2
                ToggleName="equipment_aed"
                ToggleValue={formData.aed}
                changeHandler={(e) => {
                  handleRadioChange(!formData.aed, "aed");
                }}
                is_read_only={false}
              />
            </div>
            <div className="toggle-align">
              <div className="my-2">Accessories</div>
              <CustomToggleButton2
                ToggleName="accessories"
                ToggleValue={formData.accessories}
                changeHandler={(e) => {
                  handleRadioChange(!formData.accessories, "accessories");
                }}
                is_read_only={false}
              />
            </div>
            {/*<div className="toggle-align">
              <div className="my-2">Equipment</div>
              <CustomToggleButton2
                ToggleName="equipment"
                ToggleValue={formData.equipment}
                changeHandler={(e) => {
                  handleRadioChange(!formData.equipment, "equipment");
                }}
                is_read_only={false}
              />
              </div>*/}
          </div>
        </Form.Group>

        {/* Equipment Brand/Model */}
        {/*<Form.Group className="mb-3">
          <Form.Label>Equipment Brand/Model</Form.Label>
          <Select
            className="react-select-container"
            // value={formData?.equipment_brand_model}
            // options={accountStatusList}
            // onChange={(data) => {
            //   handleSelectChange(data, "account_status");
            // }}
            isMulti
            menuPosition={"fixed"}
          />
            </Form.Group>*/}

        {/* Equipment Type */}
        {/*<Form.Group className="mb-3">
          <Form.Label>Equipment Type</Form.Label>
          <Select
            className="react-select-container"
            // value={formData?.account_status}
            // options={accountStatusList}
            // onChange={(data) => {
            //   handleSelectChange(data, "account_status");
            // }}
            isMulti
            menuPosition={"fixed"}
          />
          </Form.Group>*/}

        {/* Expiration Range Type */}
        <Form.Group className="mb-3">
          <Form.Label>Expiration Range Type</Form.Label>
          <Select
            className="react-select-container"
            options={expirationRangeType}
            value={formData?.expiration_range_type}
            onChange={(data) => {
              handleSelectRangeTypeChange(data);
            }}
            menuPosition="fixed"
          />
        </Form.Group>

        {/* Expiration Date Range */}
        <Form.Group className="mb-3">
          <Form.Label>Expiration Date Range</Form.Label>
          <div className="d-flex">
            {" "}
            <CommonDatePickerForFilter
              calName="expiration_date_range1"
              CalVal={formData.expiration_date_range1}
              HandleChange={handleDateChange}
            />
            <CommonDatePickerForFilter
              calName="expiration_date_range2"
              CalVal={formData.expiration_date_range2}
              HandleChange={handleDateChange}
              minDate={
                formData.expiration_date_range1
                  ? new Date(formData.expiration_date_range1)
                  : null
              }
              disabled={!formData.expiration_date_range1}
            />
          </div>
        </Form.Group>

        {/* Sites */}
        <Form.Group className="mb-3">
          <Form.Label>Sites</Form.Label>
          <Select
            className="react-select-container"
            value={formData?.sites}
            options={sitesList}
            onChange={(data) => {
              handleSelectChange(data, "sites");
            }}
            isMulti
            menuPosition={"fixed"}
          />
        </Form.Group>

        {/* State */}
        <Form.Group className="mb-3">
          <Form.Label>State</Form.Label>
          <Select
            className="react-select-container"
            value={formData?.state}
            options={stateList}
            onChange={(data) => {
              handleSelectChange(data, "state");
            }}
            isMulti
            menuPosition={"fixed"}
          />
        </Form.Group>

        {/* submit buttons */}
        <div className="mt-4 pb-2 btn-align">
          <button
            className="btn btn-light btn-clear-filter"
            onClick={(e) => {
              handleClearFilter(e);
            }}
          >
            Clear
          </button>
          <button
            className="btn btn-light ms-2 btn-submit-filter"
            style={{
              backgroundColor: "#4fe14fe6",
              color: "#FFF",
              border: "none",
            }}
            type="button"
            onClick={(e) => {
              handleSubmit(e);
            }}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
