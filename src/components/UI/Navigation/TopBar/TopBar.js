import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import styleClasses from './TopBar.module.css';

const TopBar = props => {

    return (
        <div className={styleClasses.TopBar}>
            <CssBaseline />
            <AppBar position='fixed' className={styleClasses.appBar}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={props.drawerToggleHandler}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap>{props.pageTitle}</Typography>
                </Toolbar>
            </AppBar>
        </div>
    )
}

export default TopBar;