import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Home from './Home';
import Signup from './Signup';
import Login from './Login';

const App = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/signup" component={Signup} />
      <Route exact path="/Login" component={Login} />
      <Route component={Home} />
    </Switch>
  </BrowserRouter>
);

export default App;
