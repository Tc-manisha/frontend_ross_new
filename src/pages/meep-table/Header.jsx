import React, { useState } from 'react'

const Header = () => {

    const [tabsbutton, setTabsButton] = useState("Details")

    const tabs = [
        {name: "Details",components:<></>},
        {name: "Sites",components:<></>},
        {name: "Contacts",components:<></>},
        {name: "Training",components:<></>},
        {name: "In Person",components:<></>},
        {name: "POPS",components:<></>},
        {name: "Notes",components:<></>},
        {name: "Emails",components:<></>},
        {name: "Supports",components:<></>},
        {name: "Documents",components:<></>},
        {name: "Rfi",components:<></>},
    ]
  return (
    <div>
        <div className='bg-primary d-flex header-style'>
            {tabs.map((data) => {
                return <div className={`${tabsbutton == data.name ? "button-style2" : "button-style1"}`} onClick={()=>{setTabsButton(data.name)}}>{data?.name}</div>
            })}
        </div>
    </div>
  )
}

export default Header