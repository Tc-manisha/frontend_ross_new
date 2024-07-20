import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import "./outOfServiceModal/outOfServiceModal.scss";
import Modal from "react-bootstrap/Modal";
import { useParams } from "react-router-dom";
import { FormControlLabel, Switch, Button } from "@mui/material";
import { toast } from "react-toastify";
import MessageHandler from "../common/MessageHandler";
import { CallGETAPI, CallPOSTAPI } from "../../helper/API";
import { getToken } from "../../helper/Common";
import Select from "react-select";

const SwitchUserModel = ({ openSwitchUser, setOpenSwitchUser }) => {
  const handleClose = () => setOpenSwitchUser(false);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [userList, setUserList] = useState([]);
  const [impersonationToken, setImpersonationToken] = useState(null);

  const fetchOnLoad = async () => {
    const accountsData = await CallGETAPI("account/account-list");
    console.log({accountsData})
    if (accountsData?.status) {
      setAccounts(accountsData?.data?.data?.account);
    }
  };

  const accountOptions = accounts?.map((account) => ({
    value: account.account_id,
    label: account.account_name,
  }));

  const fetchUserList = async () => {
    if (selectedAccount) {
      const res = await CallGETAPI(
        `account/activeuser-based-contacts-list/${selectedAccount?.value}`
      );
      setUserList(res?.data?.data?.contact_list);
    }
  };

  const userOptions = userList?.map((user) => ({
    value: user.contact_id,
    label: user.contact_name,
  }));

  useEffect(() => {
    fetchUserList();
  }, [selectedAccount]);

  useEffect(() => {
    fetchOnLoad();
  }, []);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    let payload = {
      account_id: selectedAccount?.value,
      contact_id: selectedUser?.value,
    };
    const res = await CallPOSTAPI("account/switch-user", payload);
    const permission = res?.data?.permission;
    // toast.error(res?.data?.msg)
    const token = res?.data?.token;
    const refreshtoken = res?.data?.refreshtoken;
    if (token) {
      sessionStorage.removeItem("ross_token");
      sessionStorage.removeItem("ross_rtoken");
      const tokenData = {
        token,
        refreshtoken,
      };
      redirectToUserDashboard(selectedUser, tokenData, permission);
    } else {
      toast.error(res?.data?.msg);
    }
    setLoading(false);
  };

  const redirectToUserDashboard = (userId, tokendata, permission) => {
    const Admintoken = getToken();
    if (Admintoken) {
      const { token, refreshtoken } = tokendata;
      // Construct the user's dashboard URL with the token
      var userProfileUrl = "";
      if (permission) {
        userProfileUrl = permission.includes("dashboard")
          ? `/user-dashboard1/`
          : permission.includes("site-tab")
          ? "/user-listing/sites/"
          : permission.includes("contact-tab")
          ? "/user-listing/contacts/"
          : permission.includes("equipment-tab")
          ? "/user-listing/equipment/"
          : permission.includes("notes-tab")
          ? "/user-listing/notes/"
          : permission.includes("support-tab")
          ? "/user-listing/support/"
          : `/user/Details/${selectedAccount?.value}`;
      }
      handleClose();
      const urlWithToken = `${userProfileUrl}?is_user=1&token=${token}&refresh_token=${refreshtoken}`;
      // Open the URL in a new tab
      window.open(urlWithToken, "_blank");
    } else {
      toast.error("Token not found. Please try again.");
    }
  };

   // Custom styles for react-select
   const customStyles = {
    menu: (provided) => ({
      ...provided,
      maxHeight: '150px',
    }),
    menuList: (provided) => ({
      ...provided,
      maxHeight: '150px',
      overflowY: 'auto',
    }),
  };

  return (
    <>
      <Modal
        show={openSwitchUser}
        onHide={handleClose}
        size="lg"
        style={{ maxWidth: "500px", marginLeft: "30%" }}
        id="outofservice-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title className="d-flex align-items-center gap-3">
            <span>Switch User</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="modal-container" id="outofservice-modal-content">
            <div className="my-modal-section">
              <div className="row">
                <div className="col-md-12 mx-auto">
                  <Form
                    class=""
                    onSubmit={handleSubmit}
                    noValidate
                    // validated={validated}
                    id="outofservice-form"
                  >
                    <div
                      className="bottom-border-blue py-4 px-2"
                      style={{
                        background: "#eee",
                      }}
                    >
                      <div className="row">
                        <Form.Group className="col-md mb-3">
                          <Form.Label htmlFor="account_list">Account List </Form.Label>
                        <Select
                            type="text"
                            name="account_list"
                            value={selectedAccount}
                            options={accountOptions}
                            onChange={setSelectedAccount}
                            styles={customStyles}
                          />
                        </Form.Group>
                      </div>

                      <div className="row">
                        <Form.Group className="col-md mb-3">
                          <Form.Label>User List </Form.Label>
                         <Select
                            type="text"
                            name="loaner_rental_serial"
                            value={selectedUser}
                            options={userOptions}
                            onChange={setSelectedUser}
                            styles={customStyles}
                          />
                        </Form.Group>
                      </div>

                      <div className="row">
                        <Form.Group
                          className="col-md mt-4"
                          style={{ maxWidth: "120px" }}
                        >
                          <Button
                            className={"btn btn-danger"}
                            variant="danger"
                            type="button"
                            style={{ fontSize: "16px", marginTop: "2px" }}
                            onClick={() => {
                              handleClose();
                            }}
                          >
                            Cancel
                          </Button>
                        </Form.Group>

                        <Form.Group
                          className="col-md mt-4"
                          style={{ maxWidth: "100px" }}
                        >
                          <Button
                            className={"btn btn-success"}
                            variant="success"
                            style={{ fontSize: "16px", marginTop: "2px" }}
                            type="submit"
                            disabled={loading}
                           >
                            {loading ? "Loading..." : "Submit"}
                          </Button>
                        </Form.Group>
                      </div>
                    </div>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default SwitchUserModel;
