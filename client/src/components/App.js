import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Home from './Home';
import Signup from './Signup';
import Login from './Login';
import Profile from './Profile';
import Qd from './Qd';

const App = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/Signup" component={Signup} />
      <Route exact path="/Login" component={Login} />
      <Route exact path="/Profile" component={Profile} />
      <Route exact path="/Qd" component={Qd} />
      <Route component={Home} />
    </Switch>
  </BrowserRouter>
);

export default App;
