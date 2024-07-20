import React, { useEffect, useState } from "react";
// import './table.css'
import { CallGETAPI } from "../../../helper/API";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { FormatDate } from "../../../helper/Common";
import TableSkeleton from "../skeleton/table/TableSkeleton";
import Assign_Aed_tbl from "../../../components/tables/AEDs/Assign_Aed_tbl";
import DataGrid, {
  Scrolling,
  Paging,
  Column,
} from "devextreme-react/data-grid";
import SubHeadingOther from "../../../components/header/SubHeadingOther";
import Edit from "../../../img/Edit.png";

export default function AssignEquipment() {
  const navigate = useNavigate();
  const { accountId, siteId } = useParams();
  const [equipment_data, set_equipment_data] = useState([]);
  const [accountDetails, setAccountDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const aedId  = searchParams.get("aed_id");

  const sattleArray = (resdata) => {
    const ar1 = [];
    if (resdata) {
      for (let index = 0; index < resdata.length; index++) {
        const element = resdata[index];
        element.un_id = index;
        element.newData = [];
        for (let i2 = 0; i2 < element.data.length; i2++) {
          const el = element.data[i2];
          if (el && el.length > 0) {
            el.un_id2 = i2;
            element.newData.push(el);
          }
        }
        ar1.push(element);
      }
    }
    return ar1;
  };
  const HandleArr = (data)=>{
    const arr = [];
    for (let i1 = 0; i1 < data.length; i1++) {
      const el1 = data[i1];
      const obj = {
        udi1:i1,
        site_id:el1.site_id,
        site_name: el1.site_name,
        data: [],
        aed_id: ''
      }
      for (let index = 0; index < el1.data.length; index++) {
        const el2 = el1.data[index];
        if(el2?.aed_brand){
          el2.aed_id = el2?.aed_details?.aed_id
          // if(searchParams.get("aed_id")){
          //   if(Number(aedId)===Number(obj.aed_id)){
          //     obj.data.push(el2); 
          //   }
          // }else{
          //   obj.data.push(el2);
          // }
          obj.data.push(el2);

        }
      }
      arr.push(obj);
    }
    // let resArr = [];
    // if(searchParams.get("aed_id")){
    //   const aedId  = searchParams.get("aed_id");
    //   for (let i3 = 0; i3 < arr.length; i3++) {
    //     const e1 = arr[i3];
    //     for (let i4 = 0; i4 < e1?.data.length; i4++) {
    //       const el4 = e1?.data[i4];
    //       const aedDetails = el4.aed_details; 
    //       console.log({aedDetails});
    //         if(Number(aedDetails.aed_id)===Number(aedId)){
    //           // console.log("Condition Got True");
    //           resArr = [e1];
    //         }
    //     }
    //   }
    // }
    // return resArr;
    // for (let i2 = 0; i2 < data?.[0]?.data.length; i2++) {
    //   const el1 = data?.[0]?.data[i2];
    //   if(el1?.aed_brand){
    //     const obj = {
    //       uiid: i2,
    //       site_name: data?.[0]?.site_name,
    //       aed_brand:  el1?.aed_brand,
    //       data:el1.details
    //     }
    //     arr.push(obj);
    //   } 
    // }
    return arr;
  }
  const getDocumentsData = async () => {
    setLoading(true);
    let search_ar = '';
    if(accountId){
      search_ar = "?account_id="+accountId
    }

    if(aedId){
      if(search_ar!=''){
        search_ar += "&aed_id="+aedId;
      }else{
        search_ar = "?aed_id="+aedId;
      }
    }

    if (siteId) {
      const response = await CallGETAPI(
        "account/get-aed-list-by-site/" + siteId + search_ar
      );
      if (response?.status) {
        const ar1 = HandleArr(response.data.data);
        // set_equipment_data(response.data.data);
        set_equipment_data(ar1);
      }
    } else {
      // const response = await CallGETAPI("account/get-aed/", accountId);
      const result = await CallGETAPI('account/get-aed-with-standalon/' + accountId);
      if (result?.status) {
        // const ar1 = sattleArray(response.data.data);
        // set_equipment_data(ar1);
        const resCheck = HandleArr(result.data.data);
        // set_equipment_data(response.data.data);
        set_equipment_data(resCheck);
      }
    }
    setLoading(false);
  };

  const getAccountData = async () => {
    const accountRes = await CallGETAPI(
      `account/account_info_detail/${accountId}`
    );
    const accountData = accountRes?.data?.data?.AccountDetails;
    setAccountDetails(accountData);
  };

  useEffect(() => {
    if (accountId) {
      getAccountData();
      getDocumentsData();
    }
  }, [accountId]);

  const renderContact = (e, name, index) => {
    if (!e?.value) return "N/A";
    let contact = JSON.parse(e?.value);
    if (!contact || !contact[index][name]) {
      return "N/A";
    }
    let currentValue =
      contact && contact[index][name] !== null ? contact[index]?.[name] : "N/A";
    return currentValue;
  };

const handleNavigate  = (item)=>{
  console.log({item});
  let url = "/account/assign-equipment/edit/" + Number(item.site_id);
  if(aedId){
    url  = url+"?aed_id="+aedId    
  }
  navigate(
    url,
    {
      state: { accountId: accountId },
    }
  )
}
  return (
    <>
      {loading ? (
        <>
          <>
            <div className="showloading-table">
              <TableSkeleton />
            </div>
          </>
        </>
      ) : (
        <>
          <div
            className="mt-4"
            style={{ width: "100%", paddingInline: "45px" }}
          >
            <SubHeadingOther
              title={`Account: ${accountDetails?.account_name}`}
              hideNew={true}
              hideHierarchy={true}
              hideInstructor={true}
              subHeading={true}
              bottomLinks={false}
            />

            {equipment_data?.map((item, i) => {
              return (
                <div key={`siteDetail${i}`} className="mb-5">
                  <div
                    className="row"
                    style={{
                      display: "flex",
                      width:"100%",
                      flexDirection: "row",
                      marginLeft: "5px",
                      alignItems:"center",
                      justifyContent: "space-between",
                      // marginBottom: "2%",
                    }}
                  >
                    <h1
                      style={{
                        color: "#000",
                        textAlign: "center",
                        fontSize: "20px",
                        fontStyle: "normal",
                        fontWeight: "700",
                        lineHeight: "normal",
                        width: "86%",
                        textTransform: "uppercase",
                      }}
                    >
                      {item?.site_name}
                    </h1>
                    <button
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        border: "none",
                        width: "70px",
                        background: "white",
                        padding:"0%",
                      }}
                      onClick={()=>handleNavigate(item)}
                    >
                      <img
                        style={{
                          width: "18px",
                          height: "18px",
                          marginRight: "3%",
                          marginBottom:"5px"
                        }}
                        src={Edit}
                      />
                      <h1
                        style={{
                          color: "#0C71C3",
                          fontSize: "18px",
                          fontStyle: "normal",
                          fontWeight: "400",
                          lineHeight: "normal",
                          marginTop: "3%",
                        }}
                      >
                        {" "}
                        Edit
                      </h1>
                    </button>
                  </div>
                  {/* {JSON.stringify(item.data)} */}
                  <DataGrid
                    className="col"
                    dataSource={item.data}
                    // height={10000}
                    width={"auto"}
                    keyExpr="aed_brand"
                    showColumnLines={true}
                    showRowLines={true}
                    showBorders={true}
                    allowSorting={false}
                    rowAlternationEnabled={false}
                  >
                    <Column
                      dataField="aed_brand"
                      width={180}
                      caption="AED Brand / Model"
                      cssClass="column-header"
                      allowSorting={true}
                    />
                    <Column
                      dataField="aed_details.serial_number"
                      cssClass="column-header"
                      allowSorting={true}
                      caption="Serial #"
                    />
                    <Column
                      dataField="aed_details.placement"
                      caption="AED Placement"
                      cssClass="column-header"
                      allowSorting={true}
                    />
                    <Column
                      // dataField="aed_details.assign_user[0].primary"
                      caption="Primary"
                      cssClass="column-header"
                      allowSorting={true}
                      dataField={"aed_details.assign_user"}
                      cellRender={(e) => renderContact(e, "primary", 0)}
                    />
                    <Column
                      // dataField="aed_details.assign_user[1].backup1"
                      caption="Backup 1"
                      cssClass="column-header"
                      allowSorting={true}
                      dataField={"aed_details.assign_user"}
                      cellRender={(e) => renderContact(e, "backup1", 1)}
                    />
                    <Column
                      // dataField="aed_details.assign_user[2].backup2"
                      caption="Backup 2"
                      cssClass="column-header"
                      allowSorting={true}
                      dataField={"aed_details.assign_user"}
                      cellRender={(e) => renderContact(e, "backup2", 2)}
                    />
                    <Column
                      // dataField="aed_details.assign_user[3].backup3"
                      caption="Backup 3"
                      cssClass="column-header"
                      allowSorting={true}
                      dataField={"aed_details.assign_user"}
                      cellRender={(e) => renderContact(e, "backup3", 3)}
                    />
                    <Scrolling columnRenderingMode="virtual" />
                    <Paging enabled={false} />
                  </DataGrid>
                </div>
              );
            })}
          </div>
        </>
      )}
    </>
  );
}
