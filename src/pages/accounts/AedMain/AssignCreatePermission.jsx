import React, { useState, useEffect } from "react";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
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
  Button,
} from "react-bootstrap";
import { Box } from "@mui/material";
// import Select from '@mui/material/Select';
// import Multiselect from 'multiselect-react-dropdown';
import ReactMultiSelectCheckboxes from "react-multiselect-checkboxes";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import "../../../../src/global.css";
import { CallGETAPI, CallPOSTAPI } from "../../../helper/API";
import Moment from "react-moment";
import EditAssignCreateModal from "./EditAssignCreateModal";
import { toast } from "react-toastify";
import moment from "moment";
import { MultiSelect } from "react-multi-select-component";
import UpdateRoleStatus from "./UpdateRoleStatus";
import CustomToggleButton2 from "../../../components/common/toggleSwitch/CustomToggle2";
import { sortArrAscending } from "../../../helper/constants";
import SearchBarComp from "./SearchBarComp";

const customStyles = {
  // control: styles => ({ ...styles,
  // width:"300px"
  // }),
  control: (css) => ({ ...css, display: "inline-flex " }),
  valueContainer: (css) => ({
    ...css,
    ...(menuWidth && { width: menuWidth }),
  }),
};

const AssignCreatePermission = () => {
  const [formData, setFormData] = useState({
    role_name: "",
    permissions: [],
    is_admin_role: false,
    role_type: "",
  });

  const [loading, setLoading] = useState(false);
  const [roleData, setRoleData] = useState([]);
  const [createTableData, setCreateTableData] = useState([]);
  const [orgCreateTableData, setOrgCreateTableData] = useState([]);
  const [edit, setEdit] = useState(false);
  const [show, setShow] = useState("");
  const [rowData, setRowData] = useState("");
  const [validated, setValidated] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [permissionsValidations, setPermisionsValidation] = useState(false);
  const [roleNameValidations, setRoleNameValidations] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [roleId, setRoleId] = useState("");
  const [active, setActive] = useState("");
  const [sortedNewRoleDataArr, setSortedNewRoleDataArr] = useState([]);
  const [sortedTableData, setsortedTableData] = useState([]);
  const [roleType, setRoleType] = useState("");

  const [searchValue, setSearchValue] = useState("");

  const [isInvalid, setIsInvalid] = useState({
    role_name: false,
    permissions: false,
    role_type: false,
  });

  // Fetch role data
  const fetchData = async () => {
    try {
      const res = await CallGETAPI("admin/get-permission");
      setRoleData(res?.data?.data || []);
      console.log(res.data.data);
    } catch (error) {
      console.error("Error fetching role data:", error);
    }
  };

  const fetchCreateTblData = async () => {
    const tableData = await CallGETAPI(
      "admin/get-permissiongroup-with-permission"
    );
    console.log(tableData);
    setCreateTableData(tableData?.data?.data || []);
  };

  useEffect(() => {
    fetchData();
    fetchCreateTblData();
  }, []);

  const handleChange = (e, fieldName) => {
    const { value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [fieldName]: value,
    }));
  };

  // Function to handle permission selection
  const handlePermissionSelect = (selectedList, selectedItem) => {
    const selectedPermissions = selectedList
      .map((item) => item.value)
      .join(",");
    console.log(selectedPermissions);
    setFormData((prevFormData) => ({
      ...prevFormData,
      permissions: selectedPermissions,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let errors = {};

    if (formData.role_name.trim() === "") {
      errors.role_name = true;
    }
    if (formData.permissions.length === 0) {
      errors.permissions = true;
    }

    if (formData.role_type.trim() === "") {
      errors.role_type = true;
    }

    if (Object.keys(errors).length > 0) {
      setIsInvalid({ ...isInvalid, ...errors });
      return;
    }

    // const form = e.currentTarget;
    // if (form.checkValidity() === false && formData?.permissions) {
    //   setRoleNameValidations(true);
    //   setPermisionsValidation(true);
    //   setValidated(true);
    //   return;
    // }

    // if (form.checkValidity() === false) {
    //   setRoleNameValidations(true);
    //   setValidated(true);
    //   return;
    // }

    // if (formData?.permissions === "") {
    //   setPermisionsValidation(true);
    //   return;
    // }

    setLoading(true);
    let permissionArr = formData?.permissions;
    let finalPermissionsArr = permissionArr.map(
      (permission) => permission.value
    );
    let body = { ...formData, permissions: finalPermissionsArr + "" };

    const res = await CallPOSTAPI("admin/create-permission-group", body);
    if (res?.status) {
      setLoading(false);
      toast.success("Role Created Successfully");
      fetchCreateTblData();
      setFormData({ role_name: "", permissions: [] });
      setFormKey((prevKey) => prevKey + 1);
      setValidated(false);
    }
  };

  const HandleActivate = async (data) => {
    setActive(data?.active);
    setRoleId(data?.role_id);
    setUpdateModal(true);
  };

  const [newRoleDataArr, setNewRoleDataArr] = useState([]);
  const handleLostVars = () => {
    try {
      const nrda = roleData.map((obj) => ({
        label: obj.permissions,
        value: obj.pr_id,
      }));

      let sortedArr = sortArrAscending(nrda, "label");
      setSortedNewRoleDataArr(sortedArr);

      setNewRoleDataArr(nrda);
    } catch (e) {}
  };

  useEffect(() => {
    handleLostVars();
  }, [roleData]);

  useEffect(() => {
    let sortedArr = sortArrAscending(createTableData, "role_name");
    setsortedTableData(sortedArr);
  }, [createTableData]);

  const handlePermissionsChange = (e) => {
    setFormData({
      ...formData,
      permissions: e,
    });
    setValidated(false);
    setPermisionsValidation(false);
  };

  const renderSelectedTitleNames = () => {
    return [formData.permissions.map((item) => item.label).join(", ")];
  };

  const renderSelectTitle = () => {
    return (
      <div>
        {formData.permissions.length === 0
          ? "Select"
          : formData.permissions.length >= 3
          ? `${formData.permissions.length} Selected`
          : renderSelectedTitleNames()}
      </div>
    );
  };

  const RenderIsAdmin = (data) => {
    return (
      <div>
        {data?.is_admin_role ? (
          <>
            <DoneIcon style={{ color: "green", height: 30, width: 30 }} />
          </>
        ) : (
          <>
            <CloseIcon style={{ color: "red", height: 30, width: 30 }} />
          </>
        )}
      </div>
    );
  };

  const handleToggleChange = () => {
    if (formData.is_admin_role) {
      setFormData({ ...formData, is_admin_role: 0 });
    } else {
      setFormData({ ...formData, is_admin_role: 1 });
    }
  };

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
      <div className="mt-4" style={{ width: "100%", paddingInline: "45px" }}>
        <Box className="text-left pt-3 pb-1">
          <h4 className="heading">Create Role</h4>
        </Box>

        <Form
          key={formKey}
          className=""
          onSubmit={handleSubmit}
          noValidate
          validated={validated}
          id="create-new-equipment-form"
        >
          <div
            className="my-4"
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "4%",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                width: "fit-content",
                gap: "5%",
              }}
            >
              <Form.Group className={"col"} style={{ width: 400 }}>
                <Form.Label>Enter Role Name*</Form.Label>
                <Form.Control
                  placeholder="Enter Role Name"
                  // style={{ borderColor: isInvalid?.role_name ? '#DC3545' : '' }}
                  type="text"
                  name="role_name"
                  value={formData?.role_name}
                  onChange={(e) => {
                    handleChange(e, "role_name");
                    setIsInvalid({ ...isInvalid, role_name: false });
                  }}
                  required
                  // isInvalid={validated && formData.role_name === ""}
                />
                {isInvalid?.role_name && (
                  <Form.Control.Feedback type="" className="text-danger mt-1">
                    Role name is required.
                  </Form.Control.Feedback>
                )}
              </Form.Group>

              <Form.Group className={"col"} style={{ width: 300 }}>
                <Form.Label>Select Permissions*</Form.Label>

                <MultiSelect
                  valueRenderer={renderSelectTitle}
                  options={sortedNewRoleDataArr}
                  value={formData?.permissions}
                  hasSelectAll={false}
                  onChange={(e) => {
                    handlePermissionsChange(e);
                    setIsInvalid({ ...isInvalid, permissions: false });
                  }}
                  labelledBy="Select"
                />

                {isInvalid?.permissions && (
                  <Form.Control.Feedback type="" className="text-danger mt-1">
                    Permissions are required.
                  </Form.Control.Feedback>
                )}
              </Form.Group>

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

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <Form.Label>Admin Role</Form.Label>
                <CustomToggleButton2
                  ToggleName="admin_role_status"
                  ToggleValue={formData?.is_admin_role}
                  changeHandler={handleToggleChange}
                  is_read_only={false}
                />
              </div>

              <button
                className="btn btn-success text-uppercase ms-2"
                type="submit"
                style={{ marginTop: 25, height: 40 }}
                disabled={loading}
              >
                {loading ? "Loading..." : "Submit"}
              </button>
            </div>
          </div>
        </Form>

        <div style={{ display: "flex", justifyContent: "right" }}>
          <SearchBarComp
            tableData={createTableData}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            setsortedTableData={setsortedTableData}
            key1="role_name"
            key2="permissions"
            // status='active'
            sortingKey="role_name"
          />
        </div>

        <DataGrid
          className="my-2"
          id=""
          dataSource={sortedTableData}
          keyExpr=""
          showBorders={true}
          // height={ 500 }
          showRowLines={true}
          columnAutoWidth={true}
          wordWrapEnabled={true}
        >
          {/* <Paging enabled={false} /> */}
          <Paging defaultPageSize={10} defaultPageIndex={0} />

          <Column
            width={120}
            dataField="role_type"
            caption={"Role Type"}
            dataType="string"
            cellRender={(e) => renderRoleType(e.data)}
          />

          <Column
            dataField="role_name"
            caption={"Role Name"}
            dataType="string"
            //   cellRender={(e) => RenderAccTitle(e.data)}
          />
          <Column
            width={300}
            dataField="permissions"
            caption={"Role"}
            dataType="string"
            //   cellRender={(e) => RenderEqupment(e.data)}
            allowSorting={true}
          />
          <Column
            width={120}
            dataField="is_admin_role"
            caption={"Admin Role"}
            dataType="string"
            cellRender={(e) => RenderIsAdmin(e.data)}
            allowSorting={true}
          />
          <Column
            dataField="created_date"
            caption={"Created Date"}
            cellRender={(data) =>
              moment(data?.data.created_date).isValid()
                ? moment(data?.data.created_date).format("MM/DD/YYYY h:mm:ss")
                : ""
            }
            allowSorting={true}
          />
          <Column
            allowSorting={true}
            dataField="modify_date"
            caption={"Modified Date"}
            cellRender={(data) =>
              moment(data?.data.modify_date).isValid()
                ? moment(data?.data.modify_date).format("MM/DD/YYYY h:mm:ss")
                : ""
            }
          />
          <Column
            dataField="active"
            caption={"Status"}
            dataType="string"
            allowSorting={true}
            cellRender={(data) => (
              <>
                <div
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: "7px",
                    width: "140px",
                  }}
                >
                  {data && data?.data.active === 0 ? (
                    <span
                      type="text"
                      style={{
                        width: "70px",
                        height: "30px",
                        color: "#d32f2f",
                        background: "transparent",
                        border: "none",
                      }}
                    >
                      Deactivate
                    </span>
                  ) : (
                    <span
                      type="text"
                      // className="ms-2"
                      style={{
                        width: "70px",
                        height: "30px",
                        color: "green",
                        background: "transparent",
                        border: "none",
                      }}
                    >
                      Activate
                    </span>
                  )}
                </div>
              </>
            )}
          />
          <Column
            width={170}
            dataField=""
            caption={"Actions"}
            dataType="string"
            allowSorting={true}
            captionStyle={{ textAlign: "left" }}
            cellRender={(data) => (
              <>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  {data && data?.data.active === 1 ? (
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
                      onClick={() => HandleActivate(data?.data)}
                    >
                      Deactivate
                    </button>
                  ) : (
                    <button
                      type="button"
                      // className="ms-2"
                      style={{
                        width: "80px",
                        height: "30px",
                        color: "white",
                        background: "green",
                        border: "none",
                        borderRadius: "10px",
                      }}
                      onClick={() => HandleActivate(data?.data)}
                    >
                      Activate
                    </button>
                  )}

                  {data.data.is_edit === 1 && (
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
                  )}
                </div>
              </>
            )}
          />
        </DataGrid>

        <UpdateRoleStatus
          updateModal={updateModal}
          setUpdateModal={setUpdateModal}
          roleId={roleId}
          active={active}
          fetchCreateTblData={fetchCreateTblData}
        />

        {edit && (
          <EditAssignCreateModal
            show={edit}
            newRoleDataArr={sortedNewRoleDataArr}
            setShow={setEdit}
            rowData={rowData}
            handlePermissionSelect={handlePermissionSelect}
            roleData={roleData}
            fetchCreateTblData={fetchCreateTblData}
          />
        )}
      </div>
    </>
  );
};

export default AssignCreatePermission;
