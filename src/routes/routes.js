import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Order from "../pages/order/order"
// eslint-disable-next-line react/prefer-stateless-function
export default function  CustomRouter() {
    return (
      // eslint-disable-next-line react/jsx-props-no-spreading
      <Router>
        <Switch>
          <Route exact path="/">
            <Order />
          </Route>
          <Route path="*">
            Not Found
          </Route>
        </Switch>
      </Router>
    );
}