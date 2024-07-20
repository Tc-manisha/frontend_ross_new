import { Box } from "@mui/material";
import React from "react";
import New from "../../img/New.png";
import DataGrid, {
  Scrolling,
  Paging,
  Column,
} from "devextreme-react/data-grid";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import { getPermission } from "../../helper/Common";
import TableSkeleton from "../../pages/accounts/skeleton/table/TableSkeleton";
import { DecryptToken, GetInpersonClassesByAccountId } from "../../helper/BasicFn";

export default function Inperson() {
  const { accountId } = useParams();
  const [inpersonClasses, setInpersonClasses] = useState([]);
  const [showLoading, setShowLoading] = React.useState(true);
  const navigate = useNavigate();
  const user = DecryptToken();
  const privilege = getPermission();

  // get inperson classes
  const getInpersonClasses = async () => {
    const result = await GetInpersonClassesByAccountId(accountId);

    if (result?.status) {
      setInpersonClasses(result?.classes);
    }

    // show loading false
    setShowLoading(false);
  };

  // get inperson class name
  const inpersonClassesName = (data) => {
    const stateData = {
      type: "Inperson",
    };

    const handleClick = () => {
      navigate(`/account/inperson/details/${data?.class_id}`, {
        state: stateData,
      });
    };

    return (
      <Link
        to={{
          pathname: `/account/inperson/details/${data?.class_id}`,
          state: stateData,
        }}
        style={{
          color: "#0C71C3",
          fontWeight: 600,
          cursor: "pointer",
          textDecoration: "none",
        }}
        onClick={handleClick}
      >
        {data?.course_name}
      </Link>
    );
  };

  // get inperson class name
  const inpersonClassesRegistered = (data) => {
    return <>{data?.registered ?? 0}</>;
  };

  // get trainer column data
  const getTrainerColumnData = (data) => {
    if (
      data?.trainer != null &&
      data?.trainer != undefined &&
      data?.trainer != ""
    ) {
      const trainers = JSON.parse(data?.trainer);
      let trainerText = "";
      trainers.map((trainer, index) => {
        let trainerData =
          trainer?.contact_name + (index == trainers.length - 1 ? "" : ", ");
        trainerText = trainerText + trainerData;
      });

      return (
        <>
          <span className="truncate-one-line" title={trainerText}>
            {trainerText}
          </span>
        </>
      );
    } else {
      return "";
    }
  };

  useEffect(() => {
    getInpersonClasses();
  }, []);

  return (
    <div className="relative" style={{ marginBottom: "5%" }}>
      {/* loading */}
      {showLoading && (
        <div style={{ padding: "3% 0" }}>
          <TableSkeleton />
        </div>
      )}

      {!showLoading && (
        <>
          {/* <Box className="d-flex justify-content-between align-items-center pt-2">
          <div></div>
          <Link style={{ textDecoration: 'none' }} to={"/account/inperson/new/" + accountId}>
            <img src={New} className="ms-1 textSize"/>
            New
          </Link>

        </Box> */}

          {inpersonClasses?.length > 0 ? (
            <>
              {inpersonClasses.map((data, index) => (
                <div key={index}>
                  <>
                    <Box className="d-flex justify-content-between align-items-center pt-2">
                      <h3 className="heading">{data?.siteName}</h3>
                      {(user?.user_type == 0 ||
                        (user?.user_type == 2 &&
                          user?.sub_admin != "" &&
                          privilege?.includes("new-inperson"))) && (
                        <Link
                          style={{ textDecoration: "none" }}
                          to={"/account/inperson/new/" + accountId}
                        >
                          <img src={New} className="ms-1 textSize" />
                          <span style={{color:"#0C71C3"}} > New</span>
                        </Link>
                      )}
                    </Box>

                    {/* data grid table */}
                    <div className="data-table pb-3">
                      <DataGrid
                        dataSource={data?.classes}
                        // height={ 250 }
                        keyExpr="class_id"
                        showColumnLines={true}
                        showRowLines={true}
                        showBorders={false}
                        rowAlternationEnabled={true}
                      >
                        <Column
                          dataField="course_name"
                          cellRender={(e) => inpersonClassesName(e.data)}
                          width={300}
                          caption="Course Name"
                          cssClass="column-header"
                        />
                        <Column
                          dataField="class_date"
                          caption="Class Date"
                          cssClass="column-header"
                        />
                        <Column
                          dataField="maximum"
                          cellRender={(e) => inpersonClassesRegistered(e.data)}
                          caption="Registered"
                          width={150}
                          cssClass="column-header"
                        />
                        <Column
                          dataField="expected"
                          caption="Expected"
                          width={150}
                          cssClass="column-header"
                        />
                        <Column
                          dataField="maximum"
                          caption="Maximum"
                          width={150}
                          cssClass="column-header"
                        />
                        <Column
                          dataField="trainer"
                          cellRender={(e) => getTrainerColumnData(e.data)}
                          caption="Trainer"
                          cssClass="column-header"
                        />
                        <Column
                          dataField="status"
                          caption="Status"
                          width={150}
                          cssClass="column-header"
                        />
                        <Column
                          dataField="address"
                          caption="Address"
                          cssClass="column-header"
                        />

                        <Scrolling columnRenderingMode="virtual" />
                        <Paging enabled={false} />
                      </DataGrid>
                    </div>
                  </>
                </div>
              ))}
            </>
          ) : (
            <>
              {/* data grid table */}
              <Box className="d-flex justify-content-end align-items-center pt-3 pb-3">
                <Link
                  style={{ textDecoration: "none" }}
                  to={"/account/inperson/new/" + accountId}
                >
                  <img src={New} className="ms-1 textSize" />
                 <span style={{color:"#0C71C3"}} > New</span>
                </Link>
              </Box>
              <div className="data-table pb-3">
                <DataGrid
                  dataSource={[]}
                  keyExpr="course_name"
                  showColumnLines={true}
                  showRowLines={true}
                  showBorders={false}
                  rowAlternationEnabled={true}
                >
                  <Column
                    dataField="course_name"
                    width={300}
                    caption="Course Name"
                    cssClass="column-header"
                  />
                  <Column
                    dataField="class_date"
                    caption="Class Date"
                    cssClass="column-header"
                  />
                  <Column
                    dataField="maximum"
                    caption="Registered"
                    width={150}
                    cssClass="column-header"
                  />
                  <Column
                    dataField="expected"
                    caption="Expected"
                    width={150}
                    cssClass="column-header"
                  />
                  <Column
                    dataField="maximum"
                    caption="Maximum"
                    width={150}
                    cssClass="column-header"
                  />
                  <Column
                    dataField="trainer"
                    caption="Trainer"
                    cssClass="column-header"
                  />
                  <Column
                    dataField="status"
                    caption="Status"
                    width={150}
                    cssClass="column-header"
                  />
                  <Column
                    dataField="address"
                    caption="Address"
                    cssClass="column-header"
                  />

                  <Scrolling columnRenderingMode="virtual" />
                  <Paging enabled={false} />
                </DataGrid>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
