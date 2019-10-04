import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from '../../hoc/Auth/Auth';
import firebaseApp from "../../config/Firebase/firebase";

const PrivateRoute = ({ component: RouteComponent, ...rest }) => {
  
  return (
    <Route
      {...rest}
      render={routeProps =>{
        
        let currentUser = null;
        const setCurrentUser = (user) => user;
        currentUser = firebaseApp.auth().currentUser;
        
        console.log('Shubhaw', currentUser)
        return (
          !!currentUser ? (
            <RouteComponent {...routeProps} />
          ) : (
            <Redirect to={"/login"} />
          ))
      }
      }
    />
  );
};


export default PrivateRoute;