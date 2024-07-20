import React,{useEffect, useState} from 'react';
import DataGrid, { Scrolling, Paging, Column,Selection } from 'devextreme-react/data-grid';
import { useNavigate } from 'react-router-dom';
import { CallGETAPI } from '../../../helper/API';
import ReactTooltip from 'react-tooltip';


const classes = [
    {
        ID: 1,
        FirstName: 'John',
        LastName: 'Heart',
        Prefix: 'Mr.',
        Position: 'CEO',
        Picture: 'images/employees/01.png',
        BirthDate: '1964/03/16',
        HireDate: '1995/01/15',
        Notes: 'John has been in the Audio/Video industry since 1990. He has led DevAv as its CEO since 2003.\r\n\r\nWhen not working hard as the CEO, John loves to golf and bowl. He once bowled a perfect game of 300.',
        Address: '351 S Hill St.',
        State: 'Register Assign',
        City: 'Los Angeles',
    },
];

const AedCheck = () => {
    const navigate = useNavigate();
    const [selectedRows, setSelectedRows] = useState([]);
    const [AedDetails,setAEDDetails] = useState({});
    const [loading,setLoading] = useState(false);



    const handleCheckboxSelectionChanged = (e) => {
      setSelectedRows(e.selectedRowKeys);
      if (e.selectedRowKeys.length > 0) {
          navigate('/account/aed-details/check-select');
      }
  };

  const fetchOnLoad = async()=> {
    // const response =  await CallGETAPI('/account/get-aed-by-id/');
    // console.log(response.data);
  }

  useEffect(() =>{
    fetchOnLoad();
  },[])


    return(
        <>
     <div className="mt-4" style={ { width: "100%", paddingInline: "2%" } }>

<div className='col py-2'> 
       <h2 className="heading">Primary Assigned AED</h2>

        <DataGrid className="col"
                     dataSource={classes}
                     height={100}
                     width={"auto"}
                    keyExpr="ID"
                    showColumnLines={true}
                    showRowLines={true}
                    showBorders={false}
                    allowSorting={false}
                    rowAlternationEnabled={false}
                    selection={{
                        mode: 'multiple',
                        showCheckBoxesMode: 'always',
                        allowSelectAll: false,
                        selectedRowKeys: selectedRows
                    }}
                    onSelectionChanged={handleCheckboxSelectionChanged}
                >
                  <Column dataField="Type" width={180} caption="Type" cssClass="column-header" allowSorting={true} />
                  <Column dataField="Brand/Model" cssClass="column-header" allowSorting={true} cellRender={''}/>
                  <Column dataField="Serial #" cssClass="column-header" allowSorting={true} cellRender={''}/>
                  <Column dataField="Asset #" cssClass="column-header" allowSorting={true}  />
                  <Column dataField="Last Check" cssClass="column-header" allowSorting={true}  />
                  <Scrolling columnRenderingMode="virtual" />
                  <Paging enabled={false} />
                </DataGrid>

                </div>


                <div className='col py-2'> 
                <h2 className="heading">Backup Assigned AED</h2>

                <DataGrid className="col"
                   dataSource={classes}
                   height={100}
                   width={"auto"}
                  keyExpr="ID"
                  showColumnLines={true}
                  showRowLines={true}
                  showBorders={false}
                  allowSorting={false}
                  rowAlternationEnabled={false}
                  selection={{
                      mode: 'multiple',
                      showCheckBoxesMode: 'always',
                      allowSelectAll: false,
                      selectedRowKeys: selectedRows
                  }}
                  onSelectionChanged={handleCheckboxSelectionChanged}
              >
              <Column dataField="Type" width={180} caption="Type" cssClass="column-header" allowSorting={true} />
                  <Column dataField="Brand/Model" cssClass="column-header" allowSorting={true} cellRender={''}/>
                  <Column dataField="Serial #" cssClass="column-header" allowSorting={true} cellRender={''}/>
                  <Column dataField="Asset #" cssClass="column-header" allowSorting={true}  />
                  <Column dataField="Last Check" cssClass="column-header" allowSorting={true}  />
                  <Scrolling columnRenderingMode="virtual" />
                  <Paging enabled={false} />
                </DataGrid>
                </div>


                      {/* bottom buttons */}
         <div className="row pb-3 py-5" >
            <div className="col-12 content-flex-right" >
              <button className="btn btn-danger text-uppercase" type="button" onClick={()=>navigate(-1)}>Cancel</button>
              <button className="btn btn-success text-uppercase ms-2" type="submit" >Submit</button>
            </div>
          </div>

      </div>
        </>
    )
}

export default AedCheck;