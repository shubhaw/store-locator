import React from 'react';
import styleClasses from './Sidebar.module.css';
import { Link } from 'react-router-dom';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';

import HomeIcon from '@material-ui/icons/Home';
import AddLocationIcon from '@material-ui/icons/AddLocation';
import GetAppIcon from '@material-ui/icons/GetApp';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import GroupIcon from '@material-ui/icons/Group';
import ViewHeadlineIcon from '@material-ui/icons/ViewHeadline';

const Sidebar = props => {
    const loggedOutLinks = [
        {
            to: '/login',
            text: 'Login',
            icon: <VpnKeyIcon />
        }
    ];

    const fseLinks = [
        {
            to: '/',
            text: 'Add Store',
            icon: <AddLocationIcon />
        },
        {
            to: '/view-retailers',
            text: 'View Retailers',
            icon: <ViewHeadlineIcon />
        },
        {
            to: '/logout',
            text: 'Logout',
            icon: <ExitToAppIcon />
        }
    ];

    const tmLinks = [
        {
            to: '/',
            text: 'Add Store',
            icon: <AddLocationIcon />
        },
        {
            to: '/add-store-old',
            text: 'Add Store Old',
            icon: <HomeIcon />
        },
        {
            to: '/view-retailers',
            text: 'View Retailers',
            icon: <ViewHeadlineIcon />
        },
        {
            to: '/download-all',
            text: 'Download All',
            icon: <GetAppIcon />
        },
        {
            to: '/create-profile',
            text: 'Create Profile',
            icon: <NoteAddIcon />
        },
        {
            to: '/add-fse',
            text: 'Add FSE',
            icon: <PersonAddIcon />
        },
        {
            to: '/view-fses',
            text: 'View FSEs',
            icon: <GroupIcon />
        },
        {
            to: '/logout',
            text: 'Logout',
            icon: <ExitToAppIcon />
        }
    ];

    let links = [...loggedOutLinks];

    if(!localStorage.getItem('isFSE')) {
        links = [...loggedOutLinks];
    } else if(localStorage.getItem('isFSE') === 'true') {
        links = [...fseLinks];
    } else {
        links = [...tmLinks];
    }

    let headerBar = (
        <AppBar position='relative' className={styleClasses.appBar}>
                <Toolbar>
                    <Typography variant="h6" noWrap>Store Locator</Typography>
                </Toolbar>
            </AppBar>
    )
    const sideList = () => {
        return (
            <div
                className={styleClasses.list}
                role="presentation"
            >
                {headerBar}
                <Divider />
                <List>
                    {links.map(link => (
                        <ListItem button key={link.text} component={Link} to={link.to} onClick={props.drawerCloseHandler}>
                            <ListItemIcon>{link.icon}</ListItemIcon>
                            <ListItemText primary={link.text} />
                        </ListItem>
                    ))}
                </List>
            </div>
        );
    }

    return (
        <Drawer anchor="left" open={props.show} variant="temporary" onClose={props.drawerCloseHandler}>
            {sideList()}
        </Drawer>
    )
}

export default Sidebar;