import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { UPDATE_USER, RESET_STATE } from './store/actions/actionTypes';
import './App.css';
import Layout from './containers/Layout/Layout';
import AddRetailer from './containers/Retailers/AddRetailer/AddRetailer';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import firebaseApp from './config/Firebase/firebase';
import AddFSE from './containers/FSE/AddFSE/AddFSE';
import ViewFSEs from './containers/FSE/ViewFSEs/ViewFSEs';
import Login from './containers/Login/Login';
import ViewRetailers from './containers/Retailers/ViewRetailers/ViewRetailers';

class App extends React.Component {

    componentDidMount() {
        console.log('[App.js] componentDidMount()')
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
                <PrivateRoute path="/" exact component={AddRetailer} />
                <PrivateRoute path='/view-retailers' exact component={ViewRetailers} />
                <Route path="/login" exact component={Login} />
                <Redirect to="/" />
            </React.Fragment>
        )
        const tmRoutes = (
            <React.Fragment>
                <PrivateRoute path='/' exact component={AddFSE} />
                <PrivateRoute path='/view-retailers' exact component={ViewRetailers} />
                <PrivateRoute path='/view-fses' exact component={ViewFSEs} />
                <Route path="/login" exact component={Login} />
                <Redirect to="/" />
            </React.Fragment>
        )

        let routes = loggedOutRoutes;

        if(this.props.isAuthenticated && localStorage.getItem('isFSE') && localStorage.getItem('isFSE') === 'true') {
            routes = fseRoutes;
        } else if(this.props.isAuthenticated && localStorage.getItem('isFSE') && localStorage.getItem('isFSE') === 'false') {
            routes = tmRoutes;
        }

        console.log('[App.js] -------------start-------------')
        console.log('[App.js] isAuthenticated:', this.props.isAuthenticated)
        console.log('[App.js] -------------end-------------')
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
