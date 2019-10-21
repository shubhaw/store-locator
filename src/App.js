import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { UPDATE_USER, RESET_STATE } from './store/actions/actionTypes';
import './App.css';
import Layout from './containers/Layout/Layout';
import AddStore from './containers/AddStore/AddStore';
import AddStoreOld from './containers/AddStore/AddStoreOld';
import Stores from './containers/Stores/Stores';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import LoginOld from './containers/Login/LoginOld';
import CreateProfile from './containers/CreateProfile/CreateProfile';
import firebaseApp from './config/Firebase/firebase';
import AddFSE from './containers/FSE/AddFSE/AddFSE';
import ViewFSEs from './containers/FSE/ViewFSEs/ViewFSEs';
import TestContainer from './containers/TestContainer/TestContainer';
import Login from './containers/Login/Login';
import ViewRetailers from './containers/Retailers/ViewRetailers/ViewRetailers';
import Logout from './containers/Logout/Logout';

class App extends React.Component {

    componentDidMount() {
        this.props.resetState();
        firebaseApp.auth().onAuthStateChanged(user => {
            if(user) {
                this.props.updateUser({
                    lapuNumber: (user.phoneNumber).substr(3),
                    managerLapuNumber: localStorage.getItem('managerLapuNumber')
                });
            }
        });
    }

    render() {
        // console.log('isAuthenticated', this.props.isAuthenticated, this.props.user);
        const loggedOutRoutes = (
            <React.Fragment>
                <Route path="/login" exact component={Login} />
                <Redirect to="/login" />
            </React.Fragment>
        )
        const fseRoutes = (
            <React.Fragment>
                <PrivateRoute path="/" exact component={AddStore} />
                <Route path='/view-retailers' exact component={ViewRetailers} />
                <Route path="/login" exact component={Login} />
                <PrivateRoute path='/logout' exact component={Logout} />
                <Redirect to="/" />
            </React.Fragment>
        )
        const tmRoutes = (
            <React.Fragment>
                <PrivateRoute path='/add-fse' exact component={AddFSE} />
                <Route path='/add-store-old' exact component={AddStoreOld} />
                <Route path='/view-retailers' exact component={ViewRetailers} />
                <PrivateRoute path="/download-all" component={Stores} />
                <PrivateRoute path="/" exact component={AddStore} />
                <Route path="/login-old" exact component={LoginOld} />
                <Route path="/login" exact component={Login} />
                <PrivateRoute path="/create-profile" exact component={CreateProfile} />
                <PrivateRoute path='/view-fses' exact component={ViewFSEs} />
                <PrivateRoute path='/logout' exact component={Logout} />
                <Route path='/test' exact component={TestContainer} />
                <Redirect to="/" />
            </React.Fragment>
        )

        let routes = loggedOutRoutes;

        if(this.props.isAuthenticated && localStorage.getItem('isFSE') && localStorage.getItem('isFSE') === 'true') {
            routes = fseRoutes;
        } else if(this.props.isAuthenticated && localStorage.getItem('isFSE') && localStorage.getItem('isFSE') === 'false') {
            routes = tmRoutes;
        }

        return (
            <BrowserRouter>
                <Layout>
                    <Switch>
                        {routes}
                    </Switch>
                </Layout>
            </BrowserRouter>
        )
    }
}

const mapStateToProps = state => {
    return {
        user: state.user,
        isAuthenticated: state.user ? state.user.isAuthenticated : false,
        isNewUser: state.user.isNewUser
    }
}

const mapDispatchToProps = dispatch => {
    return {
        updateUser: (user) => dispatch({ type: UPDATE_USER, user: user }),
        resetState: () => dispatch({ type: RESET_STATE })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
