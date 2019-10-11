import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { UPDATE_USER, RESET_STATE } from './store/actions/actionTypes';
import './App.css';
import Layout from './containers/Layout/Layout';
import AddStore from './containers/AddStore/AddStore';
import Stores from './containers/Stores/Stores';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import Login from './containers/Login/Login';
import CreateProfile from './containers/CreateProfile/CreateProfile';
import firebaseApp from './config/Firebase/firebase';
import AddFSE from './containers/FSE/AddFSE/AddFSE';
import ViewFSEs from './containers/FSE/ViewFSEs/ViewFSEs';
import TestContainer from './containers/TestContainer/TestContainer';
import LoginNew from './containers/Login/LoginNew';

class App extends React.Component {

    componentDidMount() {
        this.props.resetState();
        firebaseApp.auth().onAuthStateChanged(user => {
            this.props.updateUser({
                name: user.displayName,
                phoneNumber: user.phoneNumber
            });
        });
    }

    render() {
        // console.log('isAuthenticated', this.props.isAuthenticated, this.props.user);
        return (
            <BrowserRouter>
                <Layout>
                    <Switch>
                        <Route path='/add-fse' exact component={AddFSE} />
                        <PrivateRoute path="/download-all" component={Stores} />
                        <Route path="/" exact component={AddStore} />
                        <Route path="/login" exact component={Login} />
                        <Route path="/login-new" exact component={LoginNew} />
                        <PrivateRoute path="/create-profile" exact component={CreateProfile} />
                        <PrivateRoute path='/view-fses' exact component={ViewFSEs} />
                        <Route path='/test' exact component={TestContainer} />
                        <Redirect to="/" />
                    </Switch>
                </Layout>
            </BrowserRouter>
        )
    }
}

const mapStateToProps = state => {
    return {
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isNewUser: state.isNewUser
    }
}

const mapDispatchToProps = dispatch => {
    return {
        updateUser: (user) => dispatch({ type: UPDATE_USER, user: user }),
        resetState: () => dispatch({ type: RESET_STATE })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
