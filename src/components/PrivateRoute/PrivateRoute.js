import React from "react";
import { connect } from 'react-redux';
import { Route, Redirect } from "react-router-dom";

const PrivateRoute = ({ component: RouteComponent, isAuthenticated, ...rest }) => {
    console.log('[PrivateRoute.js] ----------------starts----------------')
    console.log('[PrivateRoute.js] isAuthenticated:', isAuthenticated);
    console.log('[PrivateRoute.js] {...rest}:', {...rest})
    console.log('[PrivateRoute.js] ----------------mid----------------')
    return (
        <Route
            {...rest}
            render={
                routeProps => {
                    console.log('[PrivateRoute.js] routeProps:', routeProps)
                    console.log('[PrivateRoute.js] ----------------end----------------')
                    return isAuthenticated ? <RouteComponent {...routeProps} /> : <Redirect to='/login' />
                }
            }
        />
    );
};

const mapStateToProps = state => {
    return {
        isAuthenticated: state.user.isAuthenticated
    }
}


export default connect(mapStateToProps)(PrivateRoute);