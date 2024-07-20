import React, { useEffect, useState } from "react";
// import './table.css'
import { CallGETAPI, CallPOSTAPI } from "../../../helper/API";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import TableSkeleton from "../skeleton/table/TableSkeleton";
import DataGrid, {
  Scrolling,
  Paging,
  Column,
} from "devextreme-react/data-grid";
import SubHeadingOther from "../../../components/header/SubHeadingOther";
import Edit from "../../../img/Edit.png";
import Select from "react-select";
import { toast } from "react-toastify";
import AssignEquipTbl from "../../../components/tables/Equipments/AssignEquipTbl";

const AssignEquipmentEdit = () => {
  const navigate = useNavigate();
  const { siteId } = useParams();
  const { state } = useLocation();
  const { accountId } = state || {};
  const [equipment_data, set_equipment_data] = useState(null);
  const [contact_list, set_contact_list] = useState([]);
  const [allAedId, setAllAedId] = useState([]);
  const [loading, setLoading] = useState(false);
  const [accountDetails, setAccountDetails] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const aedIdNew = searchParams.get("aed_id");
  const [equipment, setEquipment] = useState([]);

  const getAccountData = async () => {
    const accountRes = await CallGETAPI(
      `account/account_info_detail/${accountId}`
    );
    const accountData = accountRes?.data?.data?.AccountDetails;
    setAccountDetails(accountData);
  };

  const getDocumentsData = async () => {
    let is_aed = "";
    if (aedIdNew) {
      is_aed = "?aed_id=" + aedIdNew;
    }
    const response = await CallGETAPI(
      "account/get-aed-by-site-id/",
      `${accountId}/${siteId}` + is_aed
    );
    console.log({ response })

    if (response?.status) {
      const arr = response.data;
      const newArr = [];
      for (let i1 = 0; i1 < arr.data.length; i1++) {
        const ar = arr.data[i1];
        const ad = ar?.aed_details?.assign_user;
        const au = ad ? JSON.parse(ad) : [];
        ar.primary = au.find((it2) => it2.type === "primary")?.contact_id;
        ar.backup1 = au.find((it2) => it2.type === "backup1")?.contact_id;
        ar.backup2 = au.find((it2) => it2.type === "backup2")?.contact_id;
        ar.backup3 = au.find((it2) => it2.type === "backup3")?.contact_id;
        newArr.push(ar);
      }
      // console.log({newArr,oldData:response.data.data[0]});
      response.data.data[0].data = newArr;
      set_equipment_data(response.data.data[0]);
      response.data.data[0].data.map(
        (item) =>
          item?.aed_details?.aed_id &&
          setAllAedId((prev) => [...prev, item?.aed_details?.aed_id])
      );
    }
  };

  useEffect(() => {
    if (siteId) {
      getDocumentsData();
    }
  }, [siteId]);

  const getContactsData = async () => {
    setLoading(true);
    const response = await CallGETAPI(
      "account/account-contacts-list/",
      accountId
    );

    if (response?.status) {
      set_contact_list(response.data.data.contact_list);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accountId) {
      getAccountData();
      getContactsData();
    }
  }, [accountId]);

  const [primary, setPrimary] = useState([]);
  const [backup1, setBackup1] = useState([]);
  const [backup2, setBackup2] = useState([]);
  const [backup3, setBackup3] = useState([]);

  const handlePrimaryAssignment = (e, cellEvent) => {
    let aedId = cellEvent?.data?.aed_details?.aed_id;
    let rowIndex = cellEvent?.rowIndex;

    let index = e.nativeEvent.target.selectedIndex;
    let label = e.nativeEvent.target[index].text;

    const searchObject = primary.find((item) => item.aed_id === aedId);

    if (searchObject) {
      const newState = primary.map((obj) => {
        if (obj.aed_id === aedId) {
          return {
            ...obj,
            primary: label,
            contact_id: e?.target.value,
            rowIndex: rowIndex,
          };
        }
        return obj;
      });
      setPrimary(newState);
    } else {
      //   {
      //     "equipments":[
      //         {"aed_id":6,"users":[{"primary":"Rahul Phalke","contact_id":"1"},{"backup1":"Gautam Phalke","contact_id":"2"}]}
      //         ]
      // }
      setPrimary((prev) => [
        ...prev,
        {
          aed_id: aedId,
          primary: label,
          contact_id: e?.target.value,
          rowIndex: rowIndex,
        },
      ]);
    }
  };

  const handleBackup1Assignment = (e, cellEvent) => {
    let aedId = cellEvent?.data?.aed_details?.aed_id;
    let rowIndex = cellEvent?.rowIndex;
    const searchObject = backup1.find((item) => item.aed_id === aedId);

    let index = e.nativeEvent.target.selectedIndex;
    let label = e.nativeEvent.target[index].text;

    if (searchObject) {
      const newState = backup1.map((obj) => {
        if (obj.aed_id === aedId) {
          return {
            ...obj,
            backup1: label,
            contact_id: e?.target.value,
            rowIndex: rowIndex,
          };
        }
        return obj;
      });
      setBackup1(newState);
    } else {
      setBackup1((prev) => [
        ...prev,
        {
          aed_id: aedId,
          backup1: label,
          contact_id: e?.target.value,
          rowIndex: rowIndex,
        },
      ]);
    }
  };

  const handleBackup2Assignment = (e, cellEvent) => {
    let aedId = cellEvent?.data?.aed_details?.aed_id;
    let rowIndex = cellEvent?.rowIndex;
    const searchObject = backup2.find((item) => item.aed_id === aedId);

    let index = e.nativeEvent.target.selectedIndex;
    let label = e.nativeEvent.target[index].text;

    if (searchObject) {
      const newState = backup2.map((obj) => {
        if (obj.aed_id === aedId) {
          return {
            ...obj,
            backup2: label,
            contact_id: e?.target.value,
            rowIndex: rowIndex,
          };
        }
        return obj;
      });
      setBackup2(newState);
    } else {
      setBackup2((prev) => [
        ...prev,
        {
          aed_id: aedId,
          backup2: label,
          contact_id: e?.target.value,
          rowIndex: rowIndex,
        },
      ]);
    }
  };

  const handleBackup3Assignment = (e, cellEvent) => {
    let aedId = cellEvent?.data?.aed_details?.aed_id;
    let rowIndex = cellEvent?.rowIndex;
    const searchObject = backup3.find((item) => item.aed_id === aedId);

    let index = e.nativeEvent.target.selectedIndex;
    let label = e.nativeEvent.target[index].text;

    if (searchObject) {
      const newState = backup3.map((obj) => {
        if (obj.aed_id === aedId) {
          return {
            ...obj,
            backup3: label,
            contact_id: e?.target.value,
            rowIndex: rowIndex,
          };
        }
        return obj;
      });
      setBackup3(newState);
    } else {
      setBackup3((prev) => [
        ...prev,
        {
          aed_id: aedId,
          backup3: label,
          contact_id: e?.target.value,
          rowIndex: rowIndex,
        },
      ]);
    }
  };

  const renderPrimary = (cellEvent, name, index) => {
    // const getValue = () => {
    let aedId = cellEvent?.data?.aed_details?.aed_id;
    let contact = JSON.parse(cellEvent?.value);
    let rowIndex = cellEvent?.rowIndex;
    let labelValue = contact ? contact[index]?.primary : "N/A";
    let currentValue = contact ? contact[index]?.contact_id : "N/A";
    // let obj = primary.find((item) => item.rowIndex === rowIndex);
    // let value = "";
    // if (obj) {
    //   value = obj.contact_id;
    //   // return value;
    // }
    // // let currentValue = contact ? contact[index]?.[name] : "N/A";
    // value = contact ? contact[index]?.contact_id : "N/A";

    //   return value;
    // };


    // const searchObject = primary.find((item) => item.aed_id === aedId);

    // if (searchObject) {
    //   const newState = primary.map((obj) => {
    //     if (obj.aed_id === aedId) {
    //       return {
    //         ...obj,
    //         primary: labelValue,
    //         contact_id: currentValue,
    //         rowIndex: rowIndex,
    //       };
    //     }
    //     return obj;
    //   });
    //   setPrimary(newState);
    // } else {
    //   setPrimary((prev) => [
    //     ...prev,
    //     {
    //       aed_id: aedId,
    //       primary: labelValue,
    //       contact_id: currentValue,
    //       rowIndex: rowIndex,
    //     },
    //   ]);
    // }

    return (
      <select
        defaultValue={"N/A"}
        // value={value}
        onChange={(e) => handlePrimaryAssignment(e, cellEvent)}
      >
        <option value="N/A">N/A</option>
        {contact_list?.map((item, i) => (
          <option value={item.contact_id}>{item.contact_name}</option>
        ))}
      </select>
    );
    // return (
    //   <Select
    //     defaultValue={currentValue}
    //     onChange={(e) => handlePrimaryAssignment(e, cellEvent)}
    //     options={[
    //       { value: "N/A", label: "N/A" },
    //       { value: "chocolate", label: "Chocolate" },
    //       { value: "strawberry", label: "Strawberry" },
    //       { value: "vanilla", label: "Vanilla" },
    //     ]}
    //   />
    // );
    // return currentValue;
  };

  const renderBackup1 = (cellEvent, name, index) => {
    // let contact = JSON.parse(cellEvent?.value);
    // let rowIndex = cellEvent?.rowIndex;
    // let obj = backup1.find((item) => item.rowIndex === rowIndex);
    // let value = "";
    // if (obj) {
    //   value = obj.contact_id;
    // }
    // let currentValue = contact ? contact[index]?.[name] : "N/A";
    return (
      <select
        defaultValue={"N/A"}
        // value={value}
        onChange={(e) => handleBackup1Assignment(e, cellEvent)}
      >
        <option value="N/A">N/A</option>
        {contact_list?.map((item, i) => (
          <option value={item.contact_id}>{item.contact_name}</option>
        ))}
      </select>
    );
  };

  const renderBackup2 = (cellEvent, name, index) => {
    // let contact = JSON.parse(cellEvent?.value);
    // let rowIndex = cellEvent?.rowIndex;
    // let obj = backup2.find((item) => item.rowIndex === rowIndex);
    // let value = "";
    // if (obj) {
    //   value = obj.contact_id;
    // }
    // let currentValue = contact ? contact[index]?.[name] : "N/A";
    return (
      <select
        defaultValue={"N/A"}
        // value={value}
        onChange={(e) => handleBackup2Assignment(e, cellEvent)}
      >
        <option value="N/A">N/A</option>
        {contact_list?.map((item, i) => (
          <option value={item.contact_id}>{item.contact_name}</option>
        ))}
      </select>
    );
  };

  const renderBackup3 = (cellEvent, name, index) => {
    // let contact = JSON.parse(cellEvent?.value);
    // let rowIndex = cellEvent?.rowIndex;
    // let obj = backup3.find((item) => item.rowIndex === rowIndex);
    // let value = "";
    // if (obj) {
    //   value = obj.contact_id;
    // }
    // let currentValue = contact ? contact[index]?.[name] : "N/A";
    return (
      <select
        defaultValue={"N/A"}
        // value={value}
        onChange={(e) => handleBackup3Assignment(e, cellEvent)}
      >
        <option value="N/A">N/A</option>
        {contact_list?.map((item, i) => (
          <option value={item.contact_id}>{item.contact_name}</option>
        ))}
      </select>
    );
  };


  const handleEquipmentAssignment = async () => {
    setLoading(true);
    let allEquipments = [];

    for (let i = 0; i < allAedId.length; i++) {
      let aedId = allAedId[i];
      let primaryObj = primary.find((item) => item.aed_id === aedId);
      let backup1Obj = backup1.find((item) => item.aed_id === aedId);
      let backup2Obj = backup2.find((item) => item.aed_id === aedId);
      let backup3Obj = backup3.find((item) => item.aed_id === aedId);

      allEquipments.push({
        aed_id: aedId,
        users: [
          {
            primary: primaryObj?.primary || null,
            contact_id: primaryObj?.contact_id || null,
          },
          {
            backup1: backup1Obj?.backup1 || null,
            contact_id: backup1Obj?.contact_id || null,
          },
          {
            backup2: backup2Obj?.backup2 || null,
            contact_id: backup2Obj?.contact_id || null,
          },
          {
            backup3: backup3Obj?.backup3 || null,
            contact_id: backup3Obj?.contact_id || null,
          },
        ],
      });
    }

    setEquipment(allEquipments);

    const response = await CallPOSTAPI("account/assign-equipment-to-user", {
      equipments: allEquipments,
    });

    if (response?.status) {
      setLoading(false);
      toast.success("Data saved successfully.");
    } else {
      setLoading(false);
    }

  };


  return (
    <>
      {loading ? (
        <>
          <div className="showloading-table">
            <TableSkeleton />
          </div>
        </>
      ) : (
        <>
          <div
            className="mt-4 mb-5"
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

           <div className="mb-5">
            <div
              className="row"
              style={{
                display: "flex",
                flexDirection: "row",
                marginLeft: "30%",
                justifyContent: "space-between",
                marginBottom: "2%",
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
                  width: "520px",
                  margin: "0px",
                }}
              >
                {equipment_data?.site_name}
              </h1>
            </div>
            

            <AssignEquipTbl
              contact_list={contact_list}
              data={equipment_data?.data || []}
            />

            {/* <DataGrid
              className="col"
              dataSource={equipment_data?.data || []}
              // dataSource={[]}
              // height={100}
              width={"auto"}
              keyExpr="aed_details.aed_id"
              showColumnLines={true}
              showRowLines={true}
              showBorders={false}
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
                cellRender={(e) => renderPrimary(e, "primary", 0)}
              />
              <Column
                // dataField="aed_details.assign_user[1].backup1"
                caption="Backup 1"
                cssClass="column-header"
                allowSorting={true}
                dataField={"aed_details.assign_user"}
                cellRender={(e) => renderBackup1(e, "backup1", 1)}
              />
              <Column
                // dataField="aed_details.assign_user[2].backup2"
                caption="Backup 2"
                cssClass="column-header"
                allowSorting={true}
                dataField={"aed_details.assign_user"}
                cellRender={(e) => renderBackup2(e, "backup2", 2)}
              />
              <Column
                // dataField="aed_details.assign_user[3].backup3"
                caption="Backup 3"
                cssClass="column-header"
                allowSorting={true}
                dataField={"aed_details.assign_user"}
                cellRender={(e) => renderBackup3(e, "backup3", 3)}
              />
              <Scrolling columnRenderingMode="virtual" />
              <Paging enabled={false} />
            </DataGrid> */}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default AssignEquipmentEdit;
