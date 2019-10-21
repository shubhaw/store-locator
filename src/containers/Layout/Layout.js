import React from 'react';
import styleClasses from './Layout.module.css';
import Sidebar from '../../components/UI/Navigation/Sidebar/Sidebar';
import TopBar from '../../components/UI/Navigation/TopBar/TopBar';


class Layout extends React.Component {
    state = {
        isSideDrawerVisible: false
    }

    drawerToggleHandler = () => {
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