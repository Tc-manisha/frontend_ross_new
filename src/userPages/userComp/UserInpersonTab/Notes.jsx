import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import DataGrid, {
  Scrolling,
  Paging,
  Column,
} from "devextreme-react/data-grid";
// import { DateFormate } from '../../../../helper/TblFn';
import Moment from "react-moment";
import Container from "react-bootstrap/Container";
import { CallGETAPI, CallGETAPINEW } from "../../../helper/API";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  FormatDateWithTime,
  GetProfile,
  formatPhoneNumber,
  getPermission,
  prepareOptions,
} from "../../../helper/Common";
import { GetCalendarGroup } from "../../../helper/BasicFn";
// import Notes from '../../tabs/Notes';
import UserNotes from "../../../userPages/userComp/UserNotes";
import Loading from "../../../pages/accounts/Loading";

export default function InpersonNotes({ type = "INPERSON", accountId }) {
  const [inpersonClass, setInpersonsClass] = useState({});
  const [classContacts, setClassContacts] = useState({});
  const [trainingData, setTrainignData] = useState({});
  const { inpersonId } = useParams();
  // const [accountId, setAccountId] = useState('');
  const [showLoading, setShowLoading] = React.useState(true);
  const [accounts, setAccounts] = useState([]);
  const [filteredAccount, setFilterdAccount] = useState([]);
  const [openModel, setOpenModel] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [siteDataList, setsiteDataList] = useState([]);
  const [notesData, setNotesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  let redirectUrl = `/account/new-note?account_id=${accountId}`;

  let profile = GetProfile(); //JSON.parse(localStorage.getItem("ross-profile"))
  let account_id = profile?.account_id;
  let contact_id = profile?.contact_id;


    let privileges = getPermission(); // localStorage.getItem('permissions')

  const fetchData = async () => {
    setShowLoading(true);
    try {
      // let sendUrl = 'notes/account-notes/' + account_id;
      let sendUrl = "user/notes-list";

      if (type === "CONTACT") {
        sendUrl = `notes/contact-notes?account_id=${accountId}&contact_id=${contact_id}`;
      }

      if (type === "SITE") {
        sendUrl = `notes/site-notes?account_id=${accountId}&site_id=${site_id}`;
      }

      if (type === "INPERSON") {
        sendUrl = `notes/inperson-notes?account_id=${accountId}&inperson_id=${inpersonId}`;
      }

      let response = await CallGETAPI(sendUrl);
      let resultData = response?.data?.data || [];

      setNotesData(resultData);
      setShowLoading(false);
    } catch (error) {
      console.error("Error fetching data: ", error);
      setShowLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const [searchInput, setSearchINput] = useState({
    name: "",
    equipment: "",
    training: "",
    type: "",
    parent: "",
    distributor: "",
    owner: "",
    secure: "",
  });
  const location = useLocation();
  const showDelete = location?.state?.showDelete;

  const handleCloseModel = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenModel(false);
  };

  useEffect(() => {
    let filteredData = accounts;
    if (searchInput.name !== "") {
      filteredData = filteredData.filter(({ account_name }) =>
        account_name
          .toLocaleLowerCase()
          .includes(searchInput.name.toLocaleLowerCase())
      );
    }
    if (searchInput.type !== "") {
      filteredData = filteredData.filter(({ customer_type_name }) =>
        customer_type_name
          .toLocaleLowerCase()
          .includes(searchInput.type.toLocaleLowerCase())
      );
    }
    if (searchInput.parent !== "") {
      filteredData = filteredData.filter(({ parent_name }) =>
        parent_name
          .toLocaleLowerCase()
          .includes(searchInput.parent.toLocaleLowerCase())
      );
    }
    if (searchInput.distributor !== "") {
      filteredData = filteredData.filter(({ distributon_name }) =>
        distributon_name
          .toLocaleLowerCase()
          .includes(searchInput.distributor.toLocaleLowerCase())
      );
    }
    if (searchInput.secure !== "") {
      filteredData = filteredData.filter(
        ({ isSecure }) => isSecure == Number(searchInput.secure)
      );
    }

    setFilterdAccount(filteredData);
  }, [searchInput]);

  const [isAsc, setIsAsc] = useState(false);

  const handleSorting = (key) => {
    let sortedData = [...filteredAccount];
    if (sortedData?.[0]?.[key] === undefined) {
      return;
    }
    // isSecure

    const data = sortedData.sort((a, b) => {
      if (Number.isInteger(a[key])) {
        if (isAsc) {
          return b[key] - a[key];
        } else {
          return a[key] - b[key];
        }
      } else {
        let fa = a[key].toLowerCase(),
          fb = b[key].toLowerCase();
        if (isAsc) {
          if (fa < fb) {
            return 1;
          }
          if (fa > fb) {
            return -1;
          }
          return 1;
        } else {
          if (fa < fb) {
            return -1;
          }
          if (fa > fb) {
            return 1;
          }
          return 0;
        }
      }
    });

    setFilterdAccount(data);
    setIsAsc(!isAsc);
  };

  const RenderTitle = (data) => {
    console.log({privileges})
    return (
      <span
        onClick={() =>
          privileges?.includes("note-details") &&
          navigate(`/account/note/${data?.notes_id}`)
        }
        className={privileges?.includes("note-details") ? "link" : ""}
      >
        {data?.title}
      </span>
    );
  };

  const handleDateRender = (e) => {
    return FormatDateWithTime(e?.data?.created_date);
  };

  const handleStatus = (e) => {
    if (e?.data?.active) {
      return <span className="text-left text-success">Active</span>;
    } else {
      return <span className="text-left">Deactive</span>;
    }
  };

  const RenderAccount = () => {
    return (
      <>
        <span>{notesData ? notesData[0]?.account_name : ""}</span>
      </>
    );
  };

  return (
    <>
      {showLoading ? (
        <>
          <div className="showloading">
            <Loading />
          </div>
        </>
      ) : (
        <>
          <Box className="text-left pt-1 pb-1">
            <div className="heading d-flex">
            {privileges?.includes("new-note") && (
              <span className="" style={{ marginLeft: "auto" }}>
                <Link to={redirectUrl} className="btn ">
                  <img
                    src="/edit.svg"
                    alt="Edit"
                    style={{ marginRight: "5px" }}
                  />{" "}
                  New
                </Link>
              </span>
            )}
            </div>
          </Box>
          <DataGrid
            id="account-listing-table"
            dataSource={notesData || []}
            keyExpr="notes_id"
            showBorders={true}
            // height={ 500 }
            showRowLines={true}
            columnAutoWidth={true}
            wordWrapEnabled={true}
          >
            {/* <SearchPanel
                  visible={true}
                  highlightCaseSensitive={true}
                  placeholder="Search by keywords..."
                /> */}
            <Paging defaultPageSize={10} defaultPageIndex={0} />

            <Column
              // dataField="title"
              caption={"Title"}
              cellRender={(e) => RenderTitle(e?.data)}
            />
            <Column
              dataField="related_to"
              caption={"Related to"}
              dataType="string"
              allowSorting={true}
            />
            <Column
              dataField="created_date"
              dataType="string"
              caption={"Created Date"}
              cellRender={(e) => handleDateRender(e)}
              allowSorting={true}
            />
            <Column
              dataField="created_by"
              caption={"Created By"}
              dataType="string"
            />
            <Column
              dataField="access"
              caption={"Access"}
              //   cellRender={(e) => RenderAccParent(e.data)}
              dataType="string"
            />
            <Column
              dataField=""
              caption={"Active"}
              dataType="string"
              cellRender={(e) => handleStatus(e)}
            />
            <Column
              dataField=""
              dataType="string"
              caption={"Account"}
              cellRender={RenderAccount}
              allowSorting={true}
            />
          </DataGrid>
        </>
      )}
    </>
  );
}
