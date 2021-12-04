import React, { Component } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import Layout from "./hocs/Layout";
import Login from './containers//Login/Login'
import SaleCustomer from './containers/SaleCustomer/SaleCustomer'
import ItemCategory from './containers/ItemCategory/ItemCategory'
import Item from './containers/Item/Item'

import PrivateRoute from './containers/PrivateRoute/PrivateRoute'

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Layout>
          <Switch>
            <Route exact 
              path='/login' 
              render={(props) => (
                <Login {...props}  />
              )}
            
            /> 
            <PrivateRoute exact path='/saleCustomer' component={SaleCustomer} /> 
            <PrivateRoute exact path='/itemCategory' component={ItemCategory} /> 
            <PrivateRoute exact path='/item' component={Item} /> 

            <Redirect from="/" to="/login" />

          </Switch>
        </Layout>
      </BrowserRouter>
    );
  }
}

export default App;
