import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { DataGrid } from "devextreme-react";
import { Column, Paging, Scrolling } from "devextreme-react/data-grid";
import { CallGETAPI } from '../../../helper/API';
import SubHeadingOther from '../../../components/header/SubHeadingOther';
import { toast } from 'react-toastify';
import Loading from '../Loading';
// import "../../../components/calendar/styles.module.scss";

const AedServiceCheck = () => {

  const [selectedRows, setSelectedRows] = useState([]);
  const [serviceCheckTblData, setServiceCheckTblData] = useState([]);
  const { accountId, siteId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  const siteName = location.state ? location.state.siteName : null;
  const [newTblData, setNewTblData] = useState([]);
  const fetchData = async () => {
    setLoading(true);
    const res = await CallGETAPI(`account/get-aed-by-site-id/${accountId}/${siteId}`)
    console.log(res?.data?.data);
    const ld = res?.data?.data;
    const NewArrData = [];
    for (let i = 0; i < ld.length; i++) {
      const el = ld[i];
      console.log({ aed_brand: el.aed_brand });
      const obj = {
        id: el.aed_details.aed_id,
        brand: el.aed_brand,
        ...el.aed_details
      }
      NewArrData.push(obj);

    }
    console.log({ NewArrData });
    setNewTblData(NewArrData);
    setServiceCheckTblData(res?.data?.data);
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, [accountId, siteId])

  const handleCheckboxSelectionChanged = (e) => {
    setSelectedRows(e.selectedRowKeys);
  };
  console.log({ newTblData })
  const handleSubmit = () => {
    try {
      if (selectedRows.length > 0) {
        // Assuming 'aed_details' contains 'aed_id'
        const selectedRowId = selectedRows;
        console.log(selectedRowId)
        navigate(`/account/aed/service-check/service1/${accountId}/${siteId}/aedId?aedId=${encodeURIComponent(selectedRowId)}`);
      } else {
        console.error('Please select a row before submitting.');
        toast.error('Please select a AED before submitting.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Please select a AED before submitting.');
    }
  };
  console.log('newTblData: ', newTblData)

  return (
    <>
      {loading && (
        <>
          <div className="showloading">
            <Loading />
          </div>
        </>
      )}

      {!loading && (<>
        <div className="mt-4" style={{ width: "100%", paddingInline: "2%" }}>
          <SubHeadingOther
            hideNew={true}
            hideHierarchy={true}
            hideInstructor={true}
            subHeading={true}
            bottomLinks={false}
            account={5}
            editUrl={false}
            assign_equipment={true}
          />

          <div className='col mb-3' style={{ display: "flex", justifyContent: "center", flexDirection: "column" }}>
            <h2 className="heading" style={{ textAlign: "center" }}>{siteName}</h2>


            <DataGrid className="col"
              dataSource={newTblData}
              height={"auto"}
              width={"auto"}
              keyExpr={"id"}
              showColumnLines={true}
              showRowLines={true}
              showBorders={true}
              allowSorting={true}
              rowAlternationEnabled={true}
              selection={{
                mode: 'multiple',
                showCheckBoxesMode: 'onClick',
                allowSelectAll: true,
                selectedRowKeys: selectedRows
              }}
              onSelectionChanged={handleCheckboxSelectionChanged}
            >
              <Column dataField="Type" width={180} caption="Type" cssClass="column-header"
                allowSorting={true} cellRender={(data) => { return <span>AED</span> }} />
              <Column dataField="brand" caption="Brand/Model" cssClass="column-header" allowSorting={true} dataType="string" />
              <Column dataField="serial_number" caption="Serial #" cssClass="column-header" allowSorting={true} dataType="string" />
              <Column dataField="placement" caption="Placement" cssClass="column-header" allowSorting={true} dataType="string" />
              <Scrolling columnRenderingMode="virtual" />
              <Paging enabled={false} />
            </DataGrid>

          </div>

          <div className="row pb-3 py-4" style={{ marginBottom: '6%' }} >
            <div className="col-12 content-flex-right" >
              <button className="btn text-uppercase cancel-button" type="button" onClick={() => navigate(-1)}>Cancel</button>
              <button className="btn text-uppercase ms-4 submit-button" type="submit" onClick={handleSubmit} >Submit</button>
            </div>
          </div>
        </div>
      </>)}
    </>
  )
}

export default AedServiceCheck;