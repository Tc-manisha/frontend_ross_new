import React from 'react'
import { isPermission, linkTabsPermission } from '../../helper/permission'
import { useNavigate } from 'react-router-dom'

const ContactName = ({url,locationState,name}) => {
    const navigate  = useNavigate();
    const userPermission = ["contact-details", "notes-tab"];
    const handleClick = ()=>{
        if(linkTabsPermission(userPermission)){
            navigate(url,locationState);
        }
    }
  return (
    <>
    <span className={isPermission('contact-details')?'link':''} onClick={handleClick}> {name} </span>
    </>
  )
}

export default ContactName