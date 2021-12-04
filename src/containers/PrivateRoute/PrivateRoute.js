import React from 'react'
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ component: Component, auth, ...rest }) => {
   
    return(
        <Route
        {...rest}
        render={(props) => {
          if (localStorage.getItem('token')) {
            return <Component {...props} />;

          } else {
            return <Redirect to="/login" />;

          }
        }}
      />
  
    )
};
  
  const mapStateToProps = (state) => ({
    auth: state.auth
  });
  
  export default connect(mapStateToProps)(PrivateRoute);