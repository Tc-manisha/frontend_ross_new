import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Form } from "react-bootstrap";
import Select from "react-select";
import { GetAccessoryListingFilterData } from "../../helper/BasicFn";
import { CallPOSTAPI, CallGETAPI } from "../../helper/API";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addFilterData,
  addPayloadData,
  updateFilterData,
  removeFilterData,
  removePayloadData,
} from "../../redux/slices/AccessoryListingFilterSlice";
import CommonDatePickerForFilter from "../../components/common/date-picker/CommonDatePickerForFilter";

export default function index({ setOpen, setAedList, setShowLoading }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [accessoryBrandModelList, setAccessoryBrandModelList] = useState([]);
  const [accessoryTypeList, setAccessoryTypeList] = useState([]);
  const [accountList, setAccountList] = useState([]);
  const [sitesList, setSitesList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [expirationRangeType, setExpirationRangeType] = useState([
    { label: "30 Days", value: 30 },
    { label: "60 Days", value: 60 },
    { label: "90 Days", value: 90 },
    { label: "Expired", value: 0 },
  ]);
  const [formData, setFormData] = useState({
    account_name: [],
    accessory_brand_model: [],
    accessory_type: [],
    expiration_range_type: [],
    expiration_date_range1: "",
    expiration_date_range2: "",
    sites: [],
    state: [],
  });

  const accessoryFilterData = useSelector(
    (state) => state.accessorylistingfilter.accessoryListingFilterData
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
    let result = await GetAccessoryListingFilterData();

    if (result.status) {
      // accountList
      let accountListData = result?.data?.accountlist;
      let allAccountListData = prepareOptions(
        accountListData,
        "account_id",
        "account_name"
      );
      setAccountList(allAccountListData);

      //aedBrandModel
      let accessoryBrandModelListData = result?.data?.AccessoryBrandModel;
      const options = prepareBrandModelOptions(accessoryBrandModelListData);
      setAccessoryBrandModelList(options);

      // accessoryTypeList
      let accessoryTypeListData = result?.data?.AccessoryType;
      let allAccessoryTypeListData = prepareOptionsForAccessoryType(
        accessoryTypeListData
      );
      setAccessoryTypeList(allAccessoryTypeListData);

      // stateList
      let stateListData = result?.data?.StateList;
      let allstateListData = prepareOptions(
        stateListData,
        "state_id",
        "state_name"
      );
      setStateList(allstateListData);

      //Sites
      let sitesData = result?.data?.SiteList;
      let allSitesData = prepareOptions(
        sitesData,
        "account_site_info_id",
        "account_site_name"
      );
      setSitesList(allSitesData);
    }
  };

  // clear filter
  const handleClearFilter = async (e) => {
    e.preventDefault();
    setShowLoading(true);
    setFormData((old) => ({
      ...old,
      account_name: [],
      accessory_brand_model: [],
      accessory_type: [],
      expiration_range_type: [],
      expiration_date_range1: "",
      expiration_date_range2: "",
      sites: [],
      state: [],
    }));
    dispatch(removeFilterData());
    dispatch(removePayloadData());

    const result = await CallGETAPI("admin/admin-accessory-list-v1");
    if (result?.data?.status) {
      const aeds = result?.data?.data;
      setAedList(aeds);
    }

    handleDrawerClose();
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

    const payloadData = {
      account_name:
        formData?.account_name?.length > 0
          ? handleSelectSubmitData(formData?.account_name)
          : [],
      site_name:
        formData?.sites?.length > 0
          ? handleSelectSubmitData(formData?.sites)
          : [],
      state:
        formData?.state?.length > 0
          ? handleSelectSubmitData(formData?.state)
          : [],
      accesory_brand_model:
        formData?.accessory_brand_model?.length > 0
          ? handleSelectSubmitData(formData?.accessory_brand_model)
          : [],
      accessory_type:
        formData?.accessory_type?.length > 0
          ? handleSelectSubmitData(formData?.accessory_type)
          : [],
      from: formData?.expiration_date_range1,
      to: formData?.expiration_date_range2,
      expirationrange: formData?.expiration_range_type?.value,
    };

    const payloadDataStringified = stringifyArrays(payloadData);

    const allFieldsEmpty = Object.entries(formData).map(([key, value]) => {
      return value?.length !== 0 && value !== undefined;
    });

    let isTrue = false;
    for (const item of allFieldsEmpty) {
      if (item === true) {
        isTrue = true;
        handleDrawerClose();
        break;
      }
    }

    setShowLoading(true);
    if (isTrue) {
      if (
        accessoryFilterData &&
        Object.keys(accessoryFilterData).length !== 0
      ) {
        dispatch(updateFilterData(formData));
      } else {
        dispatch(addFilterData(formData));
      }
      const results = await CallPOSTAPI(
        "admin/admin-accessorylisting-search",
        payloadDataStringified
      );

      if (results?.data?.status) {
        setAedList(results?.data?.data);
        dispatch(addPayloadData(payloadDataStringified));
      }
    }
    setShowLoading(false);
  };

  useEffect(() => {
    fetchOnLoad();

    if (accessoryFilterData && Object.keys(accessoryFilterData).length !== 0) {
      setFormData({
        account_name: accessoryFilterData?.account_name,
        accessory_brand_model: accessoryFilterData?.accesory_brand_model,
        accessory_type: accessoryFilterData?.accessory_type,
        expiration_range_type: accessoryFilterData?.expiration_range_type,
        expiration_date_range1: accessoryFilterData?.expiration_date_range1,
        expiration_date_range2: accessoryFilterData?.expiration_date_range2,
        sites: accessoryFilterData?.sites,
        state: accessoryFilterData?.state,
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
        {/* Account Name */}
        <Form.Group className="mb-3">
          <Form.Label>Account Name</Form.Label>
          <Select
            isMulti
            menuPosition="fixed"
            className="react-select-container custom-select"
            options={accountList}
            value={formData?.account_name}
            onChange={(data) => {
              handleSelectChange(data, "account_name");
            }}
          />
        </Form.Group>

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
