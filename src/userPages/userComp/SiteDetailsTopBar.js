import React from 'react'
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function SiteDetailsTopBar({ tabldList, tab, siteId, setCurrentTab }) {

    const navigate = useNavigate()

    const hanldeTabClick = (tabItem) => {
        setCurrentTab(tabItem.name)
        navigate(`/user/site-details/${siteId}/${tabItem.name}`)
    }

    return (
        <>
            <Box className="bg-primary" sx={{ width: '100%' }}>
                <div className="d-flex border-bottom border-secondary">
                    {Object.values(tabldList).map((tabItem, i) => (
                        <div key={i}
                            onClick={() => hanldeTabClick(tabItem)}
                            className={"text-light py-2 px-3 tab-button text-decoration-none"}
                            style={{ cursor: 'pointer', backgroundColor: `${tabItem.name === tab ? "#26AEE0" : "#0C71C3"}` }}
                        >
                            {tabItem.name}
                        </div>
                    ))}
                </div>
            </Box>
        </>
    )
}

export default SiteDetailsTopBar