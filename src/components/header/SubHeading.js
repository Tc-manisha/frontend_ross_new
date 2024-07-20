import React, { useEffect, useState } from "react";
// import { Container } from "react-bootstrap";
import MenuIcon from "@mui/icons-material/Menu";
import { IconButton } from "@mui/material";
import { useLocation, useNavigate, Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { CallGETAPI } from "../../helper/API";
import { useParams } from "react-router";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import New from "../../img/New.png";
import {
  Form,
  Button as BButton,
  Button as BsButton,
  InputGroup,
  Container,
} from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import { EquipmentIcon } from "../../helper/Icons";
import { resetAllPops } from "../../redux/slices/EquipmentSlice";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../pages/accounts/Loading";
import BreadCrumbs from "../../helper/BreadCrumbs";
import { removeLastItem } from "../../redux/slices/BreadCrumbsSlice";
import Report from "../../img/Xls.png";
import { GetProfile, getPermission } from "../../helper/Common";
import { DecryptToken } from "../../helper/BasicFn";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 386,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function SubHeading({
  setShowSidebar,
  title,
  subTitle = "",
  showEditDelete = false,
  HandleEditDelete,
  handleDrawerOpen,
  hideNew,
  hideHierarchy,
  newUrl,
  editUrl = "",
  subHeading,
  backTab = "",
  outsideClickEvent = "",
  bottomLinks = true,
  account = "",
  contact = "",
  site = "",
  accountName = "",
  contactName = "",
  siteName = "",
  account_id = "",
  assign_equipment = false,
  breadcrumbs,
  forward,
  setForward,
  changeState,
  exportReport,
  currentTab,
  handleExportReport,
  handleExportAed,
  handleExportAccessory,
  tabTbldata,
  Sites
}) {
  const [open, setOpen] = React.useState(false);
  const [openModel, setOpenModel] = React.useState(false);
  const [newTab, setNewTab] = React.useState(false);
  const { accountId } = useParams();
  const { contactId, siteId } = useParams();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const priviledge = getPermission();
  const user = DecryptToken();
  const equipmentFilterData = useSelector(
    (state) => state.accountdetailsequipmentfilter.equipmentFilterData
  );

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const deleteaccount = async () => {
    CallGETAPI("account/delete-account/" + accountId);
    setOpenModel(true);

    navigate("/accounts-listing", {
      state: {
        showDelete: true,
      },
    });
  };

  const location = useLocation();
  const navigate = useNavigate();

  title = location?.state?.siteTitle ?? title;
  // const editUrl = location?.state?.editUrl || "";
  const deleteUrl = location?.state?.deleteUrl || "";

  const HandleEditClick = (url) => {
    navigate(url);
  };

  const HandleBackClick = () => {
    setLoading(true);
    setTimeout(() => {
      window.history.back();
      setLoading(false);
      dispatch(removeLastItem());
    }, 1000);
  };

  useEffect(() => {
    if (outsideClickEvent?.target?.id == "new-tab-btn") {
      setNewTab(false);
    }
  }, [outsideClickEvent]);
  let equipmentUrl = "/assign-quipment/" + accountId;
  equipmentUrl = siteId ? equipmentUrl + "/" + siteId : equipmentUrl;

  return (
    <>
      <Container
        fluid
        id="sub-header"
        className=""
        style={{ display: "flex", flexDirection: "column", width: "'100vw'" }}
      >
        {/* <div style={ { width: '87%', margin: 'auto', padding: '6px 0'} }> */}

        {subHeading && (
          <div
            className=""
            style={{ width: "100%", margin: "auto", padding: "6px 0" }}
          >
            {/* { ToogleIcon() } */}
            <button
              className="btn text-primary"
              type="button"
              onClick={() => {
                HandleBackClick();
              }}
            >
              <img src="/back.svg" alt="svg" style={{ marginRight: "5px" }} />
              <span className="ms-2">Back</span>
            </button>

            {/* {JSON.stringify(breadcrumbs)} */}
            <br />
            {/* <BreadCrumbs  
            // breadcrumbs={breadcrumbs}
             forward={forward} setForward={setForward} changeState={changeState}/> */}

            <div className="d-flex" style={{ paddingLeft: "0px" }}>
              {subTitle ? (
                <div className="site-header">
                  {/* { ToogleIcon() } */}
                  <div className="">
                    <div className="title">{title}</div>
                    <div className="sub-title">{subTitle}</div>
                  </div>
                </div>
              ) : (
                <h1 className={"newAccountH1"}>
                  {/* { ToogleIcon() } */}
                  <span className="account-title">{title}</span>
                </h1>
              )}
            </div>

            {loading && (
              <>
                <div className="showloading">
                  <Loading />
                </div>
              </>
            )}

            {bottomLinks && (
              <div
                className="d-flex"
                style={{ justifyContent: "space-between" }}
              >
                {/* <div style={{display:"flex",width:"100%", justifyContent:"space-between"}}> */}
                <div className="d-flex" style={{ gap: "10px" }}>
                    {((editUrl && user?.user_type == 0) || (editUrl && user?.user_type == 2 && priviledge?.includes("account-edit")) ||
                    (editUrl && Sites == true && user?.user_type == 3 && priviledge?.includes("site-details-edit"))) && (
                    <button
                      className="btn text-primary"
                      type="button"
                      onClick={() => HandleEditClick(editUrl)}
                    >
                      <img
                        src="/edit.svg"
                        alt="svg"
                        style={{ marginRight: "5px" }}
                      />
                      <span className="ms-2">Edit</span>
                    </button>
                  )}
                  {!hideNew && (
                    <button
                      className="btn text-primary"
                      type="button"
                      onClick={() => HandleEditClick(newUrl)}
                    >
                      <img
                        src={New}
                        alt="svg"
                        style={{ marginRight: "5px" }}
                      />
                      <span className="ms-2">New</span>
                    </button>
                  )}

                  {/* {hideNew == "tab" && (
                    <Dropdown> */}
                  {/* <Dropdown.Toggle
                        className="btn btn-transparent text-primary ms-2 bg-white"
                        id="new-tab-btn"
                        style={{ backgroundColor: "transparent !important" }}
                      >
                        <img
                          src="/add.svg"
                          alt="New"
                          style={{ marginRight: "5px" }}
                        />
                        <span className="ms-1">New</span>
                      </Dropdown.Toggle> */}

                  {/* <Dropdown.Menu className="bg-primary menu-dropdown"> */}
                  {/* <Dropdown.Item
                          onClick={() => {
                            navigate("/account/contacts/new/" + accountId);
                          }}
                        >
                          New Contacts
                        </Dropdown.Item> */}
                  {/* <Dropdown.Item>New Documents</Dropdown.Item> */}
                  {/* <Dropdown.Item
                          onClick={() => {
                            navigate("/account/inperson/new/" + accountId);
                          }}
                        >
                          New Inperson
                        </Dropdown.Item> */}
                  {/* <Dropdown.Item
                          onClick={() => {
                            let url =
                              "/account/new-note?account_id=" + accountId;
                            if (contactId) {
                              url += "&contact_id=" + contactId;
                            }

                            // if(siteId){
                            // 	url += "&site_id="+siteId
                            // }
                            navigate(url, {
                              state: {
                                type: contactId ? "contact" : "account",
                                accountId: accountId,
                                contactId: contactId,
                              },
                            });
                          }}
                        >
                          New Note
                        </Dropdown.Item> */}
                  {/* <Dropdown.Item
                          onClick={() => {
                            dispatch(resetAllPops())
                            navigate("/account/new-pop/" + accountId);
                          }}
                        >
                          New POP
                        </Dropdown.Item> */}
                  {/* <Dropdown.Item
                          onClick={() => {
                            navigate("/account/rfi/new/" + accountId);
                          }}
                        >
                          New RFI
                        </Dropdown.Item> */}
                  {/* <Dropdown.Item
                          onClick={() => {
                            const type = accountId
                              ? "account"
                              : contactId
                              ? "contacts"
                              : "site";
                            navigate("/account/new-support", {
                              state: {
                                type,
                                accountId: accountId || "",
                                contactId: contactId || "",
                                // siteId: sitetId || '',
                                accountName: accountName || "",
                                contactName: contactName || "",
                                siteName: siteName || "",
                              },
                            });
                          }}
                        >
                          New Support
                        </Dropdown.Item> */}
                  {/* <Dropdown.Item>New Training</Dropdown.Item> */}
                  {/* <Dropdown.Item
                          onClick={() => {
                            navigate("/account/new/aed/" + accountId);
                          }}
                        >
                          New AED
                        </Dropdown.Item> */}
                  {/* </Dropdown.Menu> */}
                  {/* </Dropdown>
                  // )} */}
                  {!hideHierarchy && (
                    <button className="btn text-primary" type="button">
                      <img
                        src="/hierarchy.svg"
                        alt="svg"
                        style={{ marginRight: "5px" }}
                      />
                      <span className="ms-2">Hierarchy</span>
                    </button>
                  )}
                  {((assign_equipment && user?.user_type == 0) || (assign_equipment && user?.user_type == 2 && user?.sub_admin != "" && priviledge?.includes("assign-aed"))) ? (
                    <button
                      className="btn text-primary ms-2 bg-white"
                      id="new-tab-btn-12111"
                      type="button"
                      style={{ backgroundColor: "transparent !important" }}
                      onClick={() => navigate(equipmentUrl)}
                    >
                      <EquipmentIcon />
                      <span className="ms-1">Assigned AED</span>
                    </button>
                  ) : (
                    ""
                  )}

                  {exportReport &&
                    ((currentTab == "Sites" && tabTbldata.site == true) ||
                      (currentTab == "Contacts" &&
                        tabTbldata.contact == true) ||
                      (currentTab == "Notes" && tabTbldata.note == true) ||
                      (currentTab == "Support" &&
                        tabTbldata.support == true)) && (
                      <button
                        className="btn text-primary ms-2 bg-white"
                        id="new-tab-btn-12111"
                        type="button"
                        style={{ backgroundColor: "transparent !important" }}
                        onClick={handleExportReport}
                      >
                        <img
                          src={Report}
                          alt="Report"
                          style={{ width: "25px", height: "24px" }}
                        />
                        <span className="ms-1"> Export Report</span>
                      </button>
                    )}

                  {exportReport &&
                    currentTab == "Equipment" &&
                    (tabTbldata.equipment.aed == true ||
                      tabTbldata.equipment.accessory == true) && (
                      <Dropdown>
                        <Dropdown.Toggle
                          className="btn btn-transparent text-primary ms-2 bg-white DropDownBtn"
                          id="new-tab-btn"
                          style={{
                            backgroundColor: "transparent !important",
                            border: "none",
                          }}
                        >
                          <img
                            src={Report}
                            alt="Report"
                            style={{ width: "25px", height: "24px" }}
                          />
                          <span className="ms-1 textSize">Export Report</span>
                        </Dropdown.Toggle>

                        <Dropdown.Menu
                          className="bg-primary"
                          style={{ minWidth: "30px" }}
                        >
                          {(tabTbldata.equipment.accessory == true ||
                            equipmentFilterData?.accessories === true) && (
                            <Dropdown.Item
                              className=""
                              onClick={handleExportAccessory}
                            >
                              Accessories
                            </Dropdown.Item>
                          )}
                          {(tabTbldata.equipment.aed == true ||
                            equipmentFilterData?.aed === true) && (
                            <Dropdown.Item
                              className=""
                              onClick={handleExportAed}
                            >
                              AED
                            </Dropdown.Item>
                          )}
                        </Dropdown.Menu>
                      </Dropdown>
                    )}
                </div>

                {/* </div> */}

                {/* <div className="d-flex site-header-btns">
                  {deleteUrl && (
                    <button
                      className="d-flex btn text-danger"
                      type="button"
                      onClick={() => {
                        handleOpen();
                      }}
                    >
                      <img
                        src="/delete.svg"
                        alt="svg"
                        style={{ marginRight: "5px" }}
                      />
                      <span className="ms-2">Delete</span>
                    </button>
                  )}

                  <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box sx={style}>
                      <Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h2"
                      >
                        <div className="text-danger">
                          Are you Sure you Want To Delete!!!
                        </div>
                      </Typography>
                      <div className="w-100 d-flex justify-content-center mt-3">
                        <Button
                          className="bg-danger text-white"
                          style={{ marginRight: "15px" }}
                          onClick={() => {
                            handleClose();
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          className="bg-success text-white"
                          onClick={() => {
                            deleteaccount();
                          }}
                        >
                          Yes
                        </Button>
                      </div>
                    </Box>
                  </Modal>
                </div> */}
              </div>
            )}
          </div>
        )}
      </Container>
    </>
  );
}
