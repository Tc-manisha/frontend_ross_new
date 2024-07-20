import * as React from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PermissionManagerMenu({ setOpen }) {

    let navigate = useNavigate()

    const [menuOpen, setMenuOpen] = useState(false);
    const handleClick = () => {
        setMenuOpen(!menuOpen);
    };

    const listItems = [
        // {
        //     title: 'Create Role',
        //     link: '/permission-manager/create-position'
        // },
        // {
        //     title: 'Create Tab',
        //     link: '/permission-manager/create-tab'
        // },
        // {
        //     title: 'Create Permission',
        //     link: '/permission-manager/create-permission'
        // },
        // {
        //     title: 'Assign Permission',
        //     link: '/permission-manager/assign-permission'
        // },
        {
            title: 'Assign Admin',
            link: '/account/assign-admin'
        },
        {
            title: 'Multiple Account',
            link: '/account/multiple-account-permission'
        },
        {
            title: 'Create Role',
            link: '/account/assign-create-permission'
        },
        {
            title: 'Role to User',
            link: '/account/assign-permission-user'
        },
        {
            title: 'Role to Position',
            link: '/account/assign-permission-position'
        }
    ]

    const handleItemClick = (item) => {
        navigate(item.link)
        setOpen(false)
    }

    const displayListItems = () => {
        return listItems.map((item) => {
            return (
                <>
                    <ListItemButton onClick={() => handleItemClick(item)}>
                        <ListItemText primary={item.title} />
                    </ListItemButton>
                </>
            )
        })
    }

    return (
        <List
            sx={{ width: '100%', bgcolor: 'transparent', padding: 0 }}
            component="nav"
        >
            <ListItemButton onClick={handleClick}>
                <ListItemText primary="Permission Manager" />
                {menuOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={menuOpen} timeout="auto" unmountOnExit style={{ paddingLeft: '10%' }}>
                <List component="div">
                    {displayListItems()}
                </List>
            </Collapse>
        </List>
    );
}