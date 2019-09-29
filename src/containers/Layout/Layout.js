import React from 'react';
import styleClasses from './Layout.module.css';

class Layout extends React.Component {
    
    render() {
        
        return (
            <div className={styleClasses.Layout}>
                <h1>Store Locator</h1>
                {this.props.children}
            </div>
        )
    }
}

export default Layout;