import React, { useState, useEffect, useRef } from "react";
import { createTheme } from "@mui/material";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Form } from "react-bootstrap";
import Select, { StylesConfig } from "react-select";
import { GetFilterData } from "../../helper/BasicFn";
import { CallPOSTAPI } from "../../helper/API";
import ReactDOM from "react-dom";
import { useNavigate } from "react-router-dom";
import CreatableSelect from "react-select/creatable";
// import StatesField from "../components/common/states/StatesField";
import StatesField from "../common/states/StatesField";
import { useDispatch, useSelector } from "react-redux";
import {
  addFilterData,
  removeFilterData,
  updateFilterData,
  addPayloadData,
  removePayloadData
} from "../../redux/slices/AccountListFilter";
import CustomToggleButton3 from "../../components/common/toggleSwitch/CustomToggle3";

export default function index({
  setOpen,
  setaccounts,
  accountListingPage,
  setShowLoading,
  getAccountsList,
}) {
  const theme = createTheme();
  const navigate = useNavigate();
  const [accountsDataList, setAccountsDataList] = useState([]);
  const [customerTypeList, setCustomerTypeList] = useState([]);
  const [parentAccountList, setParentAccountList] = useState([]);
  const [distributerList, setDistributerList] = useState([]);
  const [salesManagerList, setSalesManagerList] = useState([]);
  const [projectManagerList, setProjectManagerList] = useState([]);
  const [productInterestList, setProductInterestList] = useState([]);
  const [leadSourceList, setLeadSourceList] = useState([]);
  const [accountStatusList, setAccountStatusList] = useState([]);
  const [industryTypeList, setIndustryTypeList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [aedBrandModelList, setAedBrandModelList] = useState([]);
  const [aedTechnicianPrimaryList, setAedTechnicianPrimaryList] = useState([]);
  const [aedTechnicianBackupList, setAedTechnicianBackupList] = useState([]);
  const [equipmentBrandModelList, setEquipmentBrandModelList] = useState([]);
  const [equipmentTypeList, setEquipmentTypeList] = useState([]);
  const [projectManagersBackupList, setProjectManagersBackupList] = useState(
    []
  );
  const [salesRepBackupList, setSalesRepBackupList] = useState([]);
  const [countryList, setCountryList] = useState([]);
  const [allToggle, setAllToggle] = useState(false);
  const [formData, setFormData] = useState({
    aed: false,
    equipment: false,
    training: false,
    account_name: [],
    customer_type: [],
    parent_account: [],
    distributors: [],
    sales_name: [],
    project_manager: [],
    product_interest: [],
    lead_source: [],
    account_status: [],
    industry_type: [],
    state: [],
    aed_brand_model: [],
    aed_technician_primary: [],
    aed_technician_backup: [],
    equipment_brand_model: [],
    equipment_type: [],
    project_managers_backup: [],
    sales_rep_backup: [],
    country: [],
  });
  const dispatch = useDispatch();
  const filterData = useSelector((state) => state.accountlistfilter.filterData);
  const payloadData = useSelector(
    (state) => state.accountlistfilter.payloadData
  );

  // drawer header
  const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
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

  // handle radio buttons change
  const handleRadioChange = (value, key) => {
    setFormData((old) => ({ ...old, [key]: value }));
  };
  const handleAllRadioChange = (value) => {
    setAllToggle(value);
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

  const prepareAedBrandModelOptions = (data) => {
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
          label: subitem.model_name, // Concatenate brand and model name
        });
      });
    }

    return options;
  };

  // fetchOnLoad
  const fetchOnLoad = async () => {
    let result = await GetFilterData();

    if (result.status) {
      // accounts list
      let accountListData = result?.data?.accountList;
      let allaccountListData = prepareOptions(
        accountListData,
        "account_id",
        "account_name"
      );
      setAccountsDataList(allaccountListData);

      // customerTypeList
      let customerTypeListData = result?.data?.customerTypeList;
      let allcustomerTypeListData = prepareOptions(
        customerTypeListData,
        "dropdown_customer_type_id",
        "customer_type_name"
      );
      setCustomerTypeList(allcustomerTypeListData);

      // parentAccountList
      let parentAccountListData = result?.data?.parentAccountList;
      let allparentAccountListData = prepareOptions(
        parentAccountListData,
        "account_id",
        "account_name"
      );
      setParentAccountList(allparentAccountListData);

      // distributorAccountList
      let distributorAccountListData = result?.data?.distributorAccountList;
      let alldistributorAccountListData = prepareOptions(
        distributorAccountListData,
        "account_id",
        "account_name"
      );
      setDistributerList(alldistributorAccountListData);

      // salesManager
      let salesManagerData = result?.data?.salesManagerprimary;
      let allsalesManagerData = prepareOptions(
        salesManagerData,
        "contact_id",
        "contact_name"
      );
      setSalesManagerList(allsalesManagerData);

      //salesmanagerbackup
      let salesManagerBackupData = result?.data?.salesManagerbackup;
      let allsalesManagerBackupData = prepareOptions(
        salesManagerBackupData,
        "contact_id",
        "contact_name"
      );
      setSalesRepBackupList(allsalesManagerBackupData);

      // projectManager
      let projectManagerData = result?.data?.projectManager;
      let allprojectManagerData = prepareOptions(
        projectManagerData,
        "contact_id",
        "contact_name"
      );
      setProjectManagerList(allprojectManagerData);

      // projectManagerbackup
      let projectManagerBackupData = result?.data?.projectManagerbackup;
      let allprojectManagerBackupData = prepareOptions(
        projectManagerBackupData,
        "contact_id",
        "contact_name"
      );
      setProjectManagersBackupList(allprojectManagerBackupData);

      // productInterestList
      let productInterestListData = result?.data?.productInterestList;
      let allproductInterestListData = prepareOptions(
        productInterestListData,
        "dropdown_product_interest_id",
        "dropdown_product_interest_name"
      );
      setProductInterestList(allproductInterestListData);

      // leadSourceList
      let leadSourceListData = result?.data?.leadSourceList;
      let allleadSourceListData = prepareOptions(
        leadSourceListData,
        "dropdown_lead_source_id",
        "dropdown_lead_source_name"
      );
      setLeadSourceList(allleadSourceListData);

      // accountStatusList
      let accountStatusListData = result?.data?.accountStatusList;
      let allaccountStatusListData = prepareOptions(
        accountStatusListData,
        "drop_account_status_id",
        "account_status"
      );
      setAccountStatusList(allaccountStatusListData);

      // industryTypeList
      let industryTypeListData = result?.data?.industryTypeList;
      let allindustryTypeListData = prepareOptions(
        industryTypeListData,
        "dropdown_industry_id",
        "dropdown_industry_name"
      );
      setIndustryTypeList(allindustryTypeListData);

      // stateList
      let stateListData = result?.data?.stateList;
      let allstateListData = prepareOptions(
        stateListData,
        "state_id",
        "state_name"
      );
      setStateList(allstateListData);

      // countryList
      let countryListData = result?.data?.countrylist;
      let allcountryListData = prepareOptions(
        countryListData,
        "id",
        "country_name"
      );
      setCountryList(allcountryListData);

      // aedTechnicianPrimaryList
      let aedTechnicianPrimaryListData = result?.data?.aedTechnicianPrimary;
      let allaedTechnicianPrimaryData = prepareOptions(
        aedTechnicianPrimaryListData,
        "contact_id",
        "contact_name"
      );
      setAedTechnicianPrimaryList(allaedTechnicianPrimaryData);

      // aedTechnicianBackupList
      let aedTechnicianBackupListData = result?.data?.aedTechnicianBackup;
      let allaedTechnicianBackupListData = prepareOptions(
        aedTechnicianBackupListData,
        "contact_id",
        "contact_name"
      );
      setAedTechnicianBackupList(allaedTechnicianBackupListData);

      let aedBrandModelListData = result?.data?.BrandModel;
      const options = prepareAedBrandModelOptions(aedBrandModelListData);
      setAedBrandModelList(options);
    }
  };

  // clear filter
  const handleClearFilter = async (e) => {
    e.preventDefault();
    setFormData((old) => ({
      ...old,
      aed: false,
      equipment: false,
      training: false,
      account_name: [],
      customer_type: [],
      parent_account: [],
      distributors: [],
      sales_name: [],
      project_manager: [],
      product_interest: [],
      lead_source: [],
      account_status: [],
      industry_type: [],
      state: [],
      aed_brand_model: [],
      aed_technician_primary: [],
      aed_technician_backup: [],
      equipment_brand_model: [],
      equipment_type: [],
      project_managers_backup: [],
      sales_rep_backup: [],
      country: [],
    }));
    setAllToggle(false);
    dispatch(removeFilterData());
    dispatch(removePayloadData());
    // document.getElementById("aed_yes").checked = false;
    // document.getElementById("aed_no").checked = false;
    // document.getElementById("equipment_yes").checked = false;
    // document.getElementById("equipment_no").checked = false;
    // document.getElementById("training_yes").checked = false;
    // document.getElementById("training_no").checked = false;

    handleDrawerClose();
    navigate("/accounts-listing", {
      state: {
        accountListings: false,
      },
    });
  };

  // submit
  //   const handleSubmit = async (e) => {
  //     // e.preventDefault();

  //     handleDrawerClose();

  //     let payloadData = {
  //     //   aed: formData?.aed,
  //     //   equipment: formData?.equipment,
  //     //   training: formData?.training,
  //       account_name:
  //         formData?.account_name?.length > 0
  //           ? handleSelectSubmitData(formData?.account_name)
  //           : [],
  //       customer_type:
  //         formData?.customer_type?.length > 0
  //           ? handleSelectSubmitData(formData?.customer_type)
  //           : [],
  //       parent_account:
  //         formData?.parent_account?.length > 0
  //           ? handleSelectSubmitData(formData?.parent_account)
  //           : [],
  //       distributors:
  //         formData?.distributors?.length > 0
  //           ? handleSelectSubmitData(formData?.distributors)
  //           : [],
  //       sales_name:
  //         formData?.sales_name?.length > 0
  //           ? handleSelectSubmitData(formData?.sales_name)
  //           : [],
  //       project_manager:
  //         formData?.project_manager?.length > 0
  //           ? handleSelectSubmitData(formData?.project_manager)
  //           : [],
  //       product_interest:
  //         formData?.product_interest?.length > 0
  //           ? handleSelectSubmitData(formData?.product_interest)
  //           : [],
  //       lead_source:
  //         formData?.lead_source?.length > 0
  //           ? handleSelectSubmitData(formData?.lead_source)
  //           : [],
  //       account_status:
  //         formData?.account_status?.length > 0
  //           ? handleSelectSubmitData(formData?.account_status)
  //           : [],
  //       industry_type:
  //         formData?.industry_type?.length > 0
  //           ? handleSelectSubmitData(formData?.industry_type)
  //           : [],
  //       state:
  //         formData?.state?.length > 0
  //           ? handleSelectSubmitData(formData?.state)
  //           : [],
  //       aed_brand_model:
  //         formData?.aed_brand_model?.length > 0
  //           ? handleSelectSubmitData(formData?.aed_brand_model)
  //           : [],
  //       aed_technician_primary:
  //         formData?.aed_technician_primary?.length > 0
  //           ? handleSelectSubmitData(formData?.aed_technician_primary)
  //           : [],
  //       aed_technician_backup:
  //         formData?.aed_technician_backup?.length > 0
  //           ? handleSelectSubmitData(formData?.aed_technician_backup)
  //           : [],
  //       equipment_brand_model:
  //         formData?.equipment_brand_model?.length > 0
  //           ? handleSelectSubmitData(formData?.equipment_brand_model)
  //           : [],
  //       equipment_type:
  //         formData?.equipment_type?.length > 0
  //           ? handleSelectSubmitData(formData?.equipment_type)
  //           : [],
  //       project_managers_backup:
  //         formData?.project_managers_backup?.length > 0
  //           ? handleSelectSubmitData(formData?.project_managers_backup)
  //           : [],
  //       sales_rep_backup:
  //         formData?.sales_rep_backup?.length > 0
  //           ? handleSelectSubmitData(formData?.sales_rep_backup)
  //           : [],
  //       country:
  //         formData?.country?.length > 0
  //           ? handleSelectSubmitData(formData?.country)
  //           : [],
  //     };
  //     setShowLoading(true);
  //     let results = await CallPOSTAPI(
  //       "account/filter-search-result-v2",
  //       payloadData
  //     );
  //     if (results?.status) {
  //       if (Object.keys(filterData).length !== 0) {
  //         dispatch(updateFilterData(formData));
  //       } else {
  //         dispatch(addFilterData(formData));
  //       }
  //       dispatch(addPayloadData(payloadData));
  //       setShowLoading(false);
  //       if (accountListingPage) {
  //         setaccounts(results?.data?.account_list);
  //       } else {
  //         navigate("/accounts-listing", {
  //           state: {
  //             accountListings: results?.data?.account_list,
  //           },
  //         });
  //       }
  //     }
  //   };

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

    let payloadData = {
      allToggle: allToggle,
      aed: formData?.aed,
      training: formData?.training,
      account_name:
        formData?.account_name?.length > 0
          ? handleSelectSubmitData(formData?.account_name)
          : [],
      customer_type:
        formData?.customer_type?.length > 0
          ? handleSelectSubmitData(formData?.customer_type)
          : [],
      parent_account:
        formData?.parent_account?.length > 0
          ? handleSelectSubmitData(formData?.parent_account)
          : [],
      distributors:
        formData?.distributors?.length > 0
          ? handleSelectSubmitData(formData?.distributors)
          : [],
      sales_name:
        formData?.sales_name?.length > 0
          ? handleSelectSubmitData(formData?.sales_name)
          : [],
      project_manager:
        formData?.project_manager?.length > 0
          ? handleSelectSubmitData(formData?.project_manager)
          : [],
      product_interest:
        formData?.product_interest?.length > 0
          ? handleSelectSubmitData(formData?.product_interest)
          : [],
      lead_source:
        formData?.lead_source?.length > 0
          ? handleSelectSubmitData(formData?.lead_source)
          : [],
      account_status:
        formData?.account_status?.length > 0
          ? handleSelectSubmitData(formData?.account_status)
          : [],
      industry_type:
        formData?.industry_type?.length > 0
          ? handleSelectSubmitData(formData?.industry_type)
          : [],
      state:
        formData?.state?.length > 0
          ? handleSelectSubmitData(formData?.state)
          : [],
      aed_brand_model:
        formData?.aed_brand_model?.length > 0
          ? handleSelectSubmitData(formData?.aed_brand_model)
          : [],
      aed_technician_primary:
        formData?.aed_technician_primary?.length > 0
          ? handleSelectSubmitData(formData?.aed_technician_primary)
          : [],
      aed_technician_backup:
        formData?.aed_technician_backup?.length > 0
          ? handleSelectSubmitData(formData?.aed_technician_backup)
          : [],
      equipment_brand_model:
        formData?.equipment_brand_model?.length > 0
          ? handleSelectSubmitData(formData?.equipment_brand_model)
          : [],
      equipment_type:
        formData?.equipment_type?.length > 0
          ? handleSelectSubmitData(formData?.equipment_type)
          : [],
      project_managers_backup:
        formData?.project_managers_backup?.length > 0
          ? handleSelectSubmitData(formData?.project_managers_backup)
          : [],
      sales_rep_backup:
        formData?.sales_rep_backup?.length > 0
          ? handleSelectSubmitData(formData?.sales_rep_backup)
          : [],
      country:
        formData?.country?.length > 0
          ? handleSelectSubmitData(formData?.country)
          : [],
    };

    const payloadDataStringified = stringifyArrays(payloadData);

    setShowLoading(true);

    const allFieldsEmpty = Object.entries(payloadDataStringified).map(
      ([key, value]) => {
        if (key === "allToggle") {
          return value !== false;
        }
        else if(key !== "aed" && key !== "training"){
          return value?.length !== 0;
        }
        return false;
      }
    );

    let isTrue = false;
    for (const item of allFieldsEmpty) {
      if (item === true) {
        isTrue = true;
        break;
      }
    }

    if (isTrue) {
      let results = await CallPOSTAPI(
        "account/filter-search-result-v3",
        payloadDataStringified
      );
      if (results?.status) {
        if (Object.keys(filterData).length !== 0) {
          dispatch(updateFilterData(formData));
        } else {
          dispatch(addFilterData(formData));
        }
        dispatch(addPayloadData(payloadDataStringified));
        if (accountListingPage) {
          setaccounts(results?.data?.account_list);
        } else {
          navigate("/accounts-listing", {
            state: {
              accountListings: results?.data?.account_list,
            },
          });
        }
      }
    } else {
      dispatch(removeFilterData());
      getAccountsList();
    }
    setShowLoading(false);
  };

  useEffect(() => {
    fetchOnLoad();
    if (Object.keys(filterData).length !== 0) {
      setFormData({
        aed: filterData?.aed || false,
        equipment: filterData?.equipment || false,
        training: filterData?.training || false,
        account_name: filterData?.account_name || [],
        customer_type: filterData?.customer_type || [],
        parent_account: filterData?.parent_account || [],
        distributors: filterData?.distributors || [],
        sales_name: filterData?.sales_name || [],
        project_manager: filterData?.project_manager || [],
        product_interest: filterData?.product_interest || [],
        lead_source: filterData?.lead_source || [],
        account_status: filterData?.account_status || [],
        industry_type: filterData?.industry_type || [],
        state: filterData?.state || [],
        aed_brand_model: filterData?.aed_brand_model || [],
        aed_technician_primary: filterData?.aed_technician_primary || [],
        aed_technician_backup: filterData?.aed_technician_backup || [],
        equipment_brand_model: filterData?.equipment_brand_model || [],
        equipment_type: filterData?.equipment_type || [],
        project_managers_backup: filterData?.project_managers_backup || [],
        sales_rep_backup: filterData?.sales_rep_backup || [],
        country: filterData?.country || [],
      });
      if (Object.keys(payloadData).length !== 0) {
        setAllToggle(payloadData?.allToggle);
      }
    }
  }, []);

  // Define a state to store the filtered options
  // const [filteredStateOptions, setFilteredStateOptions] = useState([]);

  // // Function to filter state options
  // const filterStateOptions = (inputValue) => {
  //   return stateList.filter((option) =>
  //     option.label.toLowerCase().includes(inputValue.toLowerCase())
  //   );
  // };

  // // Handle changes in the State input field
  // const handleStateInputChange = (inputValue) => {
  //   setFilteredStateOptions(filterStateOptions(inputValue));
  // };

  return (
    <div style={{ background: "#000" }}>
      {/* drawer header */}
      <DrawerHeader>
        <div className="left-btns">
          {/* <button className='btn btn-info' onClick={(e) => {handleClearFilter(e)}}>Clear</button>
                    <button className='btn btn-success ms-2' type='button' onClick={(e) => {handleSubmit(e)}}>Submit</button> */}

          <IconButton
            onClick={handleDrawerClose}
            className="my-account-list-btn"
          >
            {/*{theme.direction === "ltr" ? (
            <ChevronLeftIcon />
          ) : (
            <ChevronRightIcon />
          )}*/}
            <ChevronRightIcon />
          </IconButton>
        </div>
      </DrawerHeader>
      {/* main content of filter */}
      <div className="content px-4">
        <Form.Group className="mb-3">
          <Form.Label>Account Name</Form.Label>
          <Select
            value={formData.account_name}
            className="react-select-container"
            options={accountsDataList}
            onChange={(data) => {
              handleSelectChange(data, "account_name");
            }}
            isMulti
            menuPosition={"fixed"}
          />
        </Form.Group>

        {/* Account Status */}
        <Form.Group className="mb-3">
          <Form.Label>Account Status</Form.Label>
          <Select
            value={formData?.account_status}
            className="react-select-container"
            options={accountStatusList}
            onChange={(data) => {
              handleSelectChange(data, "account_status");
            }}
            isMulti
            menuPosition={"fixed"}
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

        {/* AED Technician Backup */}
        <Form.Group className="mb-3">
          <Form.Label>AED Technician Backup</Form.Label>
          <Select
            value={formData?.aed_technician_backup}
            className="react-select-container"
            options={aedTechnicianBackupList}
            onChange={(data) => {
              handleSelectChange(data, "aed_technician_backup");
            }}
            isMulti
            menuPosition={"fixed"}
          />
        </Form.Group>

        {/* AED Technician Primary */}
        <Form.Group className="mb-3">
          <Form.Label>AED Technician Primary</Form.Label>
          <Select
            value={formData?.aed_technician_primary}
            className="react-select-container"
            options={aedTechnicianPrimaryList}
            onChange={(data) => {
              handleSelectChange(data, "aed_technician_primary");
            }}
            isMulti
            menuPosition={"fixed"}
          />
        </Form.Group>

        {/* Country */}
        <Form.Group className="mb-3">
          <Form.Label>Country</Form.Label>
          <Select
            value={formData?.country}
            className="react-select-container"
            options={countryList}
            onChange={(data) => {
              handleSelectChange(data, "country");
            }}
            isMulti
            menuPosition={"fixed"}
          />
        </Form.Group>

        {/* Customer Type */}
        <Form.Group className="mb-3">
          <Form.Label>Customer Type</Form.Label>
          <Select
            value={formData?.customer_type}
            className="react-select-container"
            options={customerTypeList}
            onChange={(data) => {
              handleSelectChange(data, "customer_type");
            }}
            isMulti
            menuPosition={"fixed"}
          />
        </Form.Group>

        {/* Distributor */}
        <Form.Group className="mb-3">
          <Form.Label>Distributor</Form.Label>
          <Select
            value={formData?.distributors}
            className="react-select-container"
            options={distributerList}
            onChange={(data) => {
              handleSelectChange(data, "distributors");
            }}
            isMulti
            menuPosition={"fixed"}
          />
        </Form.Group>

        {/* radio buttons */}
        <Form.Group className="mb-3">
          <div className="toggle-align">
            <Form.Label>Equipment</Form.Label>
            <div>
              <CustomToggleButton3
                ToggleName="all-toggle"
                ToggleValue={allToggle}
                changeHandler={(e) => {
                  handleAllRadioChange(!allToggle);
                }}
                is_read_only={false}
              />
            </div>
          </div>
          <div className="toggle-container">
            <div className="toggle-align">
              <div className="my-2">AED</div>
              <div>
                <CustomToggleButton3
                  ToggleName="aed"
                  ToggleValue={formData.aed}
                  changeHandler={(e) => {
                    handleRadioChange(!formData.aed, "aed");
                  }}
                  is_read_only={allToggle === false || false}
                />
                {/*<Form.Check
                type="radio"
                id="aed_yes"
                label="Yes"
                value="1"
                name="aed"
                checked={filterData?.aed === 1 || formData.aed === 1}
                onChange={() => {
                  handleRadioChange(1, "aed");
                }}
              />
              <Form.Check
                type="radio"
                id="aed_no"
                label="No"
                value="2"
                name="aed"
                checked={filterData?.aed === 2 || formData.aed === 2}
                onChange={() => {
                  handleRadioChange(2, "aed");
                }}
            />*/}
              </div>
            </div>
            {/*<div className="toggle-align">
              <div className="my-2">Equipment</div>
              <div>
                <CustomToggleButton2
                  ToggleName="equipment"
                  ToggleValue={formData.equipment}
                  changeHandler={(e) => {
                    handleRadioChange(!formData.equipment, "equipment");
                  }}
                  is_read_only={false}
                />
                </div>
              </div>*/}
            {/*<Form.Check
              type="radio"
              id="equipment_yes"
              label="Yes"
              value="1"
              name="equipment"
              checked={
                filterData?.equipment === 1 || formData.equipment === 1
              }
              onChange={() => {
                handleRadioChange(1, "equipment");
              }}
            />
            <Form.Check
              type="radio"
              id="equipment_no"
              label="No"
              value="2"
              name="equipment"
              checked={
                filterData?.equipment === 2 || formData.equipment === 2
              }
              onChange={() => {
                handleRadioChange(2, "equipment");
              }}
            />*/}
            <div className="toggle-align">
              <div className="my-2">Training</div>
              <div>
                <CustomToggleButton3
                  ToggleName="training"
                  ToggleValue={formData.training}
                  changeHandler={(e) => {
                    handleRadioChange(!formData.training, "training");
                  }}
                  is_read_only={allToggle === false || false}
                />
                {/*<Form.Check
                type="radio"
                id="training_yes"
                label="Yes"
                value="1"
                name="training"
                checked={filterData?.training === 1 || formData.training === 1}
                onChange={() => {
                  handleRadioChange(1, "training");
                }}
              />
              <Form.Check
                type="radio"
                id="training_no"
                label="No"
                value="2"
                name="training"
                checked={filterData?.training === 2 || formData.training === 2}
                onChange={() => {
                  handleRadioChange(2, "training");
                }}
            />*/}
              </div>
            </div>
          </div>
        </Form.Group>

        {/* Equipment Brand/Model */}
        {/*<Form.Group className="mb-3">
          <Form.Label>Equipment Brand/Model</Form.Label>
          <Select
            // value={formData?.equipment_brand_model}
            className="react-select-container"
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
            // value={formData?.account_status}
            className="react-select-container"
            // options={accountStatusList}
            // onChange={(data) => {
            //   handleSelectChange(data, "account_status");
            // }}
            isMulti
            menuPosition={"fixed"}
          />
          </Form.Group>*/}

        {/* Industry */}
        <Form.Group className="mb-3">
          <Form.Label>Industry</Form.Label>
          <Select
            value={formData?.industry_type}
            className="react-select-container"
            options={industryTypeList}
            onChange={(data) => {
              handleSelectChange(data, "industry_type");
            }}
            isMulti
            menuPosition={"fixed"}
          />
        </Form.Group>

        {/* Lead Source */}
        <Form.Group className="mb-3">
          <Form.Label>Lead Source</Form.Label>
          <Select
            value={formData?.lead_source}
            className="react-select-container"
            options={leadSourceList}
            onChange={(data) => {
              handleSelectChange(data, "lead_source");
            }}
            isMulti
            menuPosition={"fixed"}
          />
        </Form.Group>

        {/* Parent Account */}
        <Form.Group className="mb-3">
          <Form.Label>Parent Account</Form.Label>
          <Select
            value={formData?.parent_account}
            className="react-select-container"
            options={parentAccountList}
            onChange={(data) => {
              handleSelectChange(data, "parent_account");
            }}
            isMulti
            menuPosition={"fixed"}
          />
        </Form.Group>

        {/* Product Interest */}
        <Form.Group className="mb-3">
          <Form.Label>Product Interest</Form.Label>
          <Select
            value={formData?.product_interest}
            className="react-select-container"
            options={productInterestList}
            onChange={(data) => {
              handleSelectChange(data, "product_interest");
            }}
            isMulti
            menuPosition={"fixed"}
          />
        </Form.Group>

        {/* Project Managers Backup */}
        <Form.Group className="mb-3">
          <Form.Label>Project Managers Backup</Form.Label>
          <Select
            value={formData?.project_managers_backup}
            className="react-select-container"
            options={projectManagersBackupList}
            onChange={(data) => {
              handleSelectChange(data, "project_managers_backup");
            }}
            isMulti
            menuPosition={"fixed"}
          />
        </Form.Group>

        {/* Project Manager */}
        <Form.Group className="mb-3">
          <Form.Label>Project Managers Primary</Form.Label>
          <Select
            value={formData?.project_manager}
            className="react-select-container"
            options={projectManagerList}
            onChange={(data) => {
              handleSelectChange(data, "project_manager");
            }}
            isMulti
            menuPosition={"fixed"}
          />
        </Form.Group>

        {/* Sales Rep Backup */}
        <Form.Group className="mb-3">
          <Form.Label>Sales Rep Backup</Form.Label>
          <Select
            value={formData?.sales_rep_backup}
            className="react-select-container"
            options={salesRepBackupList}
            onChange={(data) => {
              handleSelectChange(data, "sales_rep_backup");
            }}
            isMulti
            menuPosition={"fixed"}
          />
        </Form.Group>

        {/* Primary Salesman */}
        <Form.Group className="mb-3">
          <Form.Label>Sales Rep Primary</Form.Label>
          <Select
            value={formData?.sales_name}
            className="react-select-container"
            options={salesManagerList}
            onChange={(data) => {
              handleSelectChange(data, "sales_name");
            }}
            isMulti
            menuPosition={"fixed"}
          />
        </Form.Group>

        {/* State */}
        <Form.Group className="mb-3">
          <Form.Label>State</Form.Label>
          <Select
            value={formData?.state}
            className="react-select-container"
            options={stateList}
            onChange={(data) => {
              handleSelectChange(data, "state");
            }}
            isMulti
            menuPosition={"fixed"}
            // isSearchable={true} // Enable search functionality
            // filterOption={filterOptions} // Custom filter function
            // placeholder="Type to search states" // Placeholder text
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
