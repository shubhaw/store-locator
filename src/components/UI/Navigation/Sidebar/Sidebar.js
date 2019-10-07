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

const Sidebar = props => {
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
                    {props.links.map(link => (
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