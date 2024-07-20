import React, { useEffect, useState } from "react";
import "../ProductModal/productModal.scss";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { CallGETAPI, CallPOSTAPI } from "../../../helper/API";
import { useParams } from "react-router-dom";
import MessageHandler from "../../common/MessageHandler";
import { sortData } from "../../../helper/Common";

export default function AccountReps({
  ShowRepsModal,
  SetShowRepsModal,
  setAccReps,
  AccReps,
  setAccRepsList,
  AccRepsList,
  type,
  setRepsData,
}) {

  console.log('AccReps', AccReps);

  const { accountId } = useParams();
  const { siteId } = useParams();
  const [removedAccountContact, setRemovedAccountContact] = useState([]);

  const btns = (pid, type, cid, eid) => {
    return (
      <>
        <div className="d-flex">
          <button
            type="button"
            onClick={() => AddPosition(pid, type, cid)}
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
  const [FormMsg, setFormMsg] = useState({ type: true, msg: "" });

  const handleClose = () => SetShowRepsModal(false);

  const handleSubmit = () => {
    if (type === "siteReps") {
      // submit account reps
      handleSiteRepsSubmit();
    } else if (type === "newSiteReps" || type === "newAccountSiteReps") {
      // submit account reps
      handleNewSiteRepsSubmit();
    } else {
      // submit site reps
      handleAccountRepsSubmit();
    }
  };

  // submit account reps
  const handleAccountRepsSubmit = async () => {
    let data = {
      account_id: accountId,
    };
    data.account_reps = [];
    AccReps.map((item) => {
      if (item.primary.id || item.primary.e_id) {
        data.account_reps.push({
          id: item.primary.e_id || "",
          position_id: item.position_id,
          contact_id: item.primary.id,
          is_primary: 1,
          is_backup: 0,
          set_order: item.position_id == 1 ? 3 : 1,
        });
      }

      if (item.backup.id || item.backup.e_id) {
        data.account_reps.push({
          id: item.backup.e_id || "",
          position_id: item.position_id,
          contact_id: item.backup.id,
          is_primary: 0,
          is_backup: 1,
          set_order: item.position_id == 1 ? 4 : 2,
        });
      }
    });

    removedAccountContact?.map((item) => {
      data.account_reps.push(item);
    });

    let result = await CallPOSTAPI("account/update-acc-reps", data);
    setFormMsg({ type: result?.data?.status, msg: result?.data?.msg });
    if (result?.data?.status) {
      setRemovedAccountContact([]);
      handleClose();
    }
  };

  // submit site reps
  const handleSiteRepsSubmit = async () => {
    let data = {
      site_id: siteId,
    };
    data.site_reps = [];
    AccReps.map((item) => {
      if (item.primary.id || item.primary.e_id) {
        data.site_reps.push({
          id: item.primary.e_id || "",
          position_id: item.position_id,
          contact_id: item.primary.id,
          is_primary: 1,
          is_backup: 0,
          set_order: item.position_id == 1 ? 3 : 1,
        });
      }

      if (item.backup.id || item.backup.e_id) {
        data.site_reps.push({
          id: item.backup.e_id || "",
          position_id: item.position_id,
          contact_id: item.backup.id,
          is_primary: 0,
          is_backup: 1,
          set_order: item.position_id == 1 ? 4 : 2,
        });
      }
    });

    removedAccountContact?.map((item) => {
      data.site_reps.push(item);
    });

    let result = await CallPOSTAPI("account/update-site-reps", data);
    setFormMsg({ type: result?.data?.status, msg: result?.data?.msg });
    if (result?.data?.status) {
      setRemovedAccountContact([]);
      handleClose();
    }
  };

  // submit site reps
  const handleNewSiteRepsSubmit = async () => {
    let site_reps = [];
    AccReps.map((item) => {
      if (item.primary.id || item.primary.e_id) {
        site_reps.push({
          id: item.primary.e_id || "",
          position_id: item.position_id,
          contact_id: item.primary.id,
          is_primary: 1,
          is_backup: 0,
          set_order: item.position_id == 1 ? 3 : 1,
        });
      }

      if (item.backup.id || item.backup.e_id) {
        site_reps.push({
          id: item.backup.e_id || "",
          position_id: item.position_id,
          contact_id: item.backup.id,
          is_primary: 0,
          is_backup: 1,
          set_order: item.position_id == 1 ? 4 : 2,
        });
      }
    });

    setRepsData(site_reps);
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

  // add positions
  const AddPosition = (pid, type) => {
    if (!handleCheck.cnId) {
      return "";
    }

    let previousVal = CheckPreviouState(pid, type);
    if (!previousVal) {
      return;
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
      let FindId = newArr.find(
        (e) => e.primary.id === ElAcRps.account_main_contact_id
      );
      let FindID2 = newArr.find(
        (e) => e.backup.id === ElAcRps.account_main_contact_id
      );

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
    if (!cid) {
      return "";
    }

    for (let index = 0; index < AccReps.length; index++) {
      const PreELement = AccReps[index];

      if (PreELement[type].e_id === eid && PreELement.position_id === pid) {
        setRemovedAccountContact((prev) => [
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
      }
      newArr.push(PreELement);
    }
    setAccReps(newArr);

    let NewAccDList = AccRepsList.map((ElAcRps) => {
      if (ElAcRps.account_main_contact_id === cid) {
        return { ...ElAcRps, is_selected: false };
      }
      return ElAcRps;
    });
    setAccRepsList(NewAccDList);
  };

  useEffect(() => {
    let sortedArray = sortData(AccRepsList, "account_main_contact_firstname");
    setAccRepsList(sortedArray);
  }, [AccRepsList]);

  console.log("removedContact", removedAccountContact);

  return (
    <>
      <Modal
        show={ShowRepsModal}
        onHide={handleClose}
        dialogClassName="modal-120w reps-modal"
        aria-labelledby="example-custom-modal-styling-title"
        size="lg"
        id="product-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {type === "siteReps" ? "Assign Site Reps" : " Assign Account Reps"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="modal-container">
            <div className="my-modal-section">
              <div className="upper-div">
                <div
                  className="products"
                  style={{ maxHeight: "400px", overflowY: "auto" }}
                >
                  <ul>
                    <li className="title">
                      {type === "siteReps"
                        ? "Site Contacts"
                        : "Account Contacts"}
                    </li>
                    {AccRepsList.map((single, index) =>
                      single.is_selected ? (
                        ""
                      ) : (
                        <li key={index} className="checkbox">
                          <label
                            htmlFor={
                              "contact_id_" + single.account_main_contact_id
                            }
                          >
                            <input
                              type={"radio"}
                              name="contact_id"
                              onChange={(e) =>
                                setHandleCheck({
                                  cnId: single.account_main_contact_id,
                                  cnName:
                                    single.account_main_contact_firstname +
                                    " " +
                                    single.account_main_contact_lastname,
                                })
                              }
                              value={single.account_main_contact_id}
                              id={
                                "contact_id_" + single.account_main_contact_id
                              }
                            />
                            {single.account_main_contact_firstname +
                              " " +
                              single.account_main_contact_lastname}
                          </label>
                        </li>
                      )
                    )}
                  </ul>
                </div>
                {/* 
                                    <div className="btns">
                                        <button className="select-btn"    onClick={handleAdd}>+</button>
                                        <button className="elemenate-btn" onClick={handleRemove}>-</button>
                                    </div> 
                                */}
                <div className="selected-products">
                  <ul>
                    <li className="title">Assigned Reps</li>
                    {AccReps.map((items, index) => (
                      <li key={index}>
                        <b>{items.position_name}</b>
                        <br />
                        <div className="d-flex my-2">
                          {btns(
                            items.position_id,
                            "primary",
                            items.primary.id,
                            items.primary.e_id
                          )}
                          <b>Primary: {items.primary.val}</b>
                          <br />
                        </div>
                        <div className="d-flex my-2">
                          {btns(
                            items.position_id,
                            "backup",
                            items.backup.id,
                            items.backup.e_id
                          )}
                          <b>Backup: {items.backup.val}</b>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        {/* alert msg */}
        <div className="my-4">
          <MessageHandler
            status={FormMsg.type}
            msg={FormMsg.msg}
            HandleMessage={setFormMsg}
          />
        </div>

        <Modal.Footer>
          {/* bottom buttons */}
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
}
