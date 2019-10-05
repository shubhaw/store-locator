import React from 'react';
import {Link} from 'react-router-dom';
import styleClasses from './Layout.module.css';

class Layout extends React.Component {
    
    render() {
        
        return (
            <div className={styleClasses.Layout}>
                {/* <h1>Store Locator</h1> */}
                <Link to='/'>Home </Link>
                <Link to='/download-all'> Download All </Link>
                <Link to='/create-profile'> Create Profile </Link>
                <Link to='/login'> Login </Link>
                {this.props.children}
            </div>
        )
    }
}

export default Layout;