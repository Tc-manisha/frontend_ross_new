import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import {
  Form,
  Button as BButton,
  Button as BsButton,
  InputGroup,
  Button,
} from "react-bootstrap";
import ReactMultiSelectCheckboxes from "react-multiselect-checkboxes";
import { CallGETAPI, CallPOSTAPI } from "../../../helper/API";
import { toast } from "react-toastify";
import { ContactList } from "../../../helper/BasicFn";
import { MultiSelect } from "react-multi-select-component";
import { sortArrAscending } from "../../../helper/constants";

const EditAssignUserRoleModal = ({
  show,
  setShow,
  roleData,
  rowData,
  fetchUserTblData,
}) => {
  const [loading, setLoading] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const [contactList, setContactList] = useState([]);
  const [selectRoleValidations, setSelectRoleValidations] = useState(false);
  const [allSortedRoles, setAllSortedRoles] = useState([]);
  const [allContactSites, setAllContactSites] = useState([]);
  const [currentSites, setCurrentSites] = useState([]);

  const [formData, setFormData] = useState({
    account_id: "",
    contact_id: "",
    role_id: [],
    site_id: [],
    role_type: "",
  });

  const [isInvalid, setIsInvalid] = useState({
    role_id: false,
    site_id: false,
  });

  const handleChange = (e, key) => {
    const { value } = e.target;

    if (key === "account_id") {
      setSelectedAccountId(value);
    }
    setFormData((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const [selectedPermissions, setSelectedPermissions] = useState([]);

  // Function to handle permission selection
  const handlePermissionSelect = (selectedList, selectedItem) => {
    const selectedPermissions = selectedList
      .map((item) => item.value)
      .join(",");

    setSelectedPermissions(selectedList);

    setFormData((prevFormData) => ({
      ...prevFormData,
      role_id: selectedPermissions,
    }));
  };

  const fetchContactData = async (selectedAccountId) => {
    const res = await ContactList(selectedAccountId);

    setContactList(res);
  };

  useEffect(() => {
    if (selectedAccountId !== null) {
      fetchContactData(selectedAccountId);
    }
  }, [selectedAccountId]);

  const handleModalSubmit = async (e) => {
    e.preventDefault();

    let is_false = 0;
    let obj = {
      role_id: false,
      site_id: false,
    };

    if (formData.role_id.length === 0) {
      obj.role_id = true;
      is_false = 1;
    }

    if (formData.role_type === "site_level" && currentSites.length === 0) {
      obj.site_id = true;
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
        currentSites.length > 0
          ? currentSites.map((item) => item.value).toString()
          : "",
      role_id: finalRolesArr + "",
    };

    const res = await CallPOSTAPI(
      "admin/update-permission-user/" + rowData.contact_id,
      body
    );
    if (res?.status) {
      setLoading(false);
      toast.success("Role Updated Successfully");
      setShow(false);
      fetchUserTblData();
      setCurrentSites([]);
    }
  };

  const handleRoleChange = (e) => {
    setFormData({
      ...formData,
      role_id: e,
    });
    setIsInvalid({ ...isInvalid, role_id: false });
    // setSelectRoleValidations(false);
  };

  const renderSelectedTitleNames = () => {
    return [formData.role_id.map((item) => item.label).join(", ")];
  };

  const renderSelectTitle = () => {
    return (
      <div>
        {formData.role_id.length >= 3
          ? `${formData.role_id.length} Selected`
          : renderSelectedTitleNames()}
      </div>
    );
  };

  const handleRoles = () => {
    if (roleData) {
      const nrda = roleData
        .filter((item) => item.role_type === rowData.role_type)
        .map((obj) => ({
          label: obj.role_name,
          value: obj.role_id,
        }));

      let sortedArr = sortArrAscending(nrda, "label");
      const roleIdArray = rowData.role_id.split(",").map(Number);

      const roleIdObj = sortedArr.filter((item) =>
        roleIdArray.includes(item.value)
      );

      setFormData({
        ...formData,
        role_id: roleIdObj,
        account_id: rowData?.account_name,
        contact_id: rowData?.contactName,
        role_type: rowData?.role_type,
      });
      setAllSortedRoles(sortedArr);
    }
  };

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

  const getAllSitesByContactId = async (id, account_id) => {
    try {
      const account_site_reponse = await CallGETAPI(
        `account/account-site-list/${account_id}`
      );
      if (account_site_reponse.data.status) {
        const account_site_list = account_site_reponse.data.data.site_details;

        const response = await CallGETAPI(
          `account/account-site-list-by-contact/${id}`
        );
        if (response.data.status) {
          const current_sites =
            response.data.data !== "" ? response.data.data.site_list : [];

          const commonItems = getCommonItems(
            account_site_list,
            current_sites,
            "id"
          );

          let all_data = commonItems
            ? commonItems.map((item) => {
                return {
                  label: item.account_site_name,
                  value: item.account_site_info_id,
                };
              })
            : [];

          const siteIdArray = rowData.site_id.split(",").map(Number);

          const siteIdObj = all_data.filter((item) =>
            siteIdArray.includes(item.value)
          );

          setCurrentSites(siteIdObj);

          setAllContactSites(all_data);
        }
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (rowData) {
      handleRoles();
      getAllSitesByContactId(rowData.contact_id, rowData.account_id);
    }
  }, [rowData]);

  const renderSelectedSiteNames = () => {
    return [currentSites.map((item) => item.label).join(", ")];
  };

  const renderSiteTitle = () => {
    return (
      <div>
        {currentSites.length >= 6
          ? `${currentSites.length} Selected`
          : renderSelectedSiteNames()}
      </div>
    );
  };

  return (
    <>
      <Modal show={show} onHide={() => setShow(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Assign Role to User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            // className="flex flex-wrap"
            onSubmit={handleModalSubmit}
            noValidate
            // validated={validated}
            //   id="create-new-equipment-form"
          >
            <div
              className="my-4"
              style={{
                display: "flex",
                // flexWrap: "wrap",
                flexDirection: "row",
                alignItems: "center",
                // rowGap: "10%",
                gap: "5%",
                // marginBottom: "50px",
                justifyContent: "space-between",
                // width: "90%",
                margin: "auto",
              }}
            >
              <Form.Group
                // className={"col"} style={{ minWidth: "200px" }}
                style={{ width: "180px" }}
              >
                <Form.Label>Select Role*</Form.Label>

                <MultiSelect
                  hasSelectAll={false}
                  valueRenderer={renderSelectTitle}
                  options={allSortedRoles}
                  value={formData.role_id}
                  onChange={(e) => handleRoleChange(e)}
                  labelledBy="Select"
                />

                {isInvalid.role_id && (
                  <Form.Control.Feedback type="" className="text-danger mt-1">
                    Please Select Role.
                  </Form.Control.Feedback>
                )}
              </Form.Group>

              <Form.Group
              // className={"col"}
              // style={{ minWidth: "200px", maxWidth: "300px" }}
              >
                <Form.Label>Select Account</Form.Label>
                <Form.Control
                  type="text"
                  name="account_id"
                  value={formData.account_id}
                  onChange={(e) => handleChange(e, "account_id")}
                  // required
                  disabled={true}
                />
                {/* <select
                    className="form-control"
                    value={formData.account_id}
                    name="account_id"
                    placeholder="Enter Role Name"
                    onChange={(e) => {
                      handleChange(e, "account_id");
                    }}
                  >
                    <option value="">--Select One--</option>
                    {accountList.map((item, index) => (
                      <option
                        value={item?.account_id}
                        key={index}
                        // selected={parseInt(selectedAcc) === item?.account_id}
                      >
                        {item?.account_name}
                      </option>
                    ))}
                  </select> */}
              </Form.Group>

              <Form.Group
              // className={"col"}
              // style={{ minWidth: "200px", maxWidth: "300px" }}
              >
                <Form.Label>Select Contact</Form.Label>
                <Form.Control
                  type="text"
                  name="contact_id"
                  value={formData.contact_id}
                  onChange={(e) => handleChange(e, "contact_id")}
                  // required
                  disabled={true}
                />
                {/* <select
                    className="form-control"
                    value={formData.contact_id}
                    name="contact_id"
                    placeholder="Enter Role Name"
                    onChange={(e) => handleChange(e, "contact_id")}
                  >
                    <option value="">--Select One--</option>
                    {contactList.map((item, index) => (
                      <option
                        value={item?.contact_id}
                        key={index}
                        // selected={parseInt(selectedAcc) === item?.account_id}
                      >
                        {item?.contact_name}
                      </option>
                    ))}
                  </select> */}
              </Form.Group>

              {formData.role_type === "site_level" && (
                <Form.Group
                  // className={"col mt-3"}
                  style={{ width: "180px" }}
                >
                  <Form.Label>Select Site</Form.Label>
                  <MultiSelect
                    valueRenderer={renderSiteTitle}
                    options={allContactSites ? allContactSites : []}
                    value={currentSites}
                    onChange={(e) => {
                      setCurrentSites(e);
                      setIsInvalid({ ...isInvalid, site_id: false });
                    }}
                    labelledBy="Select"
                    hasSelectAll={false}
                  />

                  {isInvalid.site_id && (
                    <Form.Control.Feedback type="" className="text-danger mt-1">
                      Please Select Sites.
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              )}
            </div>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <div className=" d-flex justify-content-end">
            <button
              className="btn btn-danger mt-0"
              type="button"
              onClick={() => setShow(false)}
            >
              Cancel
            </button>
            &nbsp;
            <Button
              variant="success"
              // type="submit"
              onClick={(e) => handleModalSubmit(e)}
              className="mt-0"
              disabled={loading}
            >
              {loading ? "Loading..." : "Submit"}
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EditAssignUserRoleModal;
