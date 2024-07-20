import React, { useEffect, useState } from "react";
import DataGrid, {
  Column,
  FilterRow,
  HeaderFilter,
  FilterPanel,
  FilterBuilderPopup,
  Scrolling,
  SearchPanel,
  Paging,
} from "devextreme-react/data-grid";
import {
  Form,
  Button as BButton,
  Button as BsButton,
  InputGroup,
} from "react-bootstrap";
import { Box } from "@mui/material";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import ReactMultiSelectCheckboxes from "react-multiselect-checkboxes";
import { CallGETAPI, CallPOSTAPI } from "../../../helper/API";
import { ContactList, GetAccountList } from "../../../helper/BasicFn";
import { toast } from "react-toastify";
import Moment from "react-moment";
import EditAssignUserRoleModal from "./EditAssignUserRoleModal";
import moment from "moment";
import { MultiSelect } from "react-multi-select-component";
import UpdateRoleToUserModal from "./UpdateRoleToUserModal";
import { sortArrAscending } from "../../../helper/constants";
import SearchBarComp from "./SearchBarComp";

const AssignPermissionUser = () => {
  const [loading, setLoading] = useState(false);
  const [accountList, setAccountList] = useState([]);
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const [contactList, setContactList] = useState([]);
  const [roleData, setRoleData] = useState([]);
  const [userTableData, setUserTableData] = useState([]);
  const [edit, setEdit] = useState(false);
  const [rowData, setRowData] = useState("");
  const [selectAccountValidations, setSelectAccountValidations] =
    useState(false);
  const [selectContactValidations, setSelectContactValidations] =
    useState(false);
  const [selectRoleValidations, setSelectRoleValidations] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [formData, setFormData] = useState({
    account_id: "",
    contact_id: "",
    role_id: [],
    role_type: "",
    // site_ids: [],
  });

  const [updateModal, setUpdateModal] = useState(false);
  const [contactID, setContactID] = useState("");
  const [sortedAccountList, setSortedAccountList] = useState([]);
  const [sortedContactList, setSortedContactList] = useState([]);
  const [allSites, setAllSites] = useState([]);
  const [filteredSites, setFilteredSites] = useState([]);
  const [selectedSites, setSelectedSites] = useState([]);
  const [allContactSites, setAllContactSites] = useState([]);

  const [searchValue, setSearchValue] = useState("");

  const [isInvalid, setIsInvalid] = useState({
    account_id: false,
    contact_id: false,
    role_id: false,
    role_type: false,
    site_id: false,
  });

  const accountId = 1;

  const fetchLoad = async () => {
    // const accountDataRes = await GetAccountList();
    const accountDataRes = await CallGETAPI("account/account-list-user");
    console.log({ accountDataRes });
    const accountData = accountDataRes?.data?.data?.account || [];
    const selectedAcc = accountData.find(
      (item) => item.account_id == accountId
    );
    let sortedArr = sortArrAscending(accountData, "account_name");
    setAccountList(sortedArr);
    setSortedAccountList(sortedArr);

    const res = await CallGETAPI("admin/get-permission-group");
    const filteredData =
      res?.data?.data?.filter(
        (item) => item?.active === 1 && item?.is_admin_role === 0
      ) || [];
    setRoleData(filteredData);
  };

  useEffect(() => {
    fetchLoad();
    fetchUserTblData();
  }, []);

  const [selectedPermissions, setSelectedPermissions] = useState([]);

  // Function to handle permission selection
  const handlePermissionSelect = (selectedList, selectedItem) => {
    const selectedPermissions = selectedList
      .map((item) => item.value)
      .join(",");
    console.log(selectedPermissions);
    setSelectedPermissions(selectedList);
    console.log(selectedList);
    setFormData((prevFormData) => ({
      ...prevFormData,
      role_id: selectedPermissions,
    }));
  };

  // const handleAccountSelect = (event) => {
  //   const accountId = event.target.value;
  //   console.log(accountId)
  //   setSelectedAccountId(accountId);
  // };

  const fetchContactData = async (selectedAccountId) => {
    setSortedContactList([]);
    const res = await ContactList(selectedAccountId);
    if (res) {
      let sortedArr = sortArrAscending(res, "contact_name");
      setSortedContactList(sortedArr);
      setContactList(res);
    }
  };

  useEffect(() => {
    if (selectedAccountId !== null) {
      fetchContactData(selectedAccountId);
    }
  }, [selectedAccountId]);

  const fetchUserTblData = async () => {
    const tableData = await CallGETAPI("admin/fetch-user-role");
    console.log(tableData);
    setUserTableData(tableData?.data?.data || []);
  };

  const handleChange = (e, key) => {
    const { value } = e.target;
    if (key === "account_id") {
      setSelectedAccountId(value);
    }

    // if(key === "role_type") {
    //   // setSortedNewRoleDataArr(pre)
    //   // .filter((item) => item.role_type === formData.role_type)
    // }

    setFormData((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const HandleAssign = async (data) => {
    setContactID(data.contact_id);
    setUpdateModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let is_false = 0;
    let obj = {
      // account_id: false,
      // contact_id: false,
      // role_id: false,
      account_id: false,
      contact_id: false,
      role_id: false,
      role_type: false,
      site_id: false,
    };

    if (formData.account_id === "") {
      obj.account_id = true;
      is_false = 1;
    }

    if (formData.contact_id === "") {
      obj.contact_id = true;
      is_false = 1;
    }

    if (formData.role_id.length === 0) {
      obj.role_id = true;
      is_false = 1;
    }

    if (formData.role_type === "site_level" && selectedSites.length === 0) {
      obj.site_id = true;
      is_false = 1;
    }

    if (formData.role_type === "") {
      obj.role_type = true;
      is_false = 1;
    }

    if (is_false) {
      setIsInvalid(obj);
      return "";
    }

    setLoading(true);
    let rolesArr = formData.role_id;
    let finalRolesArr = rolesArr.map((role) => role.value);
    let body = {
      ...formData,
      site_id:
        selectedSites.length > 0
          ? selectedSites.map((item) => item.value).toString()
          : "",
      role_id: finalRolesArr + "",
    };

    // console.log({ body });

    const res = await CallPOSTAPI("admin/assign-permission-user", body);
    console.log(res);
    if (res?.data?.status) {
      setLoading(false);
      toast.success(res?.data?.msg);
      fetchUserTblData();
      setFormData({ account_id: "", contact_id: "", role_id: [] });
      setFormKey((prevKey) => prevKey + 1);
      setSelectedSites([]);
    } else {
      setLoading(false);
      toast.error(res?.data?.message);
      setFormData({ account_id: "", contact_id: "", role_id: [], role_type: "" });
    }
  };

  const [newRoleDataArr, setNewRoleDataArr] = useState([]);
  const [sortedNewRoleDataArr, setSortedNewRoleDataArr] = useState([]);
  const [sortedUserTableData, setSortedUserTableData] = useState([]);

  // const handleLostVars = () => {
  //   try {
  //     const nrda = roleData.map((obj) => ({
  //       label: obj.role_name,
  //       value: obj.role_id,
  //     }));

  //     let sortedArr = sortArrAscending(nrda, "label");
  //     setSortedNewRoleDataArr(sortedArr);

  //     setNewRoleDataArr(nrda);
  //   } catch (e) {}
  // };

  // useEffect(() => {
  //   handleLostVars();
  // }, [roleData]);

  const handleRoles = () => {
    if (formData.role_id.length > 0) {
      setFormData({
        ...formData,
        role_id: [],
      });
    }

    if (roleData) {
      const nrda = roleData
        .filter((item) => item.role_type === formData.role_type)
        .map((obj) => ({
          label: obj.role_name,
          value: obj.role_id,
        }));

      let sortedArr = sortArrAscending(nrda, "label");
      setSortedNewRoleDataArr(sortedArr);
      setNewRoleDataArr(nrda);
    }
  };

  useEffect(() => {
    handleRoles();
  }, [formData.role_type]);

  useEffect(() => {
    let sortedArr = sortArrAscending(userTableData, "account_name");
    setSortedUserTableData(sortedArr);
  }, [userTableData]);

  const handleRoleChange = (e) => {
    setFormData({
      ...formData,
      role_id: e,
    });
    setIsInvalid({ ...isInvalid, role_id: false });
    setSelectRoleValidations(false);
  };

  const renderSelectedTitleNames = () => {
    return [formData.role_id.map((item) => item.label).join(", ")];
  };

  const renderSelectTitle = () => {
    return (
      <div>
        {formData.role_id.length === 0
          ? "Select"
          : formData.role_id.length >= 3
          ? `${formData.role_id.length} Selected`
          : renderSelectedTitleNames()}
      </div>
    );
  };

  console.log("userTableData", userTableData);

  const handleSiteChange = (e) => {
    // setFormData({
    //   ...formData,
    //   site_ids: e,
    // });

    // console.log({ event: e });

    setSelectedSites(e);
  };

  const getAllSitesByAccountId = async (id) => {
    try {
      const response = await CallGETAPI(`account/account-site-list/${id}`);
      if (response.data.status) {
        setAllSites(response.data.data.site_details);
      }
      // console.log({ response: response.data });
    } catch (error) {
      console.log({ error: error });
    }
  };

  useEffect(() => {
    if (formData.account_id) {
      getAllSitesByAccountId(formData.account_id);
    }
  }, [formData.account_id]);

  function getCommonItems(array1, array2, key) {
    return array1.filter((item1) =>
      array2.length > 0
        ? array2.some(
            (item2) =>
              item1["account_site_info_id"] !== item2["account_site_info_id"]
          )
        : item1
    );
  }

  const getAllSitesByContactId = async (id) => {
    try {
      const response = await CallGETAPI(
        `account/account-site-list-by-contact/${id}`
      );
      if (response.data.status) {
        // console.log({ response: response.data });
        let current_sites =
          response.data.data !== "" ? response.data.data.site_list : [];
        const commonItems = getCommonItems(allSites, current_sites, "id");

        // console.log({ commonItems });

        let all_data = commonItems
          ? commonItems.map((item) => {
              return {
                label: item.account_site_name,
                value: item.account_site_info_id,
                // disabled: true,
              };
            })
          : [];

        setAllContactSites(current_sites);
        setFilteredSites(all_data);
        // setSelectedSites(all_data);
        // setAllSites(response.data.data.site_details);
      }
      // console.log({ response: response.data });
    } catch (error) {
      console.log({ error: error });
    }
  };

  useEffect(() => {
    if (formData.contact_id) {
      getAllSitesByContactId(formData.contact_id);
    }
  }, [formData.contact_id]);

  const renderRoleType = (data) => {
    return (
      <div>
        {data.role_type === "account_level"
          ? "Account Level"
          : data.role_type === "site_level"
          ? "Site Level"
          : data.role_type === "enhancement"
          ? "Enhancement"
          : ""}
      </div>
    );
  };

  return (
    <>
      <div
        className="mt-4"
        style={{
          position: "relative",
          width: "100%",
          paddingInline: "45px",
          marginBottom: "35px",
        }}
      >
        <Box className="text-left pt-3 pb-1">
          <h4 className="heading">Assign Role to User</h4>
        </Box>

        <Form
          key={formKey}
          className=""
          onSubmit={handleSubmit}
          noValidate
          // validated={validated}
          id="create-new-equipment-form"
        >
          <div
            className="my-4"
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "5%",
              marginBottom: "50px",
              justifyContent: "space-between",
            }}
          >
            {/* <div
              style={{
                display: "flex",
                flexDirection: "row",
                width: "70%",
                gap: "5%",
              }}
            > */}
            <Form.Group className={"col"} style={{ width: 200 }}>
              <Form.Label>Select Role Type*</Form.Label>
              <select
                className="form-control"
                value={formData?.role_type}
                name="role_type"
                placeholder="Enter Role Type"
                onChange={(e) => {
                  handleChange(e, "role_type");
                  setIsInvalid({ ...isInvalid, role_type: false });
                  // handleRoleArray(e);
                }}
              >
                <option value="">--Select One--</option>
                <option value="account_level">Account Level</option>
                <option value="site_level">Site Level</option>
                <option value="enhancement">Enhancement</option>
              </select>
              {isInvalid?.role_type && (
                <Form.Control.Feedback type="" className="text-danger mt-1">
                  Role type is required.
                </Form.Control.Feedback>
              )}
            </Form.Group>

            <Form.Group className={"col"}>
              <Form.Label>Select Role*</Form.Label>
              <MultiSelect
                valueRenderer={renderSelectTitle}
                options={sortedNewRoleDataArr}
                value={formData.role_id}
                onChange={(e) => handleRoleChange(e)}
                labelledBy="Select"
                hasSelectAll={false}
              />

              {isInvalid.role_id && (
                <Form.Control.Feedback type="" className="text-danger mt-1">
                  Please Select Role.
                </Form.Control.Feedback>
              )}
            </Form.Group>

            <Form.Group className={"col"} style={{ maxWidth: "300px" }}>
              <Form.Label>Select Account*</Form.Label>
              <select
                className="form-control"
                value={formData.account_id}
                name="account_id"
                placeholder="Enter Role Name"
                onChange={(e) => {
                  handleChange(e, "account_id");
                  setIsInvalid({ ...isInvalid, account_id: false });
                  setSelectAccountValidations(false);
                }}
                required
              >
                <option value="">--Select One--</option>
                {sortedAccountList.map((item, index) => (
                  <option
                    value={item?.account_id}
                    key={index}
                    // selected={parseInt(selectedAcc) === item?.account_id}
                  >
                    {item?.account_name}
                  </option>
                ))}
              </select>

              {isInvalid.account_id && (
                <Form.Control.Feedback type="" className="text-danger mt-1">
                  Please Select Account.
                </Form.Control.Feedback>
              )}
            </Form.Group>

            <Form.Group className={"col"} style={{ maxWidth: "300px" }}>
              <Form.Label>Select Contact*</Form.Label>
              <select
                className="form-control"
                value={formData.contact_id}
                name="contact_id"
                placeholder="Enter Role Name"
                onChange={(e) => {
                  handleChange(e, "contact_id");
                  setIsInvalid({ ...isInvalid, contact_id: false });
                  setSelectContactValidations(false);
                }}
                required
              >
                <option value="">--Select One--</option>
                {formData.role_type === "enhancement"
                  ? sortedContactList
                      ?.filter((item) => item.user === true && item.status === 1)
                      .map((item, index) => (
                        <option
                          value={item?.contact_id}
                          key={index}
                          // selected={parseInt(selectedAcc) === item?.account_id}
                        >
                          {item?.contact_name}
                        </option>
                      ))
                  : sortedContactList?.filter((item) => item.status === 1)?.map((item, index) => (
                      <option
                        value={item?.contact_id}
                        key={index}
                        // selected={parseInt(selectedAcc) === item?.account_id}
                      >
                        {item?.contact_name}
                      </option>
                    ))}
              </select>
              {isInvalid.contact_id && (
                <Form.Control.Feedback type="" className="text-danger mt-1">
                  Please Select Contact.
                </Form.Control.Feedback>
              )}
            </Form.Group>

            {formData.role_type === "site_level" && (
              <Form.Group className={"col"}>
                <Form.Label>Select Site</Form.Label>
                <MultiSelect
                  valueRenderer={renderSelectTitle}
                  options={filteredSites ? filteredSites : []}
                  value={selectedSites}
                  onChange={(e) => handleSiteChange(e)}
                  labelledBy="Select"
                  hasSelectAll={false}
                />

                {/* .map((item) => {
               return {
                 label: item.account_site_name,
                 value: item.account_site_info_id,
                 // disabled: selectedSites.findIndex(
                 //   (obj) => obj.value === item.value
                 // )
                 //   ? true
                 //   : false,
               };
             }) */}

                {isInvalid.site_id && (
                  <Form.Control.Feedback type="" className="text-danger mt-1">
                    Please Select Sites.
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            )}

            <button
              className="btn btn-success text-uppercase ms-2"
              type="submit"
              style={{ marginTop: 25, height: 40 }}
              //    onClick={()=>saveForm(accountId)}
              disabled={loading}
            >
              {loading ? "Loading..." : "Submit"}
            </button>
          </div>
        </Form>

        <div style={{ display: "flex", justifyContent: "right" }}>
          <SearchBarComp
            tableData={userTableData}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            setsortedTableData={setSortedUserTableData}
            key1="account_name"
            key2="contactName"
            key3="assigned_role"
            sortingKey="account_name"
          />
        </div>
        <DataGrid
          className="my-2"
          id=""
          dataSource={sortedUserTableData}
          keyExpr=""
          showBorders={true}
          showRowLines={true}
          columnAutoWidth={true}
          wordWrapEnabled={true}
        >
          {/* <Paging enabled={false} /> */}
          <Paging defaultPageSize={10} defaultPageIndex={0} />

          <Column
            dataField="role_type"
            caption={"Role Type"}
            dataType="string"
            cellRender={(e) => renderRoleType(e.data)}
          />

          <Column
            dataField="account_name"
            caption={"Account Name"}
            dataType="string"
            //   cellRender={(e) => RenderAccTitle(e.data)}
          />

          <Column
            dataField="contactName"
            caption={"Contact Name"}
            dataType="string"
            //   cellRender={(e) => RenderAccTitle(e.data)}
          />

          <Column
            width={350}
            height={"auto"}
            dataField="assigned_role"
            caption={"Role"}
            dataType="string"
            allowSorting={true}
          />

          <Column
            width={350}
            height={"auto"}
            dataField="assigned_site"
            caption={"Assigned Sites"}
            dataType="string"
            cellRender={(e) => {
              return e.data.assigned_site !== "" ? e.data.assigned_site : "N/A";
            }}
            // allowSorting={true}
          />

          <Column
            dataField="modify_date"
            caption={"Assign Date"}
            dataType="string"
            allowSorting={true}
            cellRender={(data) =>
              moment(data?.data.modify_date).isValid()
                ? moment(data?.data.modify_date).format("MM/DD/YYYY h:mm:ss")
                : ""
            }
          />

          <Column
            width={170}
            dataField=""
            caption={"Actions"}
            dataType="string"
            allowSorting={true}
            cellRender={(data) => (
              <>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "5px",
                  }}
                >
                  <button
                    type="button"
                    style={{
                      width: "80px",
                      height: "30px",
                      color: "white",
                      background: "#d32f2f",
                      border: "none",
                      borderRadius: "10px",
                    }}
                    onClick={() => HandleAssign(data?.data)}
                  >
                    Unassign
                  </button>

                  <button
                    className="text-primary"
                    type="button"
                    onClick={() => {
                      setEdit(true);
                      setRowData(data.data);
                    }}
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      border: "none",
                      background: "transparent",
                    }}
                  >
                    <img
                      src="/edit.svg"
                      alt="svg"
                      style={{ marginRight: "0px" }}
                    />
                    <span className="ms-2">Edit</span>
                  </button>
                </div>
              </>
            )}
          />
        </DataGrid>

        <UpdateRoleToUserModal
          updateModal={updateModal}
          setUpdateModal={setUpdateModal}
          contactID={contactID}
          fetchUserTblData={fetchUserTblData}
        />

        {edit && (
          <EditAssignUserRoleModal
            show={edit}
            newRoleDataArr={sortedNewRoleDataArr}
            setShow={setEdit}
            accountList={accountList}
            contactList={sortedContactList}
            roleData={roleData}
            handlePermissionSelect={handlePermissionSelect}
            rowData={rowData}
            fetchUserTblData={fetchUserTblData}
            // allContactSites={allContactSites}
            allSites={allSites}
          />
        )}
      </div>
    </>
  );
};

export default AssignPermissionUser;
