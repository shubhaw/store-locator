import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import './App.css';
import Layout from './containers/Layout/Layout';
import AddStore from './containers/AddStore/AddStore';
import Stores from './containers/Stores/Stores';

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Layout>
          <Switch>
            <Route path="/download-all" component={Stores} />
            <Route path="/" exact component={AddStore} />
            <Redirect to="/" />
          </Switch>
        </Layout>
      </BrowserRouter>
    )
  }
}

export default App;
