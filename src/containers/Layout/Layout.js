import React from 'react';
import styleClasses from './Layout.module.css';
import Sidebar from '../../components/UI/Navigation/Sidebar/Sidebar';

import HomeIcon from '@material-ui/icons/Home';
import GetAppIcon from '@material-ui/icons/GetApp';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import GroupIcon from '@material-ui/icons/Group';
import TopBar from '../../components/UI/Navigation/TopBar/TopBar';

class Layout extends React.Component {
    state = {
        links: [
            {
                to: '/',
                text: 'Home',
                icon: <HomeIcon />
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
                to: '/login',
                text: 'Login',
                icon: <VpnKeyIcon />
            },
            {
                to: '/logout',
                text: 'Logout',
                icon: <ExitToAppIcon />
            }
        ],
        isSideDrawerVisible: false
    }

    drawerToggleHandler = () => {
        console.log('Drawer Toggler clicked!');
        this.setState(prevState => ({
            isSideDrawerVisible: !prevState.isSideDrawerVisible
        }))
    }

    render() {
        return (
            <React.Fragment>
                <TopBar drawerToggleHandler={this.drawerToggleHandler} />
                <Sidebar show={this.state.isSideDrawerVisible} links={this.state.links} drawerCloseHandler={this.drawerToggleHandler} />
                <div className={styleClasses.Layout}>
                    {this.props.children}
                </div>
            </React.Fragment>
        )
    }
}

export default Layout;