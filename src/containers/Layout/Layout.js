import React from 'react';
import styleClasses from './Layout.module.css';
import AddStore from '../AddStore/AddStore';


class Layout extends React.Component {
    
    render() {
        
        return (
            <div className={styleClasses.Layout}>
                <h1>Store Locator</h1>
                <AddStore />
            </div>
        )
    }
}

export default Layout;