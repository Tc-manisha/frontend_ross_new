import React, { useEffect, useState } from "react";
import DataGrid, { Column, Paging } from "devextreme-react/data-grid";
import { Form } from "react-bootstrap";
import { Box } from "@mui/material";
import { CallGETAPI, CallPOSTAPI } from "../../../helper/API";
import { GetContactList } from "../../../helper/BasicFn";
import { toast } from "react-toastify";
import EditAssignAdminModal from "./EditAssignAdminModal";
import moment from "moment";
import { MultiSelect } from "react-multi-select-component";
import UpdateRoleToUserModal from "./UpdateRoleToUserModal";
import { sortArrAscending } from "../../../helper/constants";
import SearchBarComp from "./SearchBarComp";

const AssignAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [roleData, setRoleData] = useState([]);
  const [userTableData, setUserTableData] = useState([]);
  const [edit, setEdit] = useState(false);
  const [rowData, setRowData] = useState("");
  const [formKey, setFormKey] = useState(0);
  const [formData, setFormData] = useState({
    contact_id: "",
    admin_role_id: [],
    user_role_id: [],
  });
  const [updateModal, setUpdateModal] = useState(false);
  const [contactID, setContactID] = useState("");
  const [sortedContactList, setSortedContactList] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [isInvalid, setIsInvalid] = useState({
    contact_id: true,
    admin_role_id: true,
    user_role_id: true,
  });

  const fetchLoad = async () => {
    const contactDataRes = await GetContactList();
    const contactData = contactDataRes?.data?.data?.contact_list || [];

    let sortedArr = sortArrAscending(contactData, "contact_name");
    setSortedContactList(sortedArr);

    const res = await CallGETAPI("admin/get-permission-group");
    const roleDataRes = res?.data?.data || [];
    setRoleData(roleDataRes);
  };

  useEffect(() => {
    fetchLoad();
    fetchUserTblData();
  }, []);

  const fetchUserTblData = async () => {
    const tableData = await CallGETAPI("admin/fetch-admin-user-role");
    setUserTableData(tableData?.data?.data || []);
  };

  const handleChange = (e, key) => {
    const { value } = e.target;
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
      contact_id: false,
      admin_role_id: false,
      user_role_id: false,
    };

    if (formData.contact_id === "") {
      obj.contact_id = true;
      is_false = 1;
    }

    if (
      formData.admin_role_id.length === 0 &&
      formData.user_role_id.length === 0
    ) {
      obj.admin_role_id = true;
      obj.user_role_id = true;
      is_false = 1;
    }

    if (is_false) {
      setIsInvalid(obj);
      return "";
    }

    setLoading(true);
    let adminRolesArr = formData.admin_role_id;
    let finalAdminRolesArr = adminRolesArr.map((role) => role.value);

    let userRolesArr = formData.user_role_id;
    let finalUserRolesArr = userRolesArr.map((role) => role.value);

    let body = {
      contact_id: formData.contact_id,
      admin_role_id: finalAdminRolesArr + "",
      user_role_id: finalUserRolesArr + "",
    };

    const res = await CallPOSTAPI("admin/assign-admin-user-role", body);
    console.log(res);
    if (res?.data?.status) {
      setLoading(false);
      toast.success(res?.data?.msg);
      fetchUserTblData();
      setFormData({ contact_id: "", admin_role_id: [], user_role_id: [] });
      setFormKey((prevKey) => prevKey + 1);
    } else {
      setLoading(false);
      toast.error(res?.data?.message);
      setFormData({ contact_id: "", admin_role_id: [], user_role_id: [] });
    }
    setIsInvalid({ contact_id: true, admin_role_id: true, user_role_id: true });
  };

  const [sortedNewRoleDataArr, setSortedNewRoleDataArr] = useState([]);
  const [sortedAdminRoleDataArr, setSortedAdminRoleDataArr] = useState([]);
  const [sortedUserTableData, setSortedUserTableData] = useState([]);

  const handleLostVars = () => {
    try {
      const adminRoles = roleData
        .map((obj) => {
          if (obj.is_admin_role === 1) {
            return { label: obj.role_name, value: obj.role_id };
          }
          return null;
        })
        .filter((item) => item !== null);

      let sortedAdminArr = sortArrAscending(adminRoles, "label");
      setSortedAdminRoleDataArr(sortedAdminArr);

      const userRoles = roleData
        .map((obj) => {
          if (obj.is_admin_role === 0) {
            return { label: obj.role_name, value: obj.role_id };
          }
          return null;
        })
        .filter((item) => item !== null);

      let sortedUserArr = sortArrAscending(userRoles, "label");
      setSortedNewRoleDataArr(sortedUserArr);
    } catch (e) {}
  };

  useEffect(() => {
    handleLostVars();
  }, [roleData]);

  useEffect(() => {
    let sortedArr = sortArrAscending(userTableData, "contactName");
    setSortedUserTableData(sortedArr);
  }, [userTableData]);

  const handleRoleChange = (roleType, e) => {
    setFormData({
      ...formData,
      [roleType]: e,
    });
    setIsInvalid({
      ...isInvalid,
      [roleType]: !isInvalid[roleType],
    });
  };

  const renderSelectedTitleNames = (roleType) => {
    return formData[roleType].map((item) => item.label).join(", ");
  };

  const renderSelectTitle = (roleType) => {
    return (
      <div>
        {formData[roleType].length === 0
          ? "Select"
          : formData[roleType].length >= 3
          ? `${formData[roleType].length} Selected`
          : renderSelectedTitleNames(roleType)}
      </div>
    );
  };

  return (
    <>
      <div
        className="mt-4"
        style={{ position: "relative", width: "100%", paddingInline: "45px" }}
      >
        <Box className="text-left pt-3 pb-1">
          <h4 className="heading">Assign Admin</h4>
        </Box>

        <Form
          key={formKey}
          className=""
          onSubmit={handleSubmit}
          noValidate
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
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                width: "70%",
                gap: "5%",
              }}
            >
              <Form.Group className={"col"} style={{ maxWidth: "300px" }}>
                <Form.Label>Select Contact*</Form.Label>
                <select
                  className="form-control"
                  value={formData.contact_id}
                  name="contact_id"
                  placeholder="Enter Contact Name"
                  onChange={(e) => {
                    handleChange(e, "contact_id");
                    setIsInvalid({ ...isInvalid, contact_id: false });
                  }}
                  required
                >
                  <option value="" disabled>--Select One--</option>
                  {sortedContactList?.filter((item) => item.status === 1)?.map((item, index) => (
                    <option value={item?.contact_id} key={index}>
                      {item?.contact_name}
                    </option>
                  ))}
                </select>
                {/*{isInvalid.contact_id && (
                  <Form.Control.Feedback type="" className="text-danger mt-1">
                    Please Select Contact.
                  </Form.Control.Feedback>
                )}*/}
              </Form.Group>

              <Form.Group className={"col"} style={{ maxWidth: "300px" }}>
                <Form.Label>Admin Role</Form.Label>

                <MultiSelect
                  valueRenderer={() => renderSelectTitle("admin_role_id")}
                  options={sortedAdminRoleDataArr}
                  value={formData.admin_role_id}
                  onChange={(e) => handleRoleChange("admin_role_id", e)}
                  labelledBy="Select"
                  hasSelectAll={false}
                />

                {/*{isInvalid.admin_role_id && (
                  <Form.Control.Feedback type="" className="text-danger mt-1">
                    Please Select Admin Role.
                  </Form.Control.Feedback>
                )}*/}
              </Form.Group>

              <Form.Group className={"col"}>
                <Form.Label>User Role</Form.Label>

                <MultiSelect
                  valueRenderer={() => renderSelectTitle("user_role_id")}
                  options={sortedNewRoleDataArr}
                  value={formData.user_role_id}
                  onChange={(e) => handleRoleChange("user_role_id", e)}
                  labelledBy="Select"
                  hasSelectAll={false}
                />

                {/*{isInvalid.user_role_id && (
                  <Form.Control.Feedback type="" className="text-danger mt-1">
                    Please Select User Role.
                  </Form.Control.Feedback>
                )}*/}
              </Form.Group>

              <button
                className="btn btn-success text-uppercase ms-2"
                type="submit"
                style={{ marginTop: 25, height: 40 }}
                disabled={
                  loading === false
                    ? isInvalid.contact_id === false
                      ? isInvalid.admin_role_id === false
                        ? false
                        : isInvalid.user_role_id === false
                        ? false
                        : true
                      : true
                    : true
                }
              >
                {loading ? "Loading..." : "Submit"}
              </button>
            </div>
          </div>
        </Form>

        <div style={{ display: "flex", justifyContent: "right" }}>
          <SearchBarComp
            tableData={userTableData}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            setsortedTableData={setSortedUserTableData}
            key1="contactName"
            key2="adminRole"
            key3="userRole"
            sortingKey="contactName"
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
            dataField="contactName"
            caption={"Contact Name"}
            dataType="string"
          />

          <Column
            dataField="adminRole"
            caption={"Admin Role"}
            dataType="string"
            allowSorting={true}
            cellRender={(data) =>
              data?.data.adminRole.length !== 0 ? data?.data.adminRole : "N/A"
            }
          />

          <Column
            dataField="userRole"
            caption={"User Role"}
            dataType="string"
            allowSorting={true}
            cellRender={(data) =>
              data?.data.userRole.length !== 0 ? data?.data.userRole : "N/A"
            }
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
          <EditAssignAdminModal
            show={edit}
            setShow={setEdit}
            newAdminRoleDataArr={sortedAdminRoleDataArr}
            newUserRoleDataArr={sortedNewRoleDataArr}
            contactList={sortedContactList}
            roleData={roleData}
            rowData={rowData}
            fetchUserTblData={fetchUserTblData}
          />
        )}
      </div>
    </>
  );
};

export default AssignAdmin;
