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


import { connect } from 'react-redux';
import { logoutFromFirestore } from '../../../../store/actions/actions';

import AddLocationIcon from '@material-ui/icons/AddLocation';
import GetAppIcon from '@material-ui/icons/GetApp';
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
            text: 'View Entries',
            icon: <ViewHeadlineIcon />
        }
    ];

    // const fseLinks = [
    //     {
    //         to: {
    //             pathname: '/',
    //             state: {
    //                 from: window.location.pathname
    //             }
    //         },
    //         text: 'Add Store',
    //         icon: <AddLocationIcon />
    //     },
    //     {
    //         to: {
    //             pathname: '/view-retailers',
    //             state: {
    //                 from: window.location.pathname
    //             }
    //         },
    //         text: 'View Entries',
    //         icon: <ViewHeadlineIcon />
    //     }
    // ];

    const tmLinks = [
        {
            to: '/',
            text: 'Add FSE',
            icon: <PersonAddIcon />
        },
        {
            to: '/view-fses',
            text: 'View FSEs',
            icon: <GroupIcon />
        },
        {
            to: '/view-retailers',
            text: 'View Entries',
            icon: <ViewHeadlineIcon />
        }
    ];

    let links = [...loggedOutLinks];
    let logOutLink = null;

    
    if (props.isAuthenticated) {
        if (localStorage.getItem('isFSE') === 'true') {
            links = [...fseLinks];
        } else if (localStorage.getItem('isFSE') === 'false') {
            links = [...tmLinks];
        }

        logOutLink = (
            <ListItem button onClick={props.logoutFromDb}>
                <ListItemIcon><ExitToAppIcon /></ListItemIcon>
                <ListItemText primary="Logout" onClick={props.drawerCloseHandler} />
            </ListItem>
        )
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
                    {logOutLink}
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

const mapStateToProps = state => ({
    isAuthenticated: state.user.isAuthenticated
})

const mapDispatchToProps = dispatch => ({
    logoutFromDb: () => dispatch(logoutFromFirestore())
});

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);