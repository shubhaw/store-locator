import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { AuthProvider } from './hoc/Auth/Auth';
import './App.css';
import Layout from './containers/Layout/Layout';
import AddStore from './containers/AddStore/AddStore';
import Stores from './containers/Stores/Stores';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import Login from './containers/Login/Login';
import CreateProfile from './containers/CreateProfile/CreateProfile';

class App extends React.Component {
    render() {
        return (
            <AuthProvider>
                <BrowserRouter>
                    <Layout>
                        <Switch>
                            <PrivateRoute path="/download-all" component={Stores} />
                            <PrivateRoute path="/" exact component={AddStore} />
                            <Route path="/login" exact component={Login} />
                            <Route path="/create-profile" exact component={CreateProfile} />
                            <Redirect to="/" />
                        </Switch>
                    </Layout>
                </BrowserRouter>
            </AuthProvider>
        )
    }
}

export default App;
