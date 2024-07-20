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
import { CallPOSTAPI } from "../../../helper/API";
import { toast } from "react-toastify";
import { MultiSelect } from "react-multi-select-component";
import { faLessThanEqual } from "@fortawesome/free-solid-svg-icons";
import CustomToggleButton2 from "../../../components/common/toggleSwitch/CustomToggle2";

const EditAssignCreateModal = ({
  show,
  setShow,
  roleData,
  rowData,
  newRoleDataArr,
  fetchCreateTblData,
}) => {
  const initialPermisisonsValuesArr = rowData.permission_group_id
    .split(",")
    .map(Number);
  const filteredPermissionsArray = newRoleDataArr.filter((item) =>
    initialPermisisonsValuesArr.includes(item.value)
  );

  const [validated, setValidated] = useState(false);
  const [formData, setFormData] = useState({
    role_name: rowData?.role_name,
    permissions: filteredPermissionsArray,
    is_admin_role: rowData?.is_admin_role,
    role_type: rowData?.role_type || "",
  });
  const [permissionsValidations, setPermisionsValidation] = useState(false);
  const [roleNameValidations, setRoleNameValidations] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleChange = (e, fieldName) => {
    const { value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [fieldName]: value,
    }));
  };

  const [isInvalid, setIsInvalid] = useState({
    role_name: false,
    permissions: false,
    role_type: false,
  });

  const [selectedPermissions, setSelectedPermissions] = useState([]);

  // Function to handle permission selection
  const handlePermissionSelect = (selectedList, selectedItem) => {
    console.log(selectedList);
    const selectedPermissions = selectedList
      .map((item) => item.value)
      .join(",");
    console.log(selectedPermissions);
    setSelectedPermissions(selectedList);
    console.log(selectedList);
    setFormData((prevFormData) => ({
      ...prevFormData,
      permissions: selectedPermissions,
    }));
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();

    let is_false = 0;
    let obj = {
      role_name: false,
      permissions: false,
    };

    if (formData.role_name.trim() === "") {
      obj.role_name = true;
      is_false = 1;
    }

    if (formData.permissions.length === 0) {
      obj.permissions = true;
      is_false = 1;
    }

    if (formData.role_type.trim() === "") {
      obj.role_type = true;
      is_false = 1;
    }

    if (is_false) {
      setIsInvalid(obj);
      return "";
    }

    setLoading(true);

    if (formData.role_name === "") {
      // setValidated(true);
      setRoleNameValidations(true);
      return;
    }

    if (formData?.permissions === "") {
      console.log("hii");
      setPermisionsValidation(true);
      return;
    }
    let permissionArr = formData.permissions;
    let finalPermissionsArr = permissionArr.map(
      (permission) => permission.value
    );
    let body = { ...formData, permissions: finalPermissionsArr + "" };

    const res = await CallPOSTAPI(
      "admin/update-permission-group/" + rowData?.role_id,
      body
    );
    if (res?.status) {
      toast.success("Role Updated Successfully");
      setShow(false);
      fetchCreateTblData();
      setFormData({ role_name: "", permissions: "" });
    }
  };

  // useEffect(() => {
  //   // Filter out the options based on formData.permissions
  //   const permissionIds = (formData.permissions || "").toString().split(",");
  //   const filteredOptions = roleData.filter(
  //     (item) => permissionIds.includes(item.pr_id)
  //   );
  //   setSelectedPermissions(filteredOptions);
  // }, [formData.permissions, roleData]);

  const handlePermissionsChange = (e) => {
    setFormData({
      ...formData,
      permissions: e,
    });
    setIsInvalid({ ...isInvalid, permissions: false });
  };

  const renderSelectedTitleNames = () => {
    return [formData.permissions.map((item) => item.label).join(", ")];
  };

  const renderSelectTitle = () => {
    return (
      <div>
        {formData.permissions.length >= 3
          ? `${formData.permissions.length} Selected`
          : renderSelectedTitleNames()}
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

  return (
    <>
      <Form
        className=""
        onSubmit={handleModalSubmit}
        noValidate
        validated={validated}
        id="create-new-equipment-form"
      >
        <Modal show={show} onHide={() => setShow(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Edit Create Role</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div
              className="my-4"
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "5%",
                // marginBottom: "50px",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  width: "fit-content",
                  flexWrap: "wrap",
                  gap: "5%",
                }}
              >
                <Form.Group className={"col"} style={{ width: 350 }}>
                  <Form.Label>Enter Role Name*</Form.Label>
                  <Form.Control
                    type="text"
                    name="role_name"
                    value={formData.role_name}
                    onChange={(e) => {
                      handleChange(e, "role_name");
                      setIsInvalid({ ...isInvalid, role_name: false });
                      setRoleNameValidations(false);
                    }}
                    required
                  />
                  {isInvalid.role_name && (
                    <Form.Control.Feedback type="" className="text-danger mt-1">
                      Role name is required.
                    </Form.Control.Feedback>
                  )}
                </Form.Group>

                <Form.Group className={"col"} style={{ width: 250 }}>
                  <Form.Label>Select Permissions*</Form.Label>

                  <MultiSelect
                    valueRenderer={renderSelectTitle}
                    options={newRoleDataArr}
                    hasSelectAll={false}
                    value={formData.permissions}
                    onChange={(e) => handlePermissionsChange(e)}
                    labelledBy="Select"
                  />

                  {isInvalid.permissions && (
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
                    disabled={formData?.role_type != "" ? true : false}
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
              </div>
            </div>
          </Modal.Body>

          <Modal.Footer>
            <div className=" d-flex justify-content-end">
              <button
                className="btn btn-danger text-uppercase ms-2"
                type="button"
                onClick={(e) => setShow(false)}
              >
                Cancel
              </button>
              &nbsp;
              <button
                className="btn btn-success text-uppercase ms-2"
                type="submit"
                // style={{ marginTop: "30px" }}
                onClick={handleModalSubmit}
                disabled={loading}
              >
                {loading ? "Loading..." : "Submit"}
              </button>
            </div>
          </Modal.Footer>
        </Modal>
      </Form>
    </>
  );
};

export default EditAssignCreateModal;
