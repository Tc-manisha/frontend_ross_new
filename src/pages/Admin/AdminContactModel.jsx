import React, { useState } from "react";
import "../../components/modals/ContactModel/ContactModal.scss";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useParams } from "react-router-dom";
import { FormControlLabel, Switch } from "@mui/material";
import { useEffect } from "react";
import { sortData } from "../../helper/Common";
import MessageHandler from "../../components/common/MessageHandler";
import { CallGETAPI,CallPOSTAPINEW,CallPOSTAPI } from "../../helper/API";

const AdminContactModel = ({
  ShowRepsModal,
  SetShowRepsModal,
  setAccReps,
  AccReps,
  setAccRepsList,
  AccRepsList,
  type,
  setAdminContactModelData,
}) => {
  const [FormMsg, setFormMsg] = React.useState({ type: true, msg: "" });
  const [loading, setLoading] = React.useState(false);
  const [handleList, setHandleList] = React.useState([]);

  const [removedContact, setRemovedContact] = useState([]);
  // const [removedSiteContact, setRemovedSiteContact] = useState([]);

  React.useEffect(() => {
    if (AccReps) {
      setHandleList(AccReps);
    }
  }, [ShowRepsModal]);

  console.log(AccReps)

  const { accountId } = useParams();
  const { siteId } = useParams();

  const btns = (pid, type, cid, eid) => {
    return (
      <>
        <div className="d-flex">
          <button
            type="button"
            onClick={() => AddPosition(pid, type, cid, eid)}
            className="btn mx-2 btn-sm btn-primary "
          >
            +
          </button>
          <button
            type="button"
            onClick={() => RemovePosition(pid, type, cid, eid)}
            className="btn mx-2 btn-sm btn-danger "
          >
            -
          </button>
        </div>
      </>
    );
  };

  const [handleCheck, setHandleCheck] = useState({ cnId: "", cnName: "" });

  const handleClose = () => SetShowRepsModal(false);

  // handle submit function
  const handleSubmit = () => {
    if (type === "siteContact") {
      // handle Admin-Site-Edit Submit
      handleSiteContactsSubmit();
    } else {
      // Handle Admin-Site-New Submit
      handleSiteNewContactsSubmit();
    }
  };

  // submit account contacts
  const handleAccountContactsSubmit = async () => {
    let data = {
      account_id: accountId,
    };
    data.account_contact = [];

    AccReps.map((item) => {
      let PrimaryPermis = item?.primary?.permissions?.toString();
      let BackupPermis = item?.backup?.permissions?.toString();

      if (item.primary.id) {
        // let findPrevData = handleList.find(e=>e)
        data.account_contact.push({
          id: item.id || "",
          position_id: item.position_id,
          contact_id: item.primary.id,
          is_primary: item.primary.id ? 1 : 0,
          is_backup: 0,
          permissions: PrimaryPermis,
          // "set_order": item.position_id == 1 ? 3 : 1
        });
      }

      if (item.backup.id) {
        data.account_contact.push({
          id: item.id || "",
          position_id: item.position_id,
          contact_id: item.backup.id,
          is_primary: 0,
          is_backup: item.backup.id ? 1 : 0,
          permissions: BackupPermis,
        });
      }
    });

    removedContact?.map((item) => {
      data.account_contact.push(item);
    });

    // console.log({ data });

    let result = await CallPOSTAPI("account/update-acc-contact", data);

    setFormMsg({ type: result?.data?.status, msg: result?.data?.msg });
    setLoading(false);
    userCreate(data);
    setRemovedContact([]);
    handleClose();
  };

  const CheckPreviouState = (pid, type) => {
    let FInPosition = AccReps.find((e) => e.position_id === pid);

    if (type === "primary") {
      return FInPosition.backup.id !== handleCheck.cnId;
    }

    if (type === "backup") {
      return FInPosition.primary.id !== handleCheck.cnId;
    }

    return false;
    //
  };

  // Handle Admin-Site-New Submit
  const handleSiteNewContactsSubmit = () => {
    let data = {
      site_id: siteId,
    };

    data.site_contact = [];
    AccReps.map((item) => {
      let PrimaryPermis = item?.primary?.permissions?.toString();
      let BackupPermis = item?.backup?.permissions?.toString();
      if (item.primary.id) {
        data.site_contact.push({
          id: item.id || "",
          position_id: item.position_id,
          contact_id: item.primary.id,
          is_primary: 1,
          is_backup: 0,
          permissions: PrimaryPermis,
          // "set_order": item.position_id == 1 ? 3 : 1
        });
      }

      if (item.backup.id) {
        data.site_contact.push({
          id: item.id || "",
          position_id: item.position_id,
          contact_id: item.backup.id,
          is_primary: 0,
          is_backup: 1,
          permissions: BackupPermis,
        });
      }
    });

    removedContact?.map((item) => {
      data.site_contact.push(item);
    });

    setAdminContactModelData(data);

    // let result = CallPOSTAPI("account/update-site-contact", data);

    // setFormMsg({ type: result?.data?.status, msg: result?.data?.msg });
    setLoading(false);
    userCreate(data);
    setRemovedContact([]);
    handleClose();
  };

  // submit site contacts
  const handleSiteContactsSubmit = () => {
    let data = {
      site_id: siteId,
    };

    data.site_contact = [];
    AccReps.map((item) => {
      let PrimaryPermis = item?.primary?.permissions?.toString();
      let BackupPermis = item?.backup?.permissions?.toString();
      if (item.primary.id) {
        data.site_contact.push({
          id: item.id || "",
          position_id: item.position_id,
          contact_id: item.primary.id,
          is_primary: 1,
          is_backup: 0,
          permissions: PrimaryPermis,
          // "set_order": item.position_id == 1 ? 3 : 1
        });
      }

      if (item.backup.id) {
        data.site_contact.push({
          id: item.id || "",
          position_id: item.position_id,
          contact_id: item.backup.id,
          is_primary: 0,
          is_backup: 1,
          permissions: BackupPermis,
        });
      }
    });

    removedContact?.map((item) => {
      data.site_contact.push(item);
    });

    setAdminContactModelData(data);

    let result = CallPOSTAPI("account/update-site-contact", data);

    setFormMsg({ type: result?.data?.status, msg: result?.data?.msg });
    setLoading(false);
    userCreate(data);
    setRemovedContact([]);
    handleClose();
  };

  // add permissions
  const addPermision = (type, pid, perId, isChecked) => {
    let PrevData = [...AccReps];
    let newArr = [];

    // return;
    for (let index = 0; index < PrevData.length; index++) {
      const PreELement = PrevData[index];
      // ,type, pid, perId,isChecked
      if (PreELement.position_id === pid) {
        perId = perId.toFixed(0);
        if (PreELement[type]?.permissions?.includes(perId)) {
          PreELement[type].permissions = PreELement[type].permissions.filter(
            (id) => id !== perId
          );
        } else {
          PreELement[type].permissions = PreELement?.[type]?.permissions
            ? [...PreELement?.[type]?.permissions, perId]
            : [perId];
        }
      }
      newArr.push(PreELement);
    }
  };

  // add positions
  const AddPosition = (pid, type) => {
    let previousVal = CheckPreviouState(pid, type);
    if (!previousVal) {
      return;
    }

    if (!handleCheck.cnId) {
      return "";
    }
    let PrevData = [...AccReps];
    let newArr = [];
    for (let index = 0; index < PrevData.length; index++) {
      const PreELement = PrevData[index];
      if (PreELement.position_id === pid) {
        PreELement[type].id = handleCheck?.cnId;
        PreELement[type].val = handleCheck?.cnName;
      }
      newArr.push(PreELement);
    }
    setAccReps(newArr);

    let NewAccDList = AccRepsList.map((ElAcRps) => {
      let FindId = newArr.find((e) => e.primary.id === ElAcRps.contact_id);
      let FindID2 = newArr.find((e) => e.backup.id === ElAcRps.contact_id);

      let obj = { ...ElAcRps };
      if (FindId || FindID2) {
        obj.is_selected = false; // true for de selected
        return obj;
      } else {
        obj.is_selected = false;
        return obj;
      }
    });
    setAccRepsList(NewAccDList);
    // setHandleCheck({ cnId: "", cnName: "" }) // End Condition
  };

  // remove positions
  const RemovePosition = (pid, type, cid, eid) => {
    // if(eid){
    //     CallGETAPI(`account/delete-acc-reps/${eid}`)
    // }

    if (!cid) {
      return "";
    }

    // console.log({ pid, type, cid, eid });

    for (let index = 0; index < AccReps.length; index++) {
      const PreELement = AccReps[index];

      // console.log({ PreELement });

      if (PreELement[type].e_id === eid && PreELement.position_id === pid) {
        setRemovedContact((prev) => [
          ...prev,
          {
            id: PreELement[type].e_id || "",
            position_id: pid,
            contact_id: "",
            is_primary: type === "primary" ? 1 : 0,
            is_backup: type === "backup" ? 1 : 0,
            permissions: "",
          },
        ]);
      }
    }

    let PrevData = [...AccReps];
    let newArr = [];
    for (let index = 0; index < PrevData.length; index++) {
      const PreELement = PrevData[index];
      if (PreELement.position_id === pid && PreELement[type].id) {
        PreELement[type].id = "";
        PreELement[type].val = "";
        PreELement[type].permissions = [];
      }

      newArr.push(PreELement);
    }
    console.log({ newArr });
    setAccReps(newArr);

    let NewAccDList = AccRepsList.map((ElAcRps) => {
      if (ElAcRps.contact_id === cid) {
        return { ...ElAcRps, is_selected: false };
      }
      return ElAcRps;
    });

    setAccRepsList(NewAccDList);
  };

  useEffect(() => {
    let sortedArray = sortData(AccRepsList, "contact_name");
    setAccRepsList(sortedArray);
  }, [AccRepsList]);

  // user create
  const userCreate = (contactData) => {
    const contacts = contactData?.account_contact;
    contacts?.map((contact) => {
      let permissions = contact.permissions;
      if (permissions) {
        let allPermissions = permissions.split(",");
        if (allPermissions.includes("1") || allPermissions.includes(1)) {
          const result = CallPOSTAPINEW(
            "account/create-user/" + contact?.contact_id
          );
        }
      }
    });
  };

  console.log("AccReps", AccReps);
  console.log({ removedContact });

  return (
    <>
      <Modal
        show={ShowRepsModal}
        onHide={handleClose}
        dialogClassName="full-width-modal contact-modal-90"
        aria-labelledby="example-custom-modal-styling-title"
        size="xl"
        id="product-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {type === "siteContact"
              ? "Assign Site Contacts"
              : " Assign Account Contacts"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="modal-container" id="contact-modal-content">
            <div className="my-modal-section">
              <div className="upper-div gap-5">
                <div
                  className="products"
                  style={{ maxHeight: "400px", overflowY: "auto" }}
                >
                  <ul>
                    <li className="title">Account Contacts</li>
                    {AccRepsList.map((single) =>
                      single.is_selected ? (
                        ""
                      ) : (
                        <li key={single.contact_id} className="checkbox">
                          <label htmlFor={"contact_id_" + single.contact_id}>
                            <input
                              type={"radio"}
                              name="contact_id"
                              onChange={(e) =>
                                setHandleCheck({
                                  cnId: single.contact_id,
                                  cnName: single.contact_name,
                                })
                              }
                              value={single.contact_id}
                              id={"contact_id_" + single.contact_id}
                            />
                            {single.contact_name}
                          </label>
                        </li>
                      )
                    )}
                  </ul>
                </div>

                <div className="selected-products" style={{ width: "80%" }}>
                  <ul>
                    <li className="title">Assigned Contacts</li>
                    {AccReps.map((items) => (
                      <li key={items.position_id}>
                        <b>{items.position_name}</b>
                        <br />
                        <div className="d-flex my-1">
                          <div className=" d-flex align-items-center">
                            <div className="d-flex w-200">
                              {btns(
                                items.position_id,
                                "primary",
                                items.primary.id,
                                items.primary.e_id
                              )}
                              <b
                                className="d-inline-block text-truncate"
                                style={{ maxWidth: "220px" }}
                                title={items.primary.val}
                              >
                                Primary: {items.primary.val}
                              </b>
                            </div>
                            <table>
                              <tbody>
                                <tr>
                                  {items.permissions
                                    .filter(
                                      (data) =>
                                        data.permissions_name !== "Create User"
                                    )
                                    .map((data, index) => {
                                      // remove the filter if you want to add create user toggle
                                      return (
                                        <td key={index}>
                                          <small className="lx-txt">
                                            {data.permissions_name}
                                          </small>
                                          <FormControlLabel
                                            onChange={(e) =>
                                              addPermision(
                                                "primary",
                                                items.position_id,
                                                data.permission_id,
                                                e.target.checked
                                              )
                                            }
                                            className={""}
                                            label=""
                                            control={
                                              <Switch
                                                color="primary"
                                                size="medium"
                                                value={true}
                                                defaultChecked={
                                                  items.primary.permissions.includes(
                                                    data.permission_id.toString()
                                                  )
                                                    ? true
                                                    : false
                                                }
                                              />
                                            }
                                          />
                                          {/* { (items.primary.permissions.includes(data.permission_id.toString())) ? 'true' : 'false' } */}
                                        </td>
                                      );
                                    })}
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <div className="d-flex my-1 ">
                          <div className="d-flex align-items-center">
                            <div className="d-flex w-200">
                              {btns(
                                items.position_id,
                                "backup",
                                items.backup.id,
                                items.backup.e_id
                              )}
                              <b
                                className="d-inline-block text-truncate"
                                style={{ maxWidth: "220px" }}
                                title={items.backup.val}
                              >
                                Backup: {items.backup.val}
                              </b>
                            </div>
                            <div>
                              <table>
                                <tbody>
                                  <tr>
                                    {items.permissions.map((data, index) => {
                                      return (
                                        <td key={index}>
                                          {/* <small className='lx-txt' >{data.permissions_name}</small> */}
                                          <FormControlLabel
                                            onChange={(e) =>
                                              addPermision(
                                                "backup",
                                                items.position_id,
                                                data.permission_id,
                                                e.target.checked
                                              )
                                            }
                                            className={""}
                                            label=""
                                            control={
                                              <Switch
                                                color="primary"
                                                size="medium"
                                                value={true}
                                                defaultChecked={
                                                  items.backup.permissions.includes(
                                                    data.permission_id.toString()
                                                  )
                                                    ? true
                                                    : false
                                                }
                                              />
                                            }
                                          />
                                          {/* { (items.backup.permissions.includes(data.permission_id.toString())) ? 'true' : 'false' } */}
                                        </td>
                                      );
                                    })}
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>

        {/* alert */}
        <div className="my-4">
          <MessageHandler
            status={FormMsg.type}
            msg={FormMsg.msg}
            HandleMessage={setFormMsg}
          />
        </div>

        <Modal.Footer>
          <button className="Cancel-btn" onClick={handleClose}>
            Cancel
          </button>
          <button className="submit-btn" type="button" onClick={handleSubmit}>
            Submit
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AdminContactModel;
