import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Form } from "react-bootstrap";
import Select from "react-select";
import { GetEquipmentListingFilterData } from "../../helper/BasicFn";
import { CallPOSTAPI, CallGETAPI } from "../../helper/API";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addFilterData,
  addPayloadData,
  updateFilterData,
  removeFilterData,
  removePayloadData,
} from "../../redux/slices/EquipmentListingFilterSlice";

export default function index({
  setOpen,
  handleSetAedListData,
  setShowLoading,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [aedBrandModelList, setAedBrandModelList] = useState([]);
  const [sitesList, setSitesList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [formData, setFormData] = useState({
    aed_brand_model: [],
    sites: [],
    state: [],
  });

  const equipmentFilterData = useSelector(
    (state) => state.equipmentlistingfilter.equipmentListingFilterData
  );

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

  // handle select change
  const handleSelectSubmitData = (data) => {
    let valueArray = [];
    data.map((item) => {
      valueArray.push(item.value);
    });

    return valueArray;
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
    let result = await GetEquipmentListingFilterData();

    if (result.status) {
      //aedBrandModel
      let aedBrandModelListData = result?.data?.data?.brandmodel;
      const options = prepareBrandModelOptions(aedBrandModelListData);
      setAedBrandModelList(options);

      // stateList
      let stateListData = result?.data?.data?.stateslist;
      let allstateListData = prepareOptions(
        stateListData,
        "state_id",
        "state_name"
      );
      setStateList(allstateListData);

      //Sites
      let sitesData = result?.data?.data?.sitelist;
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
      aed_brand_model: [],
      sites: [],
      state: [],
    }));
    dispatch(removeFilterData());
    dispatch(removePayloadData());

    handleDrawerClose();

    const result = await CallGETAPI("admin/admin-equipment-list-v1");
    if (result?.data?.status) {
      handleSetAedListData(result);
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

    const payloadData = {
      site_id:
        formData?.sites?.length > 0
          ? handleSelectSubmitData(formData?.sites)
          : [],
      brandmodel:
        formData?.aed_brand_model?.length > 0
          ? handleSelectSubmitData(formData?.aed_brand_model)
          : [],
      state:
        formData?.state?.length > 0
          ? handleSelectSubmitData(formData?.state)
          : [],
    };

    const payloadDataStringified = stringifyArrays(payloadData);

    setShowLoading(true);

    const allFieldsEmpty = Object.entries(payloadDataStringified).map(
      ([key, value]) => {
        return value?.length !== 0;
      }
    );

    let isTrue = false;
    for (const item of allFieldsEmpty) {
      if (item === true) {
        isTrue = true;
        break;
      }
    }

    if (!isTrue) {
      setShowLoading(false);
      return;
    }

    if (equipmentFilterData && Object.keys(equipmentFilterData).length !== 0) {
      dispatch(updateFilterData(formData));
    } else {
      dispatch(addFilterData(formData));
    }
    dispatch(addPayloadData(payloadDataStringified));

    const results = await CallPOSTAPI(
      "admin/admin-equipment-list-filter",
      payloadDataStringified
    );
    if (results?.data?.status) {
      handleSetAedListData(results);
    }
    setShowLoading(false);
  };

  useEffect(() => {
    fetchOnLoad();

    if (equipmentFilterData && Object.keys(equipmentFilterData).length !== 0) {
      setFormData({
        sites: equipmentFilterData?.sites,
        aed_brand_model: equipmentFilterData?.aed_brand_model,
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
