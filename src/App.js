import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { UPDATE_USER } from './store/actions/actionTypes';
import './App.css';
import Layout from './containers/Layout/Layout';
import AddStore from './containers/AddStore/AddStore';
import Stores from './containers/Stores/Stores';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import Login from './containers/Login/Login';
import CreateProfile from './containers/CreateProfile/CreateProfile';
import firebaseApp from './config/Firebase/firebase';

class App extends React.Component {

    componentDidMount() {
        firebaseApp.auth().onAuthStateChanged(user => {
            this.props.updateUser(user);
        })
    }

    render() {
        // console.log('isAuthenticated', this.props.isAuthenticated, this.props.user);
        return (
            <BrowserRouter>
                <Layout>
                    <Switch>
                        <PrivateRoute path="/download-all" component={Stores} />
                        <PrivateRoute path="/" exact component={AddStore} />
                        <Route path="/login" exact component={Login} />
                        <PrivateRoute path="/create-profile" exact component={CreateProfile} />
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
        updateUser: (user) => dispatch({ type: UPDATE_USER, user: user })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
