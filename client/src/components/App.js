import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Home from './Home';
import Library from './Library';
import Layout from './Layout';
import MoviePlayer from './MoviePlayer';
import Starred from './Starred';
import Top10 from './Top10';
import Saw from './Saw';
import Signup from './Signup';
import Login from './Login';
import Profile from './Profile';
import Fpassword from './Fpassword';
import ResetPassword from './ResetPassword';



import Cookies from 'universal-cookie'
import { Redirect } from 'react-router'

const cookies = new Cookies();

const SecureRoute = ({path, component}) => {
    if (cookies.get('authtoken')) {
        return (
            <Route exact path={path} component={component}/>
        )
    } else {
        return (
            <Redirect to='/Login' />
        );
    }
}

const App = () => (
  <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Home} />

        <Route exact path="/Signup" component={Signup} />
        <Route exact path="/Login" component={Login} />
        <Route exact path="/Fpassword" component={Fpassword} />
        <Route exact path="/ResetPassword" component={ResetPassword} />

        <Layout>
            <SecureRoute path="/library" component={Library} />
            <SecureRoute path="/library/:tabsValue" component={Library} />
            <SecureRoute path="/movie/:movieId" component={MoviePlayer} />
            <SecureRoute path="/starred" component={Starred} />
            <SecureRoute path="/top10" component={Top10} />
            <SecureRoute path="/saw" component={Saw} />
            <SecureRoute exact path="/Profile" component={Profile} />
        </Layout>
      </Switch>


  </BrowserRouter>
);

export default App;
