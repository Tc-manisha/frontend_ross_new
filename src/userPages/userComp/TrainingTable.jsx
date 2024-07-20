
import { Box } from '@mui/material'
import React from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ContactStatus, formatPhoneNumber } from '../../helper/Common';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import { useState } from 'react';
import { CallGETAPI } from '../../helper/API';
import { useEffect } from 'react';
import TableSkeleton from '../../pages/accounts/skeleton/table/TableSkeleton';
// import { DataGrid } from 'devextreme-react';
import DataGrid, { Column } from 'devextreme-react/data-grid';


export default function TrainingTable({is_user=false,site_id=0}) {

    const {siteId} = useParams();
    const navigate = useNavigate();
    const [siteContactList,setSiteContactList] = useState([]);
    const [loading,setloading] = useState(false);

    const loadFetch = async()=>{
      setloading(true);
      
      let res    = await CallGETAPI('user/site-training-list/'+siteId);
      let result = res?.data?.data || [];
      setSiteContactList(result);
      setloading(false);
    }

    const handleRedirect = ()=>{
      if(is_user){

      }else{
        navigate('/account/' + accountId + '/contact-details/' + sC.contact_id, {
          state: {
            // siteTitle: "Contact : " + sC?.contact_name,
            editUrl: "/account/contact-details-edit/" + sC.contact_id,
            deleteUrl: "/account/contact-details-edit/" + sC.contact_id
          }
        })
      }
     
    }


    useEffect(()=>{
      loadFetch();
    },[]);
    return (
        <div className='relative'>
            <Box className="d-flex justify-content-between align-items-center py-2">
              <h3 className="heading">Site Training</h3>
            </Box>

            {loading ? <TableSkeleton tdCount={7} /> : 

            <div className='' >

                <DataGrid 
                    width={'100%'}
                    height={'auto'}
                    dataSource={siteContactList}
                    showBorders={true}
                    remoteOperations={true}
                    wordWrapEnabled={true}
                >
                    <Column dataField="student_name"  />
                    <Column dataField="certification"  />
                    <Column dataField="class"  />
                    <Column dataField="course_name"  />
                    <Column dataField="expiration"  />
                    <Column dataField="student_name"  />
                </DataGrid>
            </div>
            
            }
        </div>
    )
}
