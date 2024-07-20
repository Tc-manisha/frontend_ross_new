import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { Form, Button } from "react-bootstrap";
import { CallPOSTAPI } from "../../../helper/API";
import { toast } from "react-toastify";
import { MultiSelect } from "react-multi-select-component";

const EditAssignAdminModal = ({
  show,
  setShow,
  newAdminRoleDataArr,
  newUserRoleDataArr,
  rowData,
  fetchUserTblData,
}) => {
  const initialRolesValuesArr = rowData.role_id.split(",").map(Number);
  const filteredRolesArray = newAdminRoleDataArr.filter((item) =>
    initialRolesValuesArr.includes(item.value)
  );

  const initialUserRolesValuesArr = rowData.role_id.split(",").map(Number);
  const filteredUserRolesArray = newUserRoleDataArr.filter((item) =>
    initialUserRolesValuesArr.includes(item.value)
  );

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    contact_id: rowData?.contactName,
    admin_role_id: filteredRolesArray,
    user_role_id: filteredUserRolesArray,
  });
  const [isInvalid, setIsInvalid] = useState({
    admin_role_id: filteredRolesArray.length > 0 ? false : true,
    user_role_id: filteredUserRolesArray.length > 0 ? false : true,
  });

  const handleChange = (e, key) => {
    const { value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();

    let is_false = 0;
    let obj = {
      admin_role_id: false,
      user_role_id: false,
    };

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
      admin_role_id: finalAdminRolesArr + "",
      user_role_id: finalUserRolesArr + "",
    };

    const res = await CallPOSTAPI(
      "admin/update-role-admin-user/" + rowData.contact_id,
      body
    );
    if (res?.status) {
      setLoading(false);
      toast.success("Role Updated Successfully");
      setShow(false);
      fetchUserTblData();
    }
  };

  const handleRoleChange = (roleType, e) => {
    setFormData({
      ...formData,
      [roleType]: e,
    });
    setIsInvalid({ ...isInvalid, [roleType]: !isInvalid[roleType] });
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
      <Modal show={show} onHide={() => setShow(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Assign Admin</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="" onSubmit={handleModalSubmit} noValidate>
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
                <Form.Group
                  className={"col"}
                  style={{ minWidth: "200px", maxWidth: "300px" }}
                >
                  <Form.Label>Select Contact</Form.Label>
                  <Form.Control
                    type="text"
                    name="contact_id"
                    value={formData.contact_id}
                    onChange={(e) => handleChange(e, "contact_id")}
                    disabled={true}
                  />
                </Form.Group>

                <Form.Group className={"col"} style={{ minWidth: "200px" }}>
                  <Form.Label>Select Admin Role*</Form.Label>

                  <MultiSelect
                    hasSelectAll={false}
                    valueRenderer={() => renderSelectTitle("admin_role_id")}
                    options={newAdminRoleDataArr}
                    value={formData.admin_role_id}
                    onChange={(e) => handleRoleChange("admin_role_id", e)}
                    labelledBy="Select"
                  />

                  {/*{isInvalid.admin_role_id && (
                    <Form.Control.Feedback type="" className="text-danger mt-1">
                      Please Select Admin Role.
                    </Form.Control.Feedback>
                  )}*/}
                </Form.Group>

                <Form.Group className={"col"} style={{ minWidth: "200px" }}>
                  <Form.Label>Select User Role*</Form.Label>

                  <MultiSelect
                    hasSelectAll={false}
                    valueRenderer={() => renderSelectTitle("user_role_id")}
                    options={newUserRoleDataArr}
                    value={formData.user_role_id}
                    onChange={(e) => handleRoleChange("user_role_id", e)}
                    labelledBy="Select"
                  />

                  {/*{isInvalid.user_role_id && (
                    <Form.Control.Feedback type="" className="text-danger mt-1">
                      Please Select User Role.
                    </Form.Control.Feedback>
                  )}*/}
                </Form.Group>
              </div>
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
              onClick={(e) => handleModalSubmit(e)}
              className="mt-0"
              disabled={
                loading === false
                  ? isInvalid.admin_role_id === false
                    ? false
                    : isInvalid.user_role_id === false
                    ? false
                    : true
                  : true
              }
            >
              {loading ? "Loading..." : "Submit"}
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EditAssignAdminModal;
