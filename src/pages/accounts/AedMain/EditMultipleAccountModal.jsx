import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { Form, Button } from "react-bootstrap";
import { CallPOSTAPI } from "../../../helper/API";
import { toast } from "react-toastify";
import { ContactList } from "../../../helper/BasicFn";
import { MultiSelect } from "react-multi-select-component";

const EditMultipleAccountModal = ({
  show,
  setShow,
  newRoleDataArr,
  rowData,
  fetchUserTblData,
}) => {
  const initialRolesValuesArr = rowData.account_id.split(",").map(Number);
  const filteredRolesArray = newRoleDataArr.filter((item) =>
    initialRolesValuesArr.includes(item.value)
  );

  const [loading, setLoading] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const [contactList, setContactList] = useState([]);
  const [selectRoleValidations, setSelectRoleValidations] = useState(false);
  const [accounctListData, setAccounctListData] = useState([]);
  const [formData, setFormData] = useState({
    account_id: rowData?.account_name,
    contact_id: rowData?.contactName,
    role_id: filteredRolesArray,
  });

  useEffect(()=>{
    const removeAccount = newRoleDataArr.filter((item) => {
      return item?.label != rowData?.account_name;
    });
    setAccounctListData(removeAccount);
  }, []);

  const handleChange = (e, key) => {
    const { value } = e.target;
    console.log(value);
    if (key === "account_id") {
      setSelectedAccountId(value);
    }
    setFormData((prevState) => ({
      ...prevState,
      [key]: value,
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

    if (formData.role_id.length === 0) {
      setSelectRoleValidations(true);
      return;
    }

    setLoading(true);
    let rolesArr = formData.role_id;
    let finalRolesArr = rolesArr.map((role) => role.value);
    let body = { accounts_id: finalRolesArr + "" };

    const res = await CallPOSTAPI(
      "admin/update-accounts/" + rowData.contact_id,
      body
    );
    if (res?.status) {
      setLoading(false);
      toast.success("Role Updated Successfully");
      setShow(false);
      fetchUserTblData();
    }
  };

  const handleRoleChange = (e) => {
    setFormData({
      ...formData,
      role_id: e,
    });
    setSelectRoleValidations(false);
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

  return (
    <>
      <Modal show={show} onHide={() => setShow(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Multiple Account</Modal.Title>
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
                  <Form.Label>Select Account</Form.Label>
                  <Form.Control
                    type="text"
                    name="account_id"
                    value={formData.account_id}
                    onChange={(e) => handleChange(e, "account_id")}
                    disabled={true}
                  />
                </Form.Group>

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
                  <Form.Label>Select Role*</Form.Label>

                  <MultiSelect
                    hasSelectAll={false}
                    valueRenderer={renderSelectTitle}
                    options={accounctListData}
                    value={formData.role_id}
                    onChange={(e) => handleRoleChange(e)}
                    labelledBy="Select"
                  />

                  {selectRoleValidations && (
                    <Form.Control.Feedback type="" className="text-danger mt-1">
                      Please Select Role.
                    </Form.Control.Feedback>
                  )}
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

export default EditMultipleAccountModal;
