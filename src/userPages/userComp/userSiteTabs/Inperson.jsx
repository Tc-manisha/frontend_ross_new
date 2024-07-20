import React, { useEffect, useState } from 'react';
import DataGrid, { Scrolling, Paging, Column } from 'devextreme-react/data-grid';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { GetInpersonClassesBySitesId } from '../../../helper/BasicFn';
import { Box } from '@mui/material'
import New from "../../../img/New.png";
import TableSkeleton from '../../../pages/accounts/skeleton/table/TableSkeleton';
import { getPermission } from '../../../helper/Common';
import { isUserPermission, linkTabsPermission } from '../../../helper/permission';

export default function Inperson({ is_user, accountId }) {
  const { siteId } = useParams();
  const [inpersonClasses, setInpersonClasses] = useState([]);
  const [showLoading, setShowLoading] = useState(true);
  const privileges = getPermission();
  const navigate = useNavigate();
  const userPermission = ["inperson-details", "notes-tab"];

  // get inperson classes
  const getInpersonClasses = async () => {
    const result = await GetInpersonClassesBySitesId(siteId);
  console.log(result)
    if (result?.status) {
      setInpersonClasses(result?.classes);
    }

    // show loading false
    setShowLoading(false);
  }

  // get inperson class name
  const inpersonClassesName = (data) => {
    return (
      <span
        className={(isUserPermission("inperson-details") === 1) ? 'link' : ""}
        style={{ textDecoration: 'none' }}
        onClick={() => (isUserPermission("inperson-details") === 1) && navigate('/user/inperson/details/' + data?.class_id)}
      >
        {data?.course_name}
      </span>
    );
  }

  // get inperson class name
  const inpersonClassesRegistered = (data) => {
    return data?.registered ?? 0;
  }

  // get trainer column data
  const getTrainerColumnData = (data) => {
    if (data?.trainer != null && data?.trainer != undefined && data?.trainer != '') {
      const trainers = JSON.parse(data?.trainer);
      let trainerText = '';
      trainers.forEach((trainer, index) => {
        let trainerData = trainer?.contact_name + (index === trainers.length - 1 ?  '' : ', ');
        trainerText = trainerText + trainerData;
      });

      return (
        <span className='truncate-one-line' title={trainerText}>{ trainerText }</span>
      );
    } else {
      return '';
    }
  }

  useEffect(() => {
    getInpersonClasses();
  }, []);

  return (
    <div className='relative'>
      {/* loading */}
      {showLoading && (
        <div className="showloading-table">
          <TableSkeleton />
        </div>
      )}
        <div>

          <Box className="d-flex justify-content-between align-items-center pt-2" style={{ marginBottom: "13px" }}>
              <h3 className="heading">{inpersonClasses?.siteName}</h3>

              {privileges?.includes("new-inperson") && (
              <Link
                style={{ textDecoration: "none" }}
                to={"/account/inperson/new/" + accountId}
              >
                <img src={New} className="ms-1 textSize" />
                 <span style={{color:"#0C71C3"}}> New</span>
                </Link>
              )}
          </Box>

          {/* data grid table */}
          <div className="data-table pb-3">
            <DataGrid
              dataSource={inpersonClasses}
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
              <Column dataField="class_date" caption="Class Date" cssClass="column-header" />
              <Column
                dataField="maximum"
                cellRender={(e) => inpersonClassesRegistered(e.data)}
                caption="Registered"
                width={150}
                cssClass="column-header"
              />
              <Column dataField="expected" caption="Expected" width={150} cssClass="column-header" />
              <Column dataField="maximum" caption="Maximum" width={150} cssClass="column-header" />
              <Column
                dataField="trainer"
                cellRender={(e) => getTrainerColumnData(e.data)}
                caption="Trainer"
                cssClass="column-header"
              />
              <Column dataField="status" caption="Status" width={150} cssClass="column-header" />
              <Column dataField="address" caption="Address" cssClass="column-header" />

              <Scrolling columnRenderingMode="virtual" />
              <Paging enabled={false} />
            </DataGrid>
          </div>
        </div>
    </div>
  );
}