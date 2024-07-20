import React, { useEffect, useState } from "react";
import DataGrid, { Column, Paging } from "devextreme-react/data-grid";
import { Form } from "react-bootstrap";
import { Box } from "@mui/material";
import { CallGETAPI, CallPOSTAPI } from "../../../helper/API";
import { ContactList } from "../../../helper/BasicFn";
import { toast } from "react-toastify";
import EditMultipleAccountModal from "./EditMultipleAccountModal";
import moment from "moment";
import { MultiSelect } from "react-multi-select-component";
import UpdateRoleToMultipleAccountModal from "./UpdateRoleToMultipleAccountModal";
import { sortArrAscending } from "../../../helper/constants";
import SearchBarComp from "./SearchBarComp";

const MultipleAccount = () => {
  const [loading, setLoading] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const [contactList, setContactList] = useState([]);
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
  });

  const [updateModal, setUpdateModal] = useState(false);
  const [contactID, setContactID] = useState("");
  const [sortedAccountList, setSortedAccountList] = useState([]);
  const [multipleAccountl, setMultipleAccountl] = useState([]);
  const [sortedContactList, setSortedContactList] = useState([]);

  const [searchValue, setSearchValue] = useState("");

  const [isInvalid, setIsInvalid] = useState({
    account_id: false,
    contact_id: false,
    role_id: false,
  });

  const fetchLoad = async () => {
    const accountDataRes = await CallGETAPI("account/account-list-user");
    const accountData = accountDataRes?.data?.data?.account || [];
    let sortedArr = sortArrAscending(accountData, "account_name");
    setSortedAccountList(sortedArr);
    setMultipleAccountl(sortedArr);
  };

  useEffect(() => {
    fetchLoad();
    fetchUserTblData();
  }, []);

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
    const tableData = await CallGETAPI("admin/fetch-accounts");
    setUserTableData(tableData?.data?.data || []);
  };

  const handleChange = (e, key) => {
    const { value } = e.target;
    if (key === "account_id") {
      setSelectedAccountId(value);
      const removeAccount = sortedAccountList.filter((item) => {
        return item.account_id != value;
      });
      setMultipleAccountl(removeAccount);
      setFormData((prevState) => ({
        ...prevState,
        role_id: [],
      }));
    }
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
      account_id: false,
      contact_id: false,
      role_id: false,
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

    if (is_false) {
      setIsInvalid(obj);
      return "";
    }

    setLoading(true);
    let rolesArr = formData.role_id;
    let finalRolesArr = rolesArr.map((role) => role.value);
    let body = {
      account_id: formData.account_id,
      contact_id: formData.contact_id,
      accounts_id: finalRolesArr + "",
    };

    const res = await CallPOSTAPI("admin/assign-accounts", body);
    if (res?.data?.status) {
      setLoading(false);
      toast.success(res?.data?.msg);
      fetchUserTblData();
      setFormData({ account_id: "", contact_id: "", role_id: [] });
      setFormKey((prevKey) => prevKey + 1);
    } else {
      setLoading(false);
      toast.error(res?.data?.message);
      setFormData({ account_id: "", contact_id: "", role_id: [] });
    }
  };

  const [sortedNewAccountDataArr, setSortedNewAccountDataArr] = useState([]);
  const [sortedUserTableData, setSortedUserTableData] = useState([]);

  const handleLostVars = () => {
    try {
      const nrda = multipleAccountl.map((obj) => ({
        label: obj.account_name,
        value: obj.account_id,
      }));

      let sortedArr = sortArrAscending(nrda, "label");
      setSortedNewAccountDataArr(sortedArr);
    } catch (e) {}
  };

  useEffect(() => {
    handleLostVars();
  }, [multipleAccountl]);

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

  return (
    <>
      <div
        className="mt-4"
        style={{ position: "relative", width: "100%", paddingInline: "45px" }}
      >
        <Box className="text-left pt-3 pb-1">
          <h4 className="heading">Multiple Account</h4>
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
                    <option value={item?.account_id} key={index}>
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
                  {sortedContactList.map((item, index) => (
                    <option value={item?.contact_id} key={index}>
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

              <Form.Group className={"col"}>
                <Form.Label>Assign Account*</Form.Label>

                <MultiSelect
                  valueRenderer={renderSelectTitle}
                  options={sortedNewAccountDataArr}
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
            tableData={userTableData}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            setsortedTableData={setSortedUserTableData}
            key1="account_name"
            key2="contactName"
            key3="assign_accounts"
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
            dataField="account_name"
            caption={"Account Name"}
            dataType="string"
          />

          <Column
            dataField="contactName"
            caption={"Contact Name"}
            dataType="string"
          />

          <Column
            width={400}
            height={"auto"}
            dataField="assign_accounts"
            caption={"Assign Account"}
            dataType="string"
            allowSorting={true}
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

        <UpdateRoleToMultipleAccountModal
          updateModal={updateModal}
          setUpdateModal={setUpdateModal}
          contactID={contactID}
          fetchUserTblData={fetchUserTblData}
        />

        {edit && (
          <EditMultipleAccountModal
            show={edit}
            setShow={setEdit}
            newRoleDataArr={sortedNewAccountDataArr}
            rowData={rowData}
            fetchUserTblData={fetchUserTblData}
          />
        )}
      </div>
    </>
  );
};

export default MultipleAccount;
