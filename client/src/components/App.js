import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import Cookies from 'universal-cookie';

import Home from './Home';
import Library from './Library';
import Layout from './Layout';
import MoviePlayer from './MoviePlayer';
import Starred from './Starred';
import Saw from './Saw';
import Signup from './Signup';
import Login from './Login';
import Profile from './Profile';
import Fpassword from './Fpassword';
import ResetPassword from './ResetPassword';
import OtherProfile from './OtherProfile';

const cookies = new Cookies();

const SecureRoute = ({ path, component }) => {
  // TODO: verify informations in jwt with a call api
  if (cookies.get('authtoken')) {
    return (
      <Route exact path={path} component={component} />
    );
  }
  return (
    <Redirect to="/" />
  );
};

const AuthRoute = ({ path, component }) => {
  if (cookies.get('authtoken')) {
    return (
      <Redirect to="/library" />
    );
  }
  return (
    <Route exact path={path} component={component} />
  );
};

const App = () => (
  <BrowserRouter>
    <Switch>
      <AuthRoute exact path="/" component={Home} />

      <AuthRoute exact path="/Signup" component={Signup} />
      <AuthRoute exact path="/Login" component={Login} />
      <AuthRoute exact path="/Fpassword" component={Fpassword} />
      <AuthRoute exact path="/ResetPassword" component={ResetPassword} />

      <Layout>
        <SecureRoute exact path="/library" component={Library} />
        <SecureRoute exact path="/library/:tabsValue" component={Library} />
        <SecureRoute exact path="/movie/:movieId" component={MoviePlayer} />
        <SecureRoute exact path="/starred" component={Starred} />
        <SecureRoute exact path="/saw" component={Saw} />
        <SecureRoute exact path="/profile" component={Profile} />
        <SecureRoute exact path="/otherprofile/:userName" component={OtherProfile} />
      </Layout>
    </Switch>
  </BrowserRouter>
);

export default App;
