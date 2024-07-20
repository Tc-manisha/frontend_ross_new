import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import "./table.css";
import Edit from "../../../img/Edit.png";
import New from "../../../img/New.png";
import Check from "../../../img/Check.svg";
// import 'devextreme/dist/css/dx.light.css';
import DataGrid, {
  Scrolling,
  Paging,
  Column,
} from "devextreme-react/data-grid";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CallGETAPI } from "../../../helper/API";
import moment from "moment";
import { DateFormate } from "../../../helper/TblFn";
import {
  DataSymbol,
  DollarsIcon,
  RoundCheck,
  TruckSymbol,
} from "../../../helper/Icons";
import { resetAllPops } from "../../../redux/slices/EquipmentSlice";
import { useDispatch } from "react-redux";
import TableSkeleton from "../skeleton/table/TableSkeleton";
import { GetProfile, getPermission } from "../../../helper/Common";
import { DecryptToken } from "../../../helper/BasicFn";

const customers = [
  {
    ID: 1,
    FirstName: "John",
    LastName: "Heart",
    Prefix: "Mr.",
    Position: "CEO",
    Picture: "images/employees/01.png",
    BirthDate: "1964/03/16",
    HireDate: "1995/01/15",
    Notes:
      "John has been in the Audio/Video industry since 1990. He has led DevAv as its CEO since 2003.\r\n\r\nWhen not working hard as the CEO, John loves to golf and bowl. He once bowled a perfect game of 300.",
    Address: "351 S Hill St.",
    State: "California",
    City: "Los Angeles",
  },
  {
    ID: 2,
    FirstName: "Olivia",
    LastName: "Peyton",
    Prefix: "Mrs.",
    Position: "Sales Assistant",
    Picture: "images/employees/09.png",
    BirthDate: "1981/06/03",
    HireDate: "2012/05/14",
    Notes:
      "Olivia loves to sell. She has been selling DevAV products since 2012. \r\n\r\nOlivia was homecoming queen in high school. She is expecting her first child in 6 months. Good Luck Olivia.",
    Address: "807 W Paseo Del Mar",
    State: "California",
    City: "Los Angeles",
  },
  {
    ID: 3,
    FirstName: "Robert",
    LastName: "Reagan",
    Prefix: "Mr.",
    Position: "CMO",
    Picture: "images/employees/03.png",
    BirthDate: "1974/09/07",
    HireDate: "2002/11/08",
    Notes:
      "Robert was recently voted the CMO of the year by CMO Magazine. He is a proud member of the DevAV Management Team.\r\n\r\nRobert is a championship BBQ chef, so when you get the chance ask him for his secret recipe.",
    Address: "4 Westmoreland Pl.",
    State: "Arkansas",
    City: "Bentonville",
  },
  {
    ID: 4,
    FirstName: "Greta",
    LastName: "Sims",
    Prefix: "Ms.",
    Position: "HR Manager",
    Picture: "images/employees/04.png",
    BirthDate: "1977/11/22",
    HireDate: "1998/04/23",
    Notes:
      "Greta has been DevAV's HR Manager since 2003. She joined DevAV from Sonee Corp.\r\n\r\nGreta is currently training for the NYC marathon. Her best marathon time is 4 hours. Go Greta.",
    Address: "1700 S Grandview Dr.",
    State: "Georgia",
    City: "Atlanta",
  },
  {
    ID: 5,
    FirstName: "Brett",
    LastName: "Wade",
    Prefix: "Mr.",
    Position: "IT Manager",
    Picture: "images/employees/05.png",
    BirthDate: "1968/12/01",
    HireDate: "2009/03/06",
    Notes:
      "Brett came to DevAv from Microsoft and has led our IT department since 2012.\r\n\r\nWhen he is not working hard for DevAV, he coaches Little League (he was a high school pitcher).",
    Address: "1120 Old Mill Rd.",
    State: "Idaho",
    City: "Boise",
  },
  {
    ID: 6,
    FirstName: "Sandra",
    LastName: "Johnson",
    Prefix: "Mrs.",
    Position: "Controller",
    Picture: "images/employees/06.png",
    BirthDate: "1974/11/15",
    HireDate: "2005/05/11",
    Notes:
      "Sandra is a CPA and has been our controller since 2008. She loves to interact with staff so if you've not met her, be certain to say hi.\r\n\r\nSandra has 2 daughters both of whom are accomplished gymnasts.",
    Address: "4600 N Virginia Rd.",
    State: "Utah",
    City: "Beaver",
  },
  {
    ID: 7,
    FirstName: "Kevin",
    LastName: "Carter",
    Prefix: "Mr.",
    Position: "Shipping Manager",
    Picture: "images/employees/07.png",
    BirthDate: "1978/01/09",
    HireDate: "2009/08/11",
    Notes:
      "Kevin is our hard-working shipping manager and has been helping that department work like clockwork for 18 months.\r\n\r\nWhen not in the office, he is usually on the basketball court playing pick-up games.",
    Address: "424 N Main St.",
    State: "California",
    City: "San Diego",
  },
  {
    ID: 8,
    FirstName: "Cynthia",
    LastName: "Stanwick",
    Prefix: "Ms.",
    Position: "HR Assistant",
    Picture: "images/employees/08.png",
    BirthDate: "1985/06/05",
    HireDate: "2008/03/24",
    Notes:
      "Cindy joined us in 2008 and has been in the HR department for 2 years. \r\n\r\nShe was recently awarded employee of the month. Way to go Cindy!",
    Address: "2211 Bonita Dr.",
    State: "Arkansas",
    City: "Little Rock",
  },
  {
    ID: 9,
    FirstName: "Kent",
    LastName: "Samuelson",
    Prefix: "Dr.",
    Position: "Ombudsman",
    Picture: "images/employees/02.png",
    BirthDate: "1972/09/11",
    HireDate: "2009/04/22",
    Notes:
      "As our ombudsman, Kent is on the front-lines solving customer problems and helping our partners address issues out in the field.    He is a classically trained musician and is a member of the Chamber Orchestra.",
    Address: "12100 Mora Dr",
    State: "Missouri",
    City: "St. Louis",
  },
  {
    ID: 10,
    FirstName: "Taylor",
    LastName: "Riley",
    Prefix: "Mr.",
    Position: "Network Admin",
    Picture: "",
    BirthDate: "1982/08/14",
    HireDate: "2012/04/14",
    Notes:
      "If you are like the rest of us at DevAV, then you've probably reached out for help from Taylor. He does a great job as a member of our IT department.",
    Address: "7776 Torreyson Dr",
    State: "California",
    City: "San Jose",
  },
];

export default function Pops({
  accountId,
  site_id = 0,
  contact_id = 0,
  type = "ACCOUNT",
}) {
  let redirectUrl = `/account/new-pop/` + accountId;
  const [loading, setLoading] = useState(true);
  const [popData, setPopData] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = DecryptToken();
  const privilege = getPermission();
  // const {pop_id} = useParams();
  // console.log(pop_id)

  const fetchData = async () => {
    // account/pop-list-by-account/1
    setLoading(true);
    const res = await CallGETAPI("account/pop-list-by-account/" + accountId);
    if (res.data.status) {
      const resultData = res.data.data;
      setPopData(resultData);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  // console.log(accountId);

  // const fetchData = async () => {
  //   try {
  // const [popData,setPopData]  = useState([]);
  //   const [loading, setLoading] = useState(true);

  // let sendUrl = 'notes/account-pop/'+accountId;

  // let response = await CallGETAPI(sendUrl);
  // let resultData = response?.data?.data || [];

  // setPopData(resultData)
  // setLoading(false);
  // } catch (error) {
  // console.error('Error fetching data: ', error);
  // setLoading(false);
  // }

  // useEffect(() => {
  //   fetchData();
  // },[])
  const renderCoverage = (e) => {
    const coverage = e.value;
    const rowData = e.data;
    if (coverage === "Invalid Date") {
      return "";
    }
    // const check =  (rowData?.contract_year) ? moment(coverage).add(parseInt(rowData?.contract_year),'years').format(DateFormate) : "";
    const check = moment(rowData?.contract_start)
      .add(1, "year")
      .format(DateFormate);
    const check2 = moment(rowData?.contract_start).format(DateFormate);
    // if(check==='Invalid date'){
    //   return '';
    // }

    return (
      <div>
        {check2} {check ? " - " + check : ""}
      </div>
    );
  };

  const renderContact = (e) => {
    if (!e.value) {
      return "";
    }
    const valData = JSON.parse(e.value);
    if (!Array.isArray(valData?.contract_officer)) {
      return "";
    }
    console.log({
      chec: typeof valData?.contract_officer,
      check: Array.isArray(valData?.contract_officer),
    });

    return (
      <>
        <ul className="list-unstyled">
          {valData?.contract_officer?.map((it, i) => (
            <li key={i}>
              <Link
              className="link"
              style={{textDecoration:"none"}}
                to={`/account/${accountId}/contact-details/${it?.contact_id}`}
              >
                {it?.contact_name}
              </Link>
            </li>
          ))}
        </ul>
      </>
    );
  };
  const renderStatus = (e) => {
    if (parseInt(e.value) === 1) {
      return "Active";
    }

    if (parseInt(e.value) === 0) {
      return "Inactive";
    }

    if (parseInt(e.value) === 2) {
      return "Cancelled";
    }
    // return e.value===1?'Active':'Inactive';
  };

  const renderQbInvoice = (e) => {
    const data = e.data;
    // invoice_paid
    return (
      <>
        <span className="text-primary">
          {data?.invoice_paid ? <DollarsIcon /> : ""} &nbsp;
        </span>
        {e.value}
      </>
    );
  };
  const renderContract = (e) => {
    const data = e.data;
    const checkIcon = JSON.parse(data?.contract_pricing_equipment) || 0;
    return (
      <>
        {checkIcon ? <DataSymbol /> : ""}
        {data?.shipping === "Charges" ? <TruckSymbol /> : ""} {e.value}
        {/* {data?.contract_pricing_equipment ? <TruckSymbol/>:''} {e.value} */}
        {data?.req && <p className="m-0">Req: {data.req}</p>}
        {data?.order && <p className="m-0 ">Order: {data?.order}</p>}
        {data?.modification && (
          <p className="m-0 ">Mod: {data?.modification}</p>
        )}
      </>
    );
  };

  let profile = GetProfile();//JSON.parse(localStorage.getItem("ross-profile"));
  let is_user = false;

  if (profile.user_type > 1 && profile?.user_type != 2) {
    is_user = true;
  }

  const prefix = is_user ? "/user" : "/account";

  const handleClick = (e, accountId) => {
    console.log("event", e);
    if (is_user === true) {
      navigate(`/user/pop-details/${e.data?.pop_id}/${accountId}`);
    } else {
      navigate(`/account/pop-details/${e.data?.pop_id}/${accountId}`);
    }
  };

  return (
    <div className="relative" style={{ marginBottom: "5%" }}>
      {loading && (
        <div className="" style={{ width: "100%", marginTop: "4%" }}>
          <TableSkeleton />
        </div>
      )}

      {!loading && (
        <>
          {/* heading */}

          <div
            className="d-flex justify-content-end align-items-center"
            style={{
              marginTop: "20px",
              marginBottom: "5px",
              color: "#0c71c3",
              alignItems: "center",
            }}
          > 
          {(user?.user_type == 0 ||
                        (user?.user_type == 2 &&
                          user?.sub_admin != "" &&
                          privilege?.includes("new-pop"))) && (
            <button
              onClick={() => {
                dispatch(resetAllPops());
                navigate(redirectUrl);
              }}
              //to={redirectUrl}
              className="btn "
              style={{ textDecoration: "none", color:"#0C71C3" }}
            >
              <div className="d-flex">
                <div>
                  <img src={New} style={{ marginRight: "5px" }} />
                </div>
                <span styel={{color:"#0C71C3" }}> New</span>
              </div>
            </button>
           )}
          </div>

          {/* data grid table */}
          <div className="data-table pb-3">
            <DataGrid
              dataSource={popData}
              height={"auto"}
              keyExpr="pop_id"
              showColumnLines={true}
              showRowLines={true}
              showBorders={false}
              rowAlternationEnabled={true}
            >
              <Column
                dataField="pop_type"
                width={120}
                caption="POP Type"
                cssClass="column-header"
                cellRender={(e) => {
                  const rowData = e.data;

                  return (
                     <Link
                     className="link"
                      to={`${prefix}/pop-details/${e.data?.pop_id}/${accountId}`}
                      style={{
                        cursor: "pointer",
                        color: "blue",
                        textDecoration: "none",
                      }}
                    >
                      {parseInt(rowData.active) === 1 && (
                        <span style={{ width: "10px" }}>
                          <RoundCheck />
                        </span>
                      )}
                      &nbsp; {e.value}
                    </Link>
                  );
                }}
              />
              <Column
                caption="Contract year"
                dataField="contract_year"
                cssClass="column-header"
                cellRender={(e) => {
                  return <>{e.value ? e.value : ""}</>;
                }}
              />
              <Column
                caption="Coverage"
                dataField="contract_start"
                cssClass="column-header"
                cellRender={renderCoverage}
              />
              <Column
                caption="Contact"
                dataField="contact"
                cellRender={renderContact}
                cssClass="column-header"
              />
              <Column
                caption="Contract Number"
                dataField="contract"
                cssClass="column-header"
                cellRender={renderContract}
              />
              <Column
                caption="QB Invoice #"
                dataField="qb_invoice"
                width={130}
                cssClass="column-header"
                cellRender={renderQbInvoice}
              />
              <Column
                caption="Status"
                dataField="status"
                width={100}
                cssClass="column-header"
                cellRender={renderStatus}
              />
              {/* <Column dataField="HireDate" width={100} dataType="date" cssClass="column-header" /> */}

              <Scrolling columnRenderingMode="virtual" />
              <Paging enabled={false} />
            </DataGrid>
          </div>
        </>
      )}
    </div>
  );
}
