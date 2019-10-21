import React from "react";
import { connect } from 'react-redux';
import { Route, Redirect } from "react-router-dom";

const PrivateRoute = ({ component: RouteComponent, isAuthenticated, ...rest }) => {

    return (
        <Route
            {...rest}
            render={
                routeProps => {
                    console.log('[PrivateRoute] isAuthenticated:', isAuthenticated, rest);
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