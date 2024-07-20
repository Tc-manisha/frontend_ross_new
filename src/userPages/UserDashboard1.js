import React, { useEffect, useState } from "react";
import { Route, useParams, useNavigate } from "react-router-dom";
import TableTopBar from "./userComp/TableTopBar";
import { AccountDetailsTab } from "../utils";
import Sites from "../pages/accounts/tabs/Sites";
import { CallGETAPI, CallGETAPI2, CallPOSTAPI } from "../helper/API";
import UserDashboard from "./UserDashboard";
import { Button, Grid } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import TableSkeleton from "../pages/accounts/skeleton/table/TableSkeleton";
import PermissionDeniedPage from "./userComp/PermissionDeniedPage";
import CircularLoadingComp from "./userComp/CircularLoadingComp";
import { GetProfile, getPermission } from "../helper/Common";
import { DecryptToken } from "../helper/BasicFn";
import SubHeading from "../components/header/SubHeading";
import { isUserPermission, linkTabsPermission } from "../helper/permission";

const UserDashboard1 = () => {
  const navigate = useNavigate();
  const [siteDataList, setsiteDataList] = useState([]);
  const [isUser, setisUser] = useState("");
  const [loading, setLoading] = useState(true);
  const [tabs, setTabs] = useState([]);

  const permissions = getPermission()?.split(",") || [];
  const [permissionsArr, setPermissionsArr] = useState(permissions);
  const [isDash, setIsDash] = useState(permissions.includes("dashboard"));

  const userPermission = [
    "accounts-listing",
    "account-details",
    "account-edit",
    "site-tab",
    "sites-new",
    "site-details",
    "site-details-edit",
    "contact-tab",
    "contacts-new",
    "contact-details",
    "contact-details-edit",
    "equipment-tab",
    "new-aed",
    "aed-details",
    "aed-edit",
    "move-aed",
    "assign-aed",
    "new-accessories",
    "move-accessory",
    "new-aed-checks",
    "aed-check-details",
    "aed-service-check",
    "service-check-details",
    "training-tab",
    "training-new",
    "training-details",
    "edit-training",
    "inperson-tab",
    "new-inperson",
    "inperson-details",
    "edit-inperson",
    "pops-tab",
    "new-pop",
    "pop-details",
    "pop-edit",
    "notes-tab",
    "new-note",
    "note-details",
    "edit-note",
    "email-tab",
    "support-tab",
    "new-support",
    "support-details",
    "edit-support",
    "documents-tab",
    "new-document",
    "document-details",
    "edit-document",
    "rfi-tab",
    "new-rfi",
    "rfi-details",
    "edit-rfi",
    "out-of-service",
    "support-respond",
    "support-reassign",
    "support-close",
    "pop-clone",
    "inperson-clone",
    "inperson-student-tab",
    "inperson-certification-tab",
    "inperson-instructor",
    "inperson-broadcast",
  ];

  const userData = DecryptToken();
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const fetchLoad = async () => {
    let result1 = await CallGETAPI("user/user-permissions");
    const isUser = result1?.data.isTraining;
    setisUser(isUser);
    // setLoading(false);
  };

  useEffect(() => {
    fetchLoad();
  }, [isUser]);

  const handleCardClick = (selectedTab) => {
    navigate(`/user/${selectedTab}/${userData?.account_id}`, {
      state: { userData: userData, tabs: tabs, selectedTab: selectedTab },
    });
  };

  const staticCardData = [
    {
      title: "Checks Needed",
      value: "25000",
      bg: "#315A05",
      color: "white",
      aeds: 6,
      equipment: 8,
      img: "/check.png",
      footer: "Equipment Checks",
      width: 80,
      height: 90,
      link: "Equipment",
      id: "equipment-tab",
    },
    {
      title: "Equipment",
      value: "25000",
      bg: "#8D181B",
      color: "white",
      aeds: 6,
      equipment: 8,
      img: "/equipment.png",
      footer: "Equipment",
      link: "Equipment",
      id: "equipment-tab",
    },
    {
      title: "Support",
      value: "25000",
      bg: "#BF7609",
      color: "white",
      openTickets: 9,
      responses: 7,
      img: "/support.png",
      footer: "Supports",
      width: 80,
      height: 90,
      link: "Support",
      id: "support-tab",
    },
    {
      title: "Equipment Alerts",
      value: "25000",
      bg: "#0C71C3",
      color: "white",
      equipment: 6,
      check: 4,
      plan: 4,
      bg: "linear-gradient(to top right, #FFE800 50%, #E40000 50%)",
      img: "/warning.png",
      footer: "Alerts",
      width: 80,
      height: 90,
      link: "Equipment",
      id: "equipment-tab",
    },
    {
      title: "AEDs",
      value: "25000",
      bg: "#999999",
      color: "white",
      cardiacScience: "2 Cardiac Science G5",
      heartSine: "4 HeartSine samaritan 450P",
      physio: "2 Physio-Control CR2",
      physioPlus: "2 Physio-Control CR Plus",
      img: "/pie-chart-1.png",
      width: 120,
      height: 120,
      link: "Equipment",
      id: "equipment-tab",
    },
    {
      title: "AEDs Distribution",
      value: "25000",
      bg: "black",
      color: "white",
      rickenbacker: "Meep Fitness Rickenbacker",
      lindbergh: "Meep Fitness Lindbergh",
      martha: "Meep Fitness Martha Terrace",
      woodfield: "Meep Fitness Woodfield",
      img: "/pie-chart-2.png",
      width: 120,
      height: 120,
      link: "Equipment",
      id: "equipment-tab",
    },
    {
      title: "Training Distribution",
      value: "25000",
      bg: "#E4E4E4",
      color: "black",
      rickenbacker: "Meep Fitness Rickenbacker",
      lindbergh: "Meep Fitness Lindbergh",
      martha: "Meep Fitness Martha Terrace",
      woodfield: "Meep Fitness Woodfield",
      img: "/pie-chart-3.png",
      width: 120,
      height: 120,
      link: "Training",
      id: "training-tab",
    },
    {
      title: "Training",
      value: "25000",
      bg: "#784AFF",
      color: "white",
      trained: "20 CPR Trained",
      expire90: "0 Expire 90 days",
      expire60: "0 Expire 60 days",
      expire30: "0 Expire 30 days",
      img: "/sheild.png",
      footer: "Equipment Checks",
      width: 80,
      height: 90,
      link: "Training",
      id: "training-tab",
    },
    {
      title: "Classes Scheduled",
      value: "25000",
      bg: "#ACE997",
      color: "black",
      img: "/calendar.png",
      footer: "Inperson Classes",
      classesScheduled: 1,
      width: 80,
      height: 90,
      link: "Inperson",
      id: "inperson-tab",
    },
    {
      title: "Seats Remain",
      value: "25000",
      bg: "#5CB200",
      color: "white",
      seatsAvl: 4,
      img: "/calendar-alt.png",
      footer: "Assign",
      width: 80,
      height: 90,
      link: "Inperson",
      id: "inperson-tab",
    },
  ];

  const filteredStaticCardData = staticCardData?.filter((item) =>
    permissions?.includes(item.id)
  );

  const chunkArray = (array, chunkSizes) => {
    const chunks = [];
    let startIndex = 0;

    chunkSizes.forEach((chunkSize) => {
      chunks.push(array.slice(startIndex, startIndex + chunkSize));
      startIndex += chunkSize;
    });

    return chunks;
  };

  const cardChunks = chunkArray(filteredStaticCardData, [4, 3, 4]);

  const deniedDivStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "70vh",
    flexDirection: "column",
  };

  const deniedBtnStyle = {
    background: "#1976D2",
    color: "white",
    padding: "1.5% 4%",
    marginTop: "2%",
    border: "none",
    boxShadow: "none",
  };

  const handleBack = () => {
    navigate(-1);
  };

  const token = DecryptToken();
  const accountId = token?.account_id;
  const permission = getPermission();

  const handleAccount = async () => {
    try {
      const accountsData = await CallGETAPI("user/user-account-list-v1");
      const multipleAccount =
        accountsData?.data?.data?.accountlist.length > 0 ? true : false;
      if (multipleAccount) {
        navigate("/user-listing/account");
      } else {
        permission.includes("account-details")
          ? navigate("/user/Details/" + accountId)
          : permission.includes("site-tab")
          ? navigate("/user/Sites/" + accountId)
          : permission.includes("contact-tab")
          ? navigate("/user/Contacts/" + accountId)
          : permission.includes("equipment-tab")
          ? navigate("/user/Equipment/" + accountId)
          : permission.includes("notes-tab")
          ? navigate("/user/Notes/" + accountId)
          : permission.includes("support-tab")
          ? navigate("/user/Support/" + accountId)
          : permission.includes("training-tab")
          ? navigate("/user/Training/" + accountId)
          : permission.includes("email-tab")
          ? navigate("/user/Emails/" + accountId)
          : permission.includes("documents-tab")
          ? navigate("/user/Documents/" + accountId)
          : permission.includes("rfi-tab")
          ? navigate("/user/RFI/" + accountId)
          : "";
      }
    } catch (error) {
      console.error("Error fetching accounts data:", error);
    }
  };

  return (
    <div>
      {loading ? (
        <>
          <CircularLoadingComp />
        </>
      ) : (
        <>
          {permissions && permissions.includes("dashboard") ? (
            <>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginTop: "1%",
                  width: "100%",
                  paddingInline: "3%",
                  alignItems: "center",
                  // marginBottom: "6%",
                }}
              >
                {filteredStaticCardData?.length === 0 ? (
                  <>
                    <SubHeading
                      hideNew={true}
                      hideHierarchy={true}
                      title={"Dashboard"}
                      // newUrl="/new-account"
                      subHeading={true}
                      backTab={false}
                    />
                    <div style={deniedDivStyle}>
                      <div
                        className="text-center "
                        style={{
                          // minHeight: "40vh",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          flexDirection: "column",
                        }}
                      >
                        <h6
                          style={{ margin: 0, padding: 0, marginBottom: "7px" }}
                        >
                          No Data Found.
                        </h6>
                        {(linkTabsPermission(userPermission) === 1) && (
                          <button
                            className="btn btn-primary"
                            onClick={handleAccount}
                          >
                            Go to Account
                          </button>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {cardChunks?.map((chunk, rowIndex) => (
                      <div
                        key={rowIndex}
                        style={{
                          display: "flex",
                          justifyContent: "left",
                          margin: "5px 0",
                        }}
                      >
                        {chunk.map((card, cardIndex) => (
                          <div
                            key={cardIndex}
                            style={{
                              ...cardStyle,
                              background: card.bg,
                              width:
                                rowIndex === 1 &&
                                (cardIndex === 0 ||
                                  cardIndex === 1 ||
                                  cardIndex === 2)
                                  ? 470
                                  : 350,
                              padding:
                                rowIndex === 1 &&
                                (cardIndex === 0 ||
                                  cardIndex === 1 ||
                                  cardIndex === 2)
                                  ? "1% 0"
                                  : "0 0 1%",
                            }}
                            onClick={() => handleCardClick(card.link)}
                          >
                            <h1
                              className="Text"
                              style={{ ...titleStyle, color: card.color }}
                            >
                              {card.title}
                            </h1>
                            <Grid container spacing={0}>
                              <Grid
                                item
                                xs={6}
                                style={{ textAlign: "center", color: "white" }}
                              >
                                <img
                                  src={card?.img}
                                  style={{
                                    ...imageStyle,
                                    width: card?.width,
                                    height: card?.height,
                                  }}
                                  alt={card.title}
                                />
                              </Grid>
                              <Grid
                                item
                                xs={6}
                                style={{
                                  color: "white",
                                  display: "flex",
                                  flexDirection: "column",
                                  justifyContent: "center",
                                  color: card.color,
                                }}
                              >
                                <div>
                                  {card?.aeds ? card?.aeds + " AEDS" : ""}
                                </div>
                                <div>
                                  {card?.equipment
                                    ? card?.equipment + " Equipment"
                                    : ""}
                                </div>
                                <div>
                                  {card?.check ? card?.check + " Checks" : ""}
                                </div>
                                <div>
                                  {card?.plan ? card?.plan + " Plans" : ""}
                                </div>
                                <div>
                                  {card?.openTickets
                                    ? card?.openTickets + " Open Tickets"
                                    : ""}
                                </div>
                                <div>
                                  {card?.responses
                                    ? card?.responses + " Responses"
                                    : ""}
                                </div>
                                <div>
                                  {card?.classesScheduled
                                    ? card?.classesScheduled +
                                      " Classes Scheduled"
                                    : ""}
                                </div>

                                <div style={{ color: "#9747FF" }}>
                                  {card?.cardiacScience
                                    ? card?.cardiacScience
                                    : ""}
                                </div>
                                <div style={{ color: "#00FF00" }}>
                                  {card?.heartSine ? card?.heartSine : ""}
                                </div>
                                <div style={{ color: "#8D181B" }}>
                                  {card?.physio ? card?.physio : ""}
                                </div>
                                <div style={{ color: "#FFE800" }}>
                                  {card?.physioPlus ? card?.physioPlus : ""}
                                </div>

                                <div style={{ color: "#00FF00" }}>
                                  {card?.rickenbacker ? card?.rickenbacker : ""}
                                </div>
                                <div style={{ color: "#8D181B" }}>
                                  {card?.lindbergh ? card?.lindbergh : ""}
                                </div>
                                <div style={{ color: "#FFE800" }}>
                                  {card?.martha ? card?.martha : ""}
                                </div>
                                <div style={{ color: "#9747FF" }}>
                                  {card?.woodfield ? card?.woodfield : ""}
                                </div>

                                <div>{card?.trained ? card?.trained : ""}</div>
                                <div>
                                  {card?.expire90 ? card?.expire90 : ""}
                                </div>
                                <div>
                                  {card?.expire60 ? card?.expire60 : ""}
                                </div>
                                <div>
                                  {card?.expire30 ? card?.expire30 : ""}
                                </div>

                                <div>
                                  {card?.seatsAvl
                                    ? card?.seatsAvl + " Seats Available"
                                    : ""}
                                </div>
                              </Grid>
                            </Grid>
                            {card?.footer ? (
                              <>
                                <Button variant="contained" style={buttonStyle}>
                                  {card?.footer}
                                </Button>
                              </>
                            ) : (
                              <></>
                            )}
                          </div>
                        ))}
                      </div>
                    ))}
                  </>
                )}
              </div>
            </>
          ) : (
            // :
            // <>
            //   <PermissionDeniedPage />
            // </>
            <>
              <CircularLoadingComp />
            </>
          )}
        </>
      )}
    </div>
  );
};

const cardStyle = {
  // minWidth: '350px',
  width: "calc(20% - 20px)",
  // padding: '0 0 1%',
  margin: "10px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "5px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  cursor: "pointer",
};

const imageStyle = {
  // width: 80,
  // height: 90,
  boxShadow: "none",
};

const titleStyle = {
  fontSize: "30px",
  margin: "10px",
  color: "white",
};

const buttonStyle = {
  boxShadow: "none",
  borderRadius: 5,
  border: "1px solid white",
  marginTop: "6%",
  textTransform: "none",
};

export default UserDashboard1;
