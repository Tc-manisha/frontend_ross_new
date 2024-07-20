
import { Box } from '@mui/material'
import React from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ContactStatus, FormatDate, formatPhoneNumber } from '../../helper/Common';
import { useState } from 'react';
import { CallGETAPI } from '../../helper/API';
import { useEffect } from 'react';
import TableSkeleton from '../../pages/accounts/skeleton/table/TableSkeleton';
import { DataGrid } from 'devextreme-react';
import { Column } from 'devextreme-react/data-grid';
import { RenderEmail, RenderMobile } from '../../helper/BasicFn';
import moment from 'moment';


export default function UserInperson({is_user=false,site_id=0}) {

    const {siteId} = useParams();
    const navigate = useNavigate();
    const [siteContactList,setSiteContactList] = useState([]);
    const [loading,setloading] = useState(false);

    const loadFetch = async()=>{
      setloading(true);
      let res    = await CallGETAPI('user/site-class-list/'+siteId);
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

    const print_phone = (e)=>{
      return RenderMobile(e.data.phone, e.data.phoneext)
    }

    const print_email = (e)=>{
      return RenderEmail(e.value)
    }

    const print_status = (e)=>{
        
        if(!e.data.expiration_date){
            return "";
        }
    
    
        let currentDate = moment();     
        let expDate = moment(e.data.expiration_date);

        if (expDate.isBefore(currentDate, 'day')) {
            return "Expired";
        } else  {
            return "In Progress";
        } 



      return  (<p className={e?.value == 1 ? '' : 'text-danger'}>
      {ContactStatus[e?.value]}
    </p>)
    }
    return (
        <div className='relative'>
            <Box className="d-flex justify-content-between align-items-center py-2">
              <h3 className="heading">Site Inperson Class</h3>
            </Box>
            {loading ? <TableSkeleton tdCount={7} /> : 

<DataGrid
width={'100%'}
height={'auto'}
dataSource={siteContactList}
showBorders={true}
remoteOperations={true}
wordWrapEnabled={true}
>
  <Column dataField="course"  />
  <Column dataField="class_date" cellRender={(e)=>FormatDate(e.value)}   />
  <Column dataField="enrolled"  />
  <Column dataField="trainer"  />
  <Column dataField="address"  />
  <Column dataField="status"  cellRender={print_status} />
  
</DataGrid>
            }
        </div>
    )
}
